from __future__ import annotations

import logging

from email.message import EmailMessage

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config import settings
from app.db import get_db
from app.models import VolunteerSignup
from app.schemas import VolunteerIn
from app.services.email import _send  # internal helper reuse

router = APIRouter(prefix="/api", tags=["volunteer"])
log = logging.getLogger("nti.volunteer")


@router.post("/volunteer", status_code=202)
def volunteer(body: VolunteerIn, db: Session = Depends(get_db)) -> dict[str, str]:
    row = VolunteerSignup(
        name=body.name,
        email=body.email,
        phone=body.phone,
        location=body.location,
        skills=body.skills,
        availability=body.availability,
        message=body.message,
    )
    db.add(row)
    db.commit()

    try:
        msg = EmailMessage()
        msg["From"] = settings.SMTP_FROM or settings.RECEIPT_FROM_EMAIL
        msg["To"] = settings.CONTACT_TO_EMAIL
        msg["Reply-To"] = body.email
        msg["Subject"] = f"[NTI Volunteer] {body.name}"
        msg.set_content(
            f"""New volunteer signup from the NTI website.

Name: {body.name}
Email: {body.email}
Phone: {body.phone or '(none)'}
Location: {body.location or '(none)'}
Availability: {body.availability or '(none)'}

Skills:
{body.skills}

Message:
{body.message or '(none)'}
"""
        )
        _send(msg)
    except Exception:  # noqa: BLE001
        log.exception("volunteer.forward_failed id=%s", row.id)
    return {"status": "accepted"}
