"""Admin campaigns CRUD + image uploads + donation CSV export.

Auth: JWT bearer via `get_current_admin`.
"""

from __future__ import annotations

import csv
import io
import logging
import uuid
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.config import settings
from app.core.security import get_current_admin
from app.db import get_db
from app.models import AdminUser, Campaign, CampaignUpdate, Donation
from app.schemas import (
    CampaignCreate,
    CampaignUpdate as CampaignUpdateSchema,
    CampaignUpdatePostIn,
)
from app.services import campaign_service

log = logging.getLogger("nti.admin.campaigns")

router = APIRouter(prefix="/api/admin", tags=["admin-campaigns"])

UPLOAD_DIR = Path("/app/uploads")
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_UPLOAD_BYTES = 5 * 1024 * 1024  # 5 MB


def _require_admin(current: AdminUser = Depends(get_current_admin)) -> AdminUser:
    return current


# ---------- Campaigns CRUD ----------

@router.get("/campaigns")
def admin_list_campaigns(
    _: str = Depends(_require_admin),
    db: Session = Depends(get_db),
    include_archived: bool = False,
) -> dict:
    q = db.query(Campaign)
    if not include_archived:
        q = q.filter(Campaign.status != "archived")
    rows = q.order_by(Campaign.featured.desc(), Campaign.created_at.desc()).all()
    return {"items": [campaign_service.serialize(db, c) for c in rows]}


@router.post("/campaigns", status_code=201)
def admin_create_campaign(
    body: CampaignCreate,
    _: str = Depends(_require_admin),
    db: Session = Depends(get_db),
) -> dict:
    if db.query(Campaign).filter(Campaign.slug == body.slug).first():
        raise HTTPException(409, f"slug '{body.slug}' already exists")
    c = Campaign(
        slug=body.slug,
        title=body.title,
        summary=body.summary,
        story_html=body.story_html,
        hero_image_url=body.hero_image_url,
        goal_cents=body.goal_cents,
        currency=body.currency,
        designation=body.designation,
        status=body.status,
        featured=body.featured,
        starts_at=body.starts_at or datetime.utcnow(),
        ends_at=body.ends_at,
        impact_items=[i.model_dump() for i in body.impact_items] if body.impact_items else None,
    )
    db.add(c)
    db.commit()
    db.refresh(c)
    return campaign_service.serialize(db, c)


@router.patch("/campaigns/{id_or_slug}")
def admin_update_campaign(
    id_or_slug: str,
    body: CampaignUpdateSchema,
    _: str = Depends(_require_admin),
    db: Session = Depends(get_db),
) -> dict:
    c = campaign_service.get_by_slug_or_id(db, id_or_slug)
    if not c:
        raise HTTPException(404, "Campaign not found")
    data = body.model_dump(exclude_unset=True)
    # starts_at is non-nullable on the model; ignore explicit nulls from the client.
    if "starts_at" in data and data["starts_at"] is None:
        data.pop("starts_at")
    if "impact_items" in data and data["impact_items"] is not None:
        data["impact_items"] = [i if isinstance(i, dict) else i.model_dump() for i in data["impact_items"]]
    if "slug" in data and data["slug"] and data["slug"] != c.slug:
        if db.query(Campaign).filter(Campaign.slug == data["slug"]).first():
            raise HTTPException(409, f"slug '{data['slug']}' already exists")
    for k, v in data.items():
        setattr(c, k, v)
    db.commit()
    db.refresh(c)
    return campaign_service.serialize(db, c)


@router.delete("/campaigns/{id_or_slug}", status_code=204)
def admin_archive_campaign(
    id_or_slug: str,
    _: str = Depends(_require_admin),
    db: Session = Depends(get_db),
) -> None:
    c = campaign_service.get_by_slug_or_id(db, id_or_slug)
    if not c:
        raise HTTPException(404, "Campaign not found")
    c.status = "archived"
    db.commit()


# ---------- Campaign updates (posts) ----------

@router.post("/campaigns/{id_or_slug}/updates", status_code=201)
def admin_post_update(
    id_or_slug: str,
    body: CampaignUpdatePostIn,
    _: str = Depends(_require_admin),
    db: Session = Depends(get_db),
) -> dict:
    c = campaign_service.get_by_slug_or_id(db, id_or_slug)
    if not c:
        raise HTTPException(404, "Campaign not found")
    u = CampaignUpdate(campaign_id=c.id, title=body.title, body_html=body.body_html)
    db.add(u)
    db.commit()
    db.refresh(u)
    return {"id": u.id, "campaign_id": u.campaign_id, "title": u.title, "body_html": u.body_html, "created_at": u.created_at}


# ---------- Image upload ----------

@router.post("/uploads/image")
def admin_upload_image(
    file: UploadFile = File(...),
    _: str = Depends(_require_admin),
) -> dict:
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(415, f"Unsupported content type: {file.content_type}")
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    ext = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/gif": "gif",
    }[file.content_type]
    fname = f"{uuid.uuid4().hex}.{ext}"
    dest = UPLOAD_DIR / fname
    size = 0
    with dest.open("wb") as fh:
        while chunk := file.file.read(64 * 1024):
            size += len(chunk)
            if size > MAX_UPLOAD_BYTES:
                fh.close()
                dest.unlink(missing_ok=True)
                raise HTTPException(413, "File too large (max 5 MB)")
            fh.write(chunk)
    url = f"{settings.PUBLIC_WEB_URL.rstrip('/')}/uploads/{fname}"
    # In dev the proxy serves /uploads from the api container; in prod
    # serve via a CDN/static volume. Returning the absolute URL lets the
    # admin UI drop it straight into the hero_image_url field.
    return {"url": url, "filename": fname, "size": size}


# ---------- CSV export ----------

@router.get("/donations.csv")
def admin_donations_csv(
    _: str = Depends(_require_admin),
    db: Session = Depends(get_db),
    campaign_slug: str | None = Query(default=None),
    status_filter: str | None = Query(default=None, alias="status"),
) -> StreamingResponse:
    q = db.query(Donation)
    if campaign_slug:
        c = campaign_service.get_by_slug_or_id(db, campaign_slug)
        if c:
            q = q.filter(Donation.campaign_id == c.id)
    if status_filter:
        q = q.filter(Donation.status == status_filter)
    rows = q.order_by(Donation.created_at.desc()).all()

    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow([
        "created_at", "status", "provider", "provider_ref",
        "donor_name", "donor_email", "is_anonymous",
        "amount_usd", "currency", "frequency",
        "designation", "campaign_id",
    ])
    for d in rows:
        w.writerow([
            d.created_at.isoformat() if d.created_at else "",
            d.status,
            d.provider,
            d.provider_ref,
            d.donor_name or "",
            d.donor_email or "",
            "yes" if d.is_anonymous else "no",
            f"{d.amount_cents / 100:.2f}",
            d.currency,
            d.frequency,
            d.designation,
            d.campaign_id or "",
        ])
    buf.seek(0)
    filename = f"nti-donations-{datetime.utcnow():%Y%m%d-%H%M%S}.csv"
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
