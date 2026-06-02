"""Campaign domain helpers: totals, auto-completion, serialization."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.config import settings
from app.models import Campaign, Donation

_SUCCESS_STATUSES = ("succeeded", "completed", "captured")


def campaign_totals(db: Session, campaign_id: str) -> tuple[int, int]:
    """Returns (raised_cents, donors_count) for a campaign."""
    raised = db.scalar(
        select(func.coalesce(func.sum(Donation.amount_cents), 0)).where(
            Donation.campaign_id == campaign_id,
            Donation.status.in_(_SUCCESS_STATUSES),
        )
    ) or 0
    donors = db.scalar(
        select(func.count(func.distinct(Donation.donor_email))).where(
            Donation.campaign_id == campaign_id,
            Donation.status.in_(_SUCCESS_STATUSES),
        )
    ) or 0
    return int(raised), int(donors)


def maybe_auto_complete(db: Session, c: Campaign) -> Campaign:
    """If ends_at has passed and campaign still active, mark completed.

    We DO NOT block donations after this — overflow is allowed.
    """
    now = datetime.utcnow()
    if c.status == "active" and c.ends_at and c.ends_at < now:
        c.status = "completed"
        db.commit()
        db.refresh(c)
    return c


def serialize(db: Session, c: Campaign) -> dict[str, Any]:
    raised, donors = campaign_totals(db, c.id)
    pct = (raised / c.goal_cents * 100.0) if c.goal_cents else 0.0
    return {
        "id": c.id,
        "slug": c.slug,
        "title": c.title,
        "summary": c.summary or "",
        "story_html": c.story_html or "",
        "hero_image_url": c.hero_image_url,
        "goal_cents": c.goal_cents,
        "currency": c.currency,
        "designation": c.designation,
        "status": c.status,
        "featured": c.featured,
        "starts_at": c.starts_at,
        "ends_at": c.ends_at,
        "impact_items": c.impact_items,
        "raised_cents": raised,
        "donors_count": donors,
        "progress_pct": round(pct, 1),
        "is_ended": bool(c.ends_at and c.ends_at < datetime.utcnow()),
        "share_url": f"{settings.PUBLIC_WEB_URL}/c/{c.slug}",
        "created_at": c.created_at,
        "updated_at": c.updated_at,
    }


def get_by_slug_or_id(db: Session, slug_or_id: str) -> Campaign | None:
    return (
        db.query(Campaign)
        .filter((Campaign.slug == slug_or_id) | (Campaign.id == slug_or_id))
        .one_or_none()
    )
