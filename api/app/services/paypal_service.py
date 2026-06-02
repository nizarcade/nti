"""PayPal REST API client.

Supports one-time orders (v2/checkout/orders) and monthly subscriptions
(v1/catalogs/products + v1/billing/plans + v1/billing/subscriptions).
Sandbox by default.
"""

from __future__ import annotations

import base64
import logging
from typing import Any

import httpx

from app.config import settings

log = logging.getLogger("nti.paypal")

_TIMEOUT = httpx.Timeout(20.0, connect=5.0)

# Lazy in-process cache of plan IDs by amount (whole USD). Cleared on restart.
_PLAN_CACHE: dict[int, str] = {}
_PRODUCT_ID: str | None = None


async def _access_token() -> str:
    if not settings.PAYPAL_CLIENT_ID or not settings.PAYPAL_CLIENT_SECRET:
        raise RuntimeError("PayPal not configured")
    creds = f"{settings.PAYPAL_CLIENT_ID}:{settings.PAYPAL_CLIENT_SECRET}".encode()
    auth = base64.b64encode(creds).decode()
    async with httpx.AsyncClient(base_url=settings.PAYPAL_BASE_URL, timeout=_TIMEOUT) as cli:
        r = await cli.post(
            "/v1/oauth2/token",
            headers={
                "Authorization": f"Basic {auth}",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data={"grant_type": "client_credentials"},
        )
        r.raise_for_status()
        return str(r.json()["access_token"])


async def create_order(
    *,
    amount: int,
    designation: str,
    donor_name: str | None,
    donor_email: str | None,
) -> dict[str, Any]:
    token = await _access_token()
    body = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {"currency_code": "USD", "value": f"{amount:.2f}"},
                "description": f"NTI Donation — {designation}",
                "custom_id": designation,
            }
        ],
        "application_context": {
            "brand_name": "Northern Transformation Initiative",
            "shipping_preference": "NO_SHIPPING",
            "user_action": "PAY_NOW",
        },
    }
    if donor_email or donor_name:
        body["payer"] = {  # type: ignore[index]
            "email_address": donor_email,
            "name": {"given_name": donor_name or ""},
        }

    async with httpx.AsyncClient(base_url=settings.PAYPAL_BASE_URL, timeout=_TIMEOUT) as cli:
        r = await cli.post(
            "/v2/checkout/orders",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            },
            json=body,
        )
        if r.status_code >= 400:
            log.warning("paypal.create.error status=%s body=%s", r.status_code, r.text[:500])
            r.raise_for_status()
        return r.json()


async def capture_order(order_id: str) -> dict[str, Any]:
    token = await _access_token()
    async with httpx.AsyncClient(base_url=settings.PAYPAL_BASE_URL, timeout=_TIMEOUT) as cli:
        r = await cli.post(
            f"/v2/checkout/orders/{order_id}/capture",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            },
        )
        if r.status_code >= 400:
            log.warning("paypal.capture.error status=%s body=%s", r.status_code, r.text[:500])
            r.raise_for_status()
        return r.json()


# ---------- Subscriptions (monthly) ----------

async def _get_or_create_product(cli: httpx.AsyncClient, token: str) -> str:
    global _PRODUCT_ID
    if _PRODUCT_ID:
        return _PRODUCT_ID
    body = {
        "name": f"{settings.ORG_LEGAL_NAME} Monthly Partnership",
        "description": "Recurring monthly donation supporting NTI programs.",
        "type": "SERVICE",
        "category": "NONPROFIT",
    }
    r = await cli.post(
        "/v1/catalogs/products",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        json=body,
    )
    if r.status_code >= 400:
        log.warning("paypal.product.error status=%s body=%s", r.status_code, r.text[:500])
        r.raise_for_status()
    _PRODUCT_ID = str(r.json()["id"])
    return _PRODUCT_ID


async def _get_or_create_plan(cli: httpx.AsyncClient, token: str, amount: int) -> str:
    if amount in _PLAN_CACHE:
        return _PLAN_CACHE[amount]
    product_id = await _get_or_create_product(cli, token)
    body = {
        "product_id": product_id,
        "name": f"NTI Monthly ${amount}",
        "description": f"Monthly donation of ${amount} USD to NTI.",
        "status": "ACTIVE",
        "billing_cycles": [
            {
                "frequency": {"interval_unit": "MONTH", "interval_count": 1},
                "tenure_type": "REGULAR",
                "sequence": 1,
                "total_cycles": 0,  # 0 = infinite
                "pricing_scheme": {
                    "fixed_price": {"value": f"{amount:.2f}", "currency_code": "USD"}
                },
            }
        ],
        "payment_preferences": {
            "auto_bill_outstanding": True,
            "setup_fee": {"value": "0", "currency_code": "USD"},
            "setup_fee_failure_action": "CONTINUE",
            "payment_failure_threshold": 2,
        },
    }
    r = await cli.post(
        "/v1/billing/plans",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        },
        json=body,
    )
    if r.status_code >= 400:
        log.warning("paypal.plan.error status=%s body=%s", r.status_code, r.text[:500])
        r.raise_for_status()
    plan_id = str(r.json()["id"])
    _PLAN_CACHE[amount] = plan_id
    return plan_id


async def create_subscription(
    *,
    amount: int,
    designation: str,
    donor_name: str | None,
    donor_email: str | None,
) -> dict[str, Any]:
    token = await _access_token()
    async with httpx.AsyncClient(base_url=settings.PAYPAL_BASE_URL, timeout=_TIMEOUT) as cli:
        plan_id = await _get_or_create_plan(cli, token, amount)
        body: dict[str, Any] = {
            "plan_id": plan_id,
            "custom_id": designation,
            "application_context": {
                "brand_name": settings.ORG_LEGAL_NAME,
                "shipping_preference": "NO_SHIPPING",
                "user_action": "SUBSCRIBE_NOW",
                "return_url": f"{settings.PUBLIC_WEB_URL}/donate/success?provider=paypal&kind=subscription",
                "cancel_url": f"{settings.PUBLIC_WEB_URL}/donate/cancel",
            },
        }
        if donor_email or donor_name:
            body["subscriber"] = {
                "email_address": donor_email,
                "name": {"given_name": donor_name or ""},
            }
        r = await cli.post(
            "/v1/billing/subscriptions",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            },
            json=body,
        )
        if r.status_code >= 400:
            log.warning("paypal.sub.error status=%s body=%s", r.status_code, r.text[:500])
            r.raise_for_status()
        return r.json()
