from __future__ import annotations

from datetime import datetime, timedelta
from typing import Literal

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.security import get_current_admin
from app.db import get_db
from app.models import AdminUser, ContactMessage, Donation, VolunteerSignup
from app.workers import donation_reconciler

router = APIRouter(prefix="/api/admin", tags=["admin"])


def _require_admin(current: AdminUser = Depends(get_current_admin)) -> AdminUser:
    return current


@router.get("/stats")
def stats(_: str = Depends(_require_admin), db: Session = Depends(get_db)) -> dict:
    total_donations = db.scalar(select(func.count(Donation.id))) or 0
    total_amount = db.scalar(
        select(func.coalesce(func.sum(Donation.amount_cents), 0)).where(
            Donation.status.in_(("succeeded", "completed", "captured"))
        )
    ) or 0
    pending = db.scalar(
        select(func.count(Donation.id)).where(Donation.status == "pending")
    ) or 0
    contacts = db.scalar(select(func.count(ContactMessage.id))) or 0
    volunteers = db.scalar(select(func.count(VolunteerSignup.id))) or 0
    return {
        "donations_count": int(total_donations),
        "donations_total_cents": int(total_amount),
        "donations_pending": int(pending),
        "contacts_count": int(contacts),
        "volunteers_count": int(volunteers),
    }


# Number of buckets returned per granularity (recent first → ascending).
_DEFAULT_POINTS = {"day": 30, "week": 12, "month": 12, "year": 5}


def _bucket_start(dt: datetime, bucket: str) -> datetime:
    dt = dt.replace(hour=0, minute=0, second=0, microsecond=0, tzinfo=None)
    if bucket == "day":
        return dt
    if bucket == "week":
        # ISO week start (Monday).
        return dt - timedelta(days=dt.weekday())
    if bucket == "month":
        return dt.replace(day=1)
    if bucket == "year":
        return dt.replace(month=1, day=1)
    raise ValueError(bucket)


def _advance(dt: datetime, bucket: str) -> datetime:
    if bucket == "day":
        return dt + timedelta(days=1)
    if bucket == "week":
        return dt + timedelta(days=7)
    if bucket == "month":
        # Add one month
        y, m = (dt.year + 1, 1) if dt.month == 12 else (dt.year, dt.month + 1)
        return dt.replace(year=y, month=m, day=1)
    if bucket == "year":
        return dt.replace(year=dt.year + 1, month=1, day=1)
    raise ValueError(bucket)


@router.get("/analytics")
def analytics(
    _: str = Depends(_require_admin),
    db: Session = Depends(get_db),
    bucket: Literal["day", "week", "month", "year"] = Query("day"),
    points: int | None = Query(None, ge=1, le=120),
) -> dict:
    """Donation totals and counts grouped into time buckets.

    Returns the most recent `points` buckets in ascending order. Only donations
    with a successful status are included in totals; pending donations are
    counted separately in `pending_count`.
    """
    n = points or _DEFAULT_POINTS[bucket]
    now = datetime.utcnow()
    current_start = _bucket_start(now, bucket)
    # Build the bucket boundaries: oldest first.
    starts: list[datetime] = [current_start]
    for _i in range(n - 1):
        prev = starts[-1]
        if bucket == "day":
            starts.append(prev - timedelta(days=1))
        elif bucket == "week":
            starts.append(prev - timedelta(days=7))
        elif bucket == "month":
            y, m = (prev.year - 1, 12) if prev.month == 1 else (prev.year, prev.month - 1)
            starts.append(prev.replace(year=y, month=m, day=1))
        elif bucket == "year":
            starts.append(prev.replace(year=prev.year - 1, month=1, day=1))
    starts.reverse()  # ascending (oldest → newest)
    range_start = starts[0]

    rows = db.execute(
        select(Donation.created_at, Donation.amount_cents, Donation.status).where(
            Donation.created_at >= range_start,
        )
    ).all()

    series_total: dict[datetime, int] = {s: 0 for s in starts}
    series_count: dict[datetime, int] = {s: 0 for s in starts}
    pending_count = 0
    for created_at, amount_cents, status in rows:
        if status == "pending":
            pending_count += 1
        if status not in ("succeeded", "completed", "captured"):
            continue
        b = _bucket_start(created_at, bucket)
        if b in series_total:
            series_total[b] += int(amount_cents or 0)
            series_count[b] += 1

    series = [
        {
            "bucket": s.isoformat(),
            "total_cents": series_total[s],
            "count": series_count[s],
        }
        for s in starts
    ]
    return {
        "bucket": bucket,
        "points": len(series),
        "range_start": range_start.isoformat(),
        "range_end": _advance(current_start, bucket).isoformat(),
        "pending_count": pending_count,
        "series": series,
    }


@router.get("/donations")
def list_donations(
    _: str = Depends(_require_admin),
    db: Session = Depends(get_db),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    status_filter: Literal["all", "pending", "succeeded", "failed"] = Query("all", alias="status"),
) -> dict:
    q = select(Donation).order_by(Donation.created_at.desc())
    if status_filter != "all":
        q = q.where(Donation.status == status_filter)
    rows = db.scalars(q.limit(limit).offset(offset)).all()
    total = db.scalar(select(func.count(Donation.id))) or 0
    return {
        "total": int(total),
        "items": [
            {
                "id": d.id,
                "provider": d.provider,
                "provider_ref": d.provider_ref,
                "donor_name": d.donor_name,
                "donor_email": d.donor_email,
                "amount_cents": d.amount_cents,
                "currency": d.currency,
                "frequency": d.frequency,
                "designation": d.designation,
                "status": d.status,
                "created_at": d.created_at.isoformat(),
            }
            for d in rows
        ],
    }


@router.get("/contacts")
def list_contacts(
    _: str = Depends(_require_admin),
    db: Session = Depends(get_db),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
) -> dict:
    rows = db.scalars(
        select(ContactMessage).order_by(ContactMessage.created_at.desc()).limit(limit).offset(offset)
    ).all()
    total = db.scalar(select(func.count(ContactMessage.id))) or 0
    return {
        "total": int(total),
        "items": [
            {
                "id": c.id,
                "name": c.name,
                "email": c.email,
                "subject": c.subject,
                "message": c.message,
                "created_at": c.created_at.isoformat(),
            }
            for c in rows
        ],
    }


@router.post("/reconcile")
def reconcile_now(_: str = Depends(_require_admin)) -> dict:
    """Trigger the donation reconciler and run one immediate sync."""
    donation_reconciler.trigger()
    processed = donation_reconciler.run_now()
    return {"processed": processed, "worker": donation_reconciler.status()}


@router.get("/volunteers")
def list_volunteers(
    _: str = Depends(_require_admin),
    db: Session = Depends(get_db),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
) -> dict:
    rows = db.scalars(
        select(VolunteerSignup).order_by(VolunteerSignup.created_at.desc()).limit(limit).offset(offset)
    ).all()
    total = db.scalar(select(func.count(VolunteerSignup.id))) or 0
    return {
        "total": int(total),
        "items": [
            {
                "id": v.id,
                "name": v.name,
                "email": v.email,
                "phone": v.phone,
                "location": v.location,
                "skills": v.skills,
                "availability": v.availability,
                "message": v.message,
                "created_at": v.created_at.isoformat(),
            }
            for v in rows
        ],
    }
