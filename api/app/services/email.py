"""Plain-text receipt + contact email helpers.

Logs to stdout if SMTP is not configured (development-friendly).
"""

from __future__ import annotations

import logging
import smtplib
from email.message import EmailMessage

from app.config import settings

log = logging.getLogger("nti.email")


def _send(msg: EmailMessage) -> None:
    if not settings.SMTP_HOST:
        log.info("email.fake_send to=%s subject=%s", msg["To"], msg["Subject"])
        log.info("body:\n%s", msg.get_content())
        return
    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as smtp:
        smtp.starttls()
        if settings.SMTP_USER:
            smtp.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        smtp.send_message(msg)


def send_donation_receipt(
    *,
    to_email: str,
    donor_name: str | None,
    amount_cents: int,
    currency: str,
    frequency: str,
    designation: str,
    reference: str,
) -> None:
    msg = EmailMessage()
    msg["From"] = settings.SMTP_FROM or settings.RECEIPT_FROM_EMAIL
    msg["To"] = to_email
    msg["Subject"] = f"Thank you for your gift to {settings.ORG_LEGAL_NAME}"
    amount = f"{currency.upper()} {amount_cents / 100:,.2f}"
    name = donor_name or "Friend"
    msg.set_content(
        f"""Dear {name},

Thank you for your {('monthly' if frequency == 'monthly' else 'one-time')} gift of {amount} to
{settings.ORG_LEGAL_NAME} (designation: {designation}).

Your reference: {reference}

No goods or services were provided in exchange for this contribution. Please retain this
email for your records.

With gratitude,
{settings.ORG_LEGAL_NAME}
{settings.ORG_ADDRESS}
"""
    )
    _send(msg)


def forward_contact_message(
    *, name: str, email: str, subject: str | None, message: str
) -> None:
    msg = EmailMessage()
    msg["From"] = settings.SMTP_FROM or settings.RECEIPT_FROM_EMAIL
    msg["To"] = settings.CONTACT_TO_EMAIL
    msg["Reply-To"] = email
    msg["Subject"] = f"[NTI Contact] {subject or '(no subject)'}"
    msg.set_content(
        f"""New contact message from the NTI website.

From: {name} <{email}>
Subject: {subject or '(none)'}

{message}
"""
    )
    _send(msg)
