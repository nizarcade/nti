from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Campaign, Donation
from app.schemas import (
    PaypalCaptureIn,
    PaypalCaptureOut,
    PaypalCreateIn,
    PaypalCreateOut,
)
from app.services import paypal_service
from app.services.email import send_donation_receipt

router = APIRouter(prefix="/api/donations/paypal", tags=["paypal"])
log = logging.getLogger("nti.paypal.router")


def _resolve_campaign_id(db: Session, slug: str | None) -> str | None:
    if not slug:
        return None
    c = db.query(Campaign).filter(Campaign.slug == slug).one_or_none()
    if not c:
        raise HTTPException(status_code=404, detail=f"Campaign '{slug}' not found")
    if c.status in ("draft", "archived"):
        raise HTTPException(status_code=400, detail="Campaign is not accepting donations")
    return c.id


@router.post("/create", response_model=PaypalCreateOut)
async def create(body: PaypalCreateIn, db: Session = Depends(get_db)) -> PaypalCreateOut:
    campaign_id = _resolve_campaign_id(db, body.campaign_slug)
    if body.frequency == "monthly":
        try:
            sub = await paypal_service.create_subscription(
                amount=body.amount,
                designation=body.designation,
                donor_name=body.donor_name,
                donor_email=body.donor_email,
            )
        except RuntimeError as e:
            raise HTTPException(status_code=503, detail=str(e)) from e
        except Exception as e:  # noqa: BLE001
            log.exception("paypal.subscription.failed")
            raise HTTPException(status_code=502, detail="PayPal subscription error") from e

        sub_id = str(sub.get("id") or "")
        approve_url = ""
        for link in sub.get("links") or []:
            if link.get("rel") == "approve":
                approve_url = str(link.get("href") or "")
                break
        if not sub_id:
            raise HTTPException(status_code=502, detail="PayPal returned no subscription id")

        db.add(
            Donation(
                provider="paypal",
                provider_ref=sub_id,
                donor_name=body.donor_name,
                donor_email=body.donor_email,
                amount_cents=body.amount * 100,
                currency="usd",
                frequency="monthly",
                designation=body.designation,
                status="pending",
                raw=sub,
                campaign_id=campaign_id,
                is_anonymous=body.is_anonymous,
            )
        )
        db.commit()
        return PaypalCreateOut(order_id=sub_id, approve_url=approve_url, kind="subscription")

    try:
        order = await paypal_service.create_order(
            amount=body.amount,
            designation=body.designation,
            donor_name=body.donor_name,
            donor_email=body.donor_email,
        )
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:  # noqa: BLE001
        log.exception("paypal.create.failed")
        raise HTTPException(status_code=502, detail="PayPal error") from e

    order_id = str(order.get("id") or "")
    if not order_id:
        raise HTTPException(status_code=502, detail="PayPal returned no order id")

    db.add(
        Donation(
            provider="paypal",
            provider_ref=order_id,
            donor_name=body.donor_name,
            donor_email=body.donor_email,
            amount_cents=body.amount * 100,
            currency="usd",
            frequency="one_time",
            designation=body.designation,
            status="pending",
            raw=order,
            campaign_id=campaign_id,
            is_anonymous=body.is_anonymous,
        )
    )
    db.commit()
    return PaypalCreateOut(order_id=order_id, kind="order")


@router.post("/capture", response_model=PaypalCaptureOut)
async def capture(body: PaypalCaptureIn, db: Session = Depends(get_db)) -> PaypalCaptureOut:
    try:
        result = await paypal_service.capture_order(body.order_id)
    except Exception as e:  # noqa: BLE001
        log.exception("paypal.capture.failed order_id=%s", body.order_id)
        raise HTTPException(status_code=502, detail="PayPal capture failed") from e

    status = str(result.get("status") or "UNKNOWN")
    row = (
        db.query(Donation).filter(Donation.provider_ref == body.order_id).one_or_none()
    )
    if row:
        row.status = "succeeded" if status == "COMPLETED" else status.lower()
        row.raw = result
        db.commit()

        if row.status == "succeeded" and row.donor_email:
            try:
                send_donation_receipt(
                    to_email=row.donor_email,
                    donor_name=row.donor_name,
                    amount_cents=row.amount_cents,
                    currency=row.currency,
                    frequency=row.frequency,
                    designation=row.designation,
                    reference=body.order_id,
                )
            except Exception:  # noqa: BLE001
                log.exception("paypal.receipt.send_failed order=%s", body.order_id)

    return PaypalCaptureOut(status=status)
