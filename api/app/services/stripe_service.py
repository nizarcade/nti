"""Stripe Checkout session creation + webhook event handling."""

from __future__ import annotations

import logging
from typing import Any

import stripe
from sqlalchemy.orm import Session

from app.config import settings
from app.models import Donation
from app.services.email import send_donation_receipt

log = logging.getLogger("nti.stripe")

stripe.api_key = settings.STRIPE_SECRET_KEY


def _designation_label(d: str) -> str:
    return {
        "general": "General Fund",
        "grace_bridge": "Grace Bridge Initiative",
        "education": "Education Support",
        "livelihood": "Livelihood & Empowerment",
    }.get(d, "General Fund")


def create_checkout_session(
    *,
    amount: int,
    frequency: str,
    designation: str,
    donor_name: str | None,
    donor_email: str | None,
    campaign_id: str | None = None,
    is_anonymous: bool = False,
) -> stripe.checkout.Session:
    if not settings.STRIPE_SECRET_KEY:
        raise RuntimeError("Stripe not configured (STRIPE_SECRET_KEY missing)")

    amount_cents = amount * 100
    success_url = f"{settings.PUBLIC_WEB_URL}/donate/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{settings.PUBLIC_WEB_URL}/donate/cancel"

    metadata = {
        "designation": designation,
        "donor_name": donor_name or "",
        "frequency": frequency,
        "campaign_id": campaign_id or "",
        "is_anonymous": "1" if is_anonymous else "0",
    }

    common: dict[str, Any] = {
        "success_url": success_url,
        "cancel_url": cancel_url,
        "metadata": metadata,
        "customer_email": donor_email,
        "payment_method_types": ["card"],
        "allow_promotion_codes": False,
    }

    label = _designation_label(designation)

    if frequency == "monthly":
        price_id = settings.monthly_price_map.get(str(amount))
        if price_id:
            line_items = [{"price": price_id, "quantity": 1}]
        else:
            line_items = [
                {
                    "price_data": {
                        "currency": "usd",
                        "unit_amount": amount_cents,
                        "recurring": {"interval": "month"},
                        "product_data": {"name": f"NTI Monthly Partnership — {label}"},
                    },
                    "quantity": 1,
                }
            ]
        session = stripe.checkout.Session.create(
            mode="subscription",
            line_items=line_items,
            subscription_data={"metadata": metadata},
            **common,
        )
    else:
        line_items = [
            {
                "price_data": {
                    "currency": "usd",
                    "unit_amount": amount_cents,
                    "product_data": {"name": f"NTI Donation — {label}"},
                },
                "quantity": 1,
            }
        ]
        session = stripe.checkout.Session.create(
            mode="payment",
            line_items=line_items,
            **common,
        )

    return session


def verify_webhook(payload: bytes, sig_header: str | None) -> stripe.Event:
    if not settings.STRIPE_WEBHOOK_SECRET:
        # Dev convenience: parse without verification.
        log.warning("stripe.webhook.unverified — STRIPE_WEBHOOK_SECRET not set")
        return stripe.Event.construct_from(
            stripe.util.json.loads(payload.decode("utf-8")), stripe.api_key
        )
    if not sig_header:
        raise ValueError("Missing stripe signature header")
    return stripe.Webhook.construct_event(payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)


def handle_event(db: Session, event: stripe.Event) -> None:
    et = event["type"]
    obj = event["data"]["object"]

    if et == "checkout.session.completed":
        _record_checkout_completed(db, obj)
    elif et == "invoice.payment_succeeded":
        _record_invoice_paid(db, obj)
    elif et == "customer.subscription.deleted":
        log.info("stripe.subscription.deleted id=%s", obj.get("id"))
    else:
        log.debug("stripe.event.ignored type=%s", et)


def _record_checkout_completed(db: Session, session_obj: dict[str, Any]) -> None:
    session_id = session_obj.get("id") or ""
    if not session_id:
        return
    existing = db.query(Donation).filter(Donation.provider_ref == session_id).one_or_none()
    if existing and existing.status == "succeeded":
        return

    metadata = session_obj.get("metadata") or {}
    amount_total = int(session_obj.get("amount_total") or 0)
    currency = (session_obj.get("currency") or "usd").lower()
    donor_email = (
        session_obj.get("customer_details", {}).get("email")
        or session_obj.get("customer_email")
        or ""
    )
    donor_name = (
        metadata.get("donor_name")
        or session_obj.get("customer_details", {}).get("name")
        or None
    )
    frequency = metadata.get("frequency") or (
        "monthly" if session_obj.get("mode") == "subscription" else "one_time"
    )
    designation = metadata.get("designation") or "general"
    campaign_id = metadata.get("campaign_id") or None
    is_anonymous = str(metadata.get("is_anonymous") or "0") in ("1", "true", "True")

    if existing:
        existing.status = "succeeded"
        existing.amount_cents = amount_total or existing.amount_cents
        existing.donor_email = donor_email or existing.donor_email
        existing.donor_name = donor_name or existing.donor_name
        if campaign_id and not existing.campaign_id:
            existing.campaign_id = campaign_id
        existing.is_anonymous = is_anonymous or existing.is_anonymous
        existing.raw = session_obj
    else:
        existing = Donation(
            provider="stripe",
            provider_ref=session_id,
            donor_name=donor_name,
            donor_email=donor_email,
            amount_cents=amount_total,
            currency=currency,
            frequency=frequency,
            designation=designation,
            status="succeeded",
            campaign_id=campaign_id,
            is_anonymous=is_anonymous,
            raw=session_obj,
        )
        db.add(existing)
    db.commit()

    if donor_email:
        try:
            send_donation_receipt(
                to_email=donor_email,
                donor_name=donor_name,
                amount_cents=amount_total,
                currency=currency,
                frequency=frequency,
                designation=designation,
                reference=session_id,
            )
        except Exception:  # noqa: BLE001
            log.exception("stripe.receipt.send_failed session=%s", session_id)


def fetch_and_sync_session(db: Session, session_id: str) -> dict[str, Any]:
    """Fetch a Checkout Session from Stripe and reconcile the local row.

    Used by the /donate/success page to confirm payment without depending on
    webhooks. Idempotent — replays through the same handler.
    """
    if not settings.STRIPE_SECRET_KEY:
        raise RuntimeError("Stripe not configured")

    session = stripe.checkout.Session.retrieve(session_id)
    obj = session.to_dict() if hasattr(session, "to_dict") else dict(session)

    payment_status = obj.get("payment_status")  # paid | unpaid | no_payment_required
    if payment_status == "paid":
        _record_checkout_completed(db, obj)

    row = db.query(Donation).filter(Donation.provider_ref == session_id).one_or_none()
    return {
        "session_id": session_id,
        "payment_status": payment_status,
        "amount_cents": int(obj.get("amount_total") or 0),
        "currency": (obj.get("currency") or "usd").lower(),
        "status": row.status if row else "unknown",
    }


def _record_invoice_paid(db: Session, invoice: dict[str, Any]) -> None:
    inv_id = invoice.get("id") or ""
    amount = int(invoice.get("amount_paid") or 0)
    currency = (invoice.get("currency") or "usd").lower()
    donor_email = invoice.get("customer_email") or ""
    sub_id = invoice.get("subscription") or ""
    if not inv_id:
        return
    existing = db.query(Donation).filter(Donation.provider_ref == inv_id).one_or_none()
    if existing:
        return
    row = Donation(
        provider="stripe",
        provider_ref=inv_id,
        donor_email=donor_email,
        amount_cents=amount,
        currency=currency,
        frequency="monthly",
        designation="general",
        status="succeeded",
        raw={"subscription": sub_id, "invoice": invoice},
    )
    db.add(row)
    db.commit()
