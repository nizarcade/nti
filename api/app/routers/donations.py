from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, Header, Request
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Campaign, Donation
from app.schemas import DonationIntentIn, DonationIntentOut
from app.services import stripe_service
from app.workers import donation_reconciler

router = APIRouter(prefix="/api/donations", tags=["donations"])
log = logging.getLogger("nti.donations")


def _resolve_campaign_id(db: Session, slug: str | None) -> str | None:
    if not slug:
        return None
    c = db.query(Campaign).filter(Campaign.slug == slug).one_or_none()
    if not c:
        raise HTTPException(status_code=404, detail=f"Campaign '{slug}' not found")
    if c.status in ("draft", "archived"):
        raise HTTPException(status_code=400, detail="Campaign is not accepting donations")
    return c.id


@router.post("/intent", response_model=DonationIntentOut)
def create_intent(body: DonationIntentIn, db: Session = Depends(get_db)) -> DonationIntentOut:
    campaign_id = _resolve_campaign_id(db, body.campaign_slug)
    try:
        session = stripe_service.create_checkout_session(
            amount=body.amount,
            frequency=body.frequency,
            designation=body.designation,
            donor_name=body.donor_name,
            donor_email=body.donor_email,
            campaign_id=campaign_id,
            is_anonymous=body.is_anonymous,
        )
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:  # noqa: BLE001
        log.exception("stripe.intent.failed")
        raise HTTPException(status_code=502, detail="Payment provider error") from e

    # Persist a pending row so we can correlate with the webhook later.
    db.add(
        Donation(
            provider="stripe",
            provider_ref=session.id,
            donor_name=body.donor_name,
            donor_email=body.donor_email,
            amount_cents=body.amount * 100,
            currency="usd",
            frequency=body.frequency,
            designation=body.designation,
            status="pending",
            campaign_id=campaign_id,
            is_anonymous=body.is_anonymous,
        )
    )
    db.commit()

    # Wake the background reconciler so it starts polling Stripe for this
    # session until it's paid (replaces needing `stripe listen` in dev).
    donation_reconciler.trigger()

    return DonationIntentOut(checkout_url=session.url or "", session_id=session.id)


@router.get("/status")
def donation_status(session_id: str, db: Session = Depends(get_db)) -> dict:
    """Confirm a Stripe Checkout session's status (used by /donate/success)."""
    try:
        return stripe_service.fetch_and_sync_session(db, session_id)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:  # noqa: BLE001
        log.exception("stripe.status.lookup_failed session=%s", session_id)
        raise HTTPException(status_code=502, detail="Lookup failed") from e


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str | None = Header(default=None, alias="stripe-signature"),
    db: Session = Depends(get_db),
) -> dict[str, str]:
    payload = await request.body()
    try:
        event = stripe_service.verify_webhook(payload, stripe_signature)
    except Exception as e:  # noqa: BLE001
        log.warning("stripe.webhook.verify_failed err=%s", e)
        raise HTTPException(status_code=400, detail="Invalid signature") from e

    try:
        stripe_service.handle_event(db, event)
    except Exception:  # noqa: BLE001
        log.exception("stripe.webhook.handle_failed type=%s", event.get("type"))
        # Return 200 anyway so Stripe stops retrying obvious code bugs; flip
        # this to 500 in prod if you want retry semantics.
        return {"received": "true", "handled": "false"}
    return {"received": "true", "handled": "true"}
