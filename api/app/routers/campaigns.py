"""Public read-only campaigns endpoints."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Campaign, CampaignUpdate, Donation
from app.services import campaign_service

router = APIRouter(prefix="/api/campaigns", tags=["campaigns"])


@router.get("")
def list_campaigns(
    db: Session = Depends(get_db),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    featured: bool | None = None,
) -> dict:
    q = db.query(Campaign).filter(Campaign.status.in_(("active", "completed")))
    if featured is not None:
        q = q.filter(Campaign.featured == featured)
    q = q.order_by(Campaign.featured.desc(), Campaign.created_at.desc())
    rows = q.limit(limit).offset(offset).all()
    # Auto-complete any that have ended.
    for c in rows:
        campaign_service.maybe_auto_complete(db, c)
    return {
        "total": len(rows),
        "items": [campaign_service.serialize(db, c) for c in rows],
    }


@router.get("/{slug}")
def get_campaign(slug: str, db: Session = Depends(get_db)) -> dict:
    c = campaign_service.get_by_slug_or_id(db, slug)
    if not c or c.status in ("draft", "archived"):
        raise HTTPException(404, "Campaign not found")
    campaign_service.maybe_auto_complete(db, c)
    data = campaign_service.serialize(db, c)
    updates = (
        db.query(CampaignUpdate)
        .filter(CampaignUpdate.campaign_id == c.id)
        .order_by(CampaignUpdate.created_at.desc())
        .limit(20)
        .all()
    )
    data["updates"] = [
        {
            "id": u.id,
            "title": u.title,
            "body_html": u.body_html,
            "created_at": u.created_at,
        }
        for u in updates
    ]
    return data


@router.get("/{slug}/donors")
def list_donors(
    slug: str,
    db: Session = Depends(get_db),
    limit: int = Query(20, ge=1, le=100),
) -> dict:
    c = campaign_service.get_by_slug_or_id(db, slug)
    if not c:
        raise HTTPException(404, "Campaign not found")
    rows = (
        db.query(Donation)
        .filter(
            Donation.campaign_id == c.id,
            Donation.status.in_(("succeeded", "completed", "captured")),
        )
        .order_by(Donation.created_at.desc())
        .limit(limit)
        .all()
    )
    return {
        "items": [
            {
                "donor_name": "Anonymous" if d.is_anonymous or not d.donor_name else d.donor_name,
                "amount_cents": d.amount_cents,
                "currency": d.currency,
                "frequency": d.frequency,
                "created_at": d.created_at,
            }
            for d in rows
        ]
    }


@router.get("/{slug}/top-donors")
def list_top_donors(
    slug: str,
    db: Session = Depends(get_db),
    limit: int = Query(3, ge=1, le=20),
) -> dict:
    """Top contributors by total donated amount (excludes anonymous donations)."""
    c = campaign_service.get_by_slug_or_id(db, slug)
    if not c:
        raise HTTPException(404, "Campaign not found")
    total_col = func.sum(Donation.amount_cents).label("total_cents")
    count_col = func.count(Donation.id).label("donations_count")
    rows = (
        db.query(
            Donation.donor_name,
            Donation.currency,
            total_col,
            count_col,
        )
        .filter(
            Donation.campaign_id == c.id,
            Donation.status.in_(("succeeded", "completed", "captured")),
            Donation.is_anonymous.is_(False),
            Donation.donor_name.isnot(None),
            Donation.donor_name != "",
        )
        .group_by(Donation.donor_name, Donation.currency)
        .order_by(total_col.desc())
        .limit(limit)
        .all()
    )
    return {
        "items": [
            {
                "donor_name": r.donor_name,
                "total_cents": int(r.total_cents or 0),
                "currency": r.currency,
                "donations_count": int(r.donations_count or 0),
            }
            for r in rows
        ]
    }
