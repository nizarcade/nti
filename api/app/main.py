from __future__ import annotations

import logging
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.db import init_db
from app.routers import (
    admin,
    admin_campaigns,
    auth,
    campaigns,
    contact,
    custom_pages,
    donations,
    page_content,
    paypal,
    volunteer,
)
from app.workers import donation_reconciler

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s — %(message)s",
)

app = FastAPI(title="NTI Bridge API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def _startup() -> None:
    init_db()
    _bootstrap_admin_user()
    await donation_reconciler.start()


def _bootstrap_admin_user() -> None:
    """Create a default admin user from ADMIN_USERNAME/ADMIN_PASSWORD if no
    users exist yet. This lets fresh deployments still sign in once."""
    if not (settings.ADMIN_USERNAME and settings.ADMIN_PASSWORD):
        return
    from sqlalchemy import func, select  # local import to avoid cycle

    from app.core.security import hash_password
    from app.db import SessionLocal
    from app.models import AdminUser

    with SessionLocal() as db:
        existing = db.scalar(select(func.count(AdminUser.id))) or 0
        if existing > 0:
            return
        u = AdminUser(
            username=settings.ADMIN_USERNAME.strip().lower(),
            hashed_password=hash_password(settings.ADMIN_PASSWORD),
            role="admin",
        )
        db.add(u)
        db.commit()
        logging.getLogger("nti.bootstrap").info(
            "Created initial admin user '%s' from env.", u.username
        )


@app.on_event("shutdown")
async def _shutdown() -> None:
    await donation_reconciler.stop()


@app.get("/api/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "env": settings.APP_ENV,
        "stripe_configured": "yes" if settings.STRIPE_SECRET_KEY else "no",
        "paypal_configured": "yes" if settings.PAYPAL_CLIENT_ID else "no",
    }


@app.get("/api/config")
def public_config() -> dict[str, str]:
    """Public (non-secret) values the frontend needs."""
    return {
        "stripe_publishable_key": settings.STRIPE_PUBLISHABLE_KEY,
        "paypal_client_id": settings.PAYPAL_CLIENT_ID,
        "paypal_currency": "USD",
    }


app.include_router(donations.router)
app.include_router(paypal.router)
app.include_router(contact.router)
app.include_router(volunteer.router)
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(admin_campaigns.router)
app.include_router(campaigns.router)
app.include_router(page_content.public_router)
app.include_router(page_content.admin_router)
app.include_router(custom_pages.public_router)
app.include_router(custom_pages.admin_router)

# Serve uploaded campaign images. Mounted directory is volume-backed in
# docker-compose so the files survive container rebuilds.
_UPLOAD_DIR = Path("/app/uploads")
_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(_UPLOAD_DIR)), name="uploads")
