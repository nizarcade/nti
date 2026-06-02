from __future__ import annotations

import logging

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import ContactMessage
from app.schemas import ContactIn
from app.services.email import forward_contact_message

router = APIRouter(prefix="/api", tags=["contact"])
log = logging.getLogger("nti.contact")


@router.post("/contact", status_code=202)
def contact(body: ContactIn, db: Session = Depends(get_db)) -> dict[str, str]:
    row = ContactMessage(
        name=body.name,
        email=body.email,
        subject=body.subject,
        message=body.message,
    )
    db.add(row)
    db.commit()

    try:
        forward_contact_message(
            name=body.name, email=body.email, subject=body.subject, message=body.message
        )
    except Exception:  # noqa: BLE001
        log.exception("contact.forward_failed id=%s", row.id)
    return {"status": "accepted"}
