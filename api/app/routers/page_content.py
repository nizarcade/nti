"""Public + admin routes for page content (CMS).

- GET  /api/site/pages/{slug}        public, returns saved JSON or defaults
- GET  /api/admin/pages/{slug}       admin, includes updated_at / updated_by
- PUT  /api/admin/pages/{slug}       admin, validates against registered schema
- POST /api/admin/pages/{slug}/reset admin, restores defaults
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_admin
from app.db import get_db
from app.models import AdminUser, PageContent
from app.page_schemas import DEFAULTS_BY_SLUG, SCHEMA_BY_SLUG

log = logging.getLogger("nti.pages")

public_router = APIRouter(prefix="/api/site", tags=["pages-public"])
admin_router = APIRouter(prefix="/api/admin", tags=["pages-admin"])


def _model_for(slug: str):
    model = SCHEMA_BY_SLUG.get(slug)
    if not model:
        raise HTTPException(404, f"Unknown page '{slug}'")
    return model


def _defaults_for(slug: str) -> dict:
    return DEFAULTS_BY_SLUG[slug]


def _get_row_or_defaults(db: Session, slug: str) -> dict:
    row = db.query(PageContent).filter(PageContent.slug == slug).one_or_none()
    if row is None:
        return _defaults_for(slug)
    return row.data


@public_router.get("/pages/{slug}")
def get_public_page(slug: str, db: Session = Depends(get_db)) -> dict:
    _model_for(slug)  # validates known slug
    return _get_row_or_defaults(db, slug)


@admin_router.get("/pages/{slug}")
def get_admin_page(
    slug: str,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> dict:
    _model_for(slug)
    row = db.query(PageContent).filter(PageContent.slug == slug).one_or_none()
    if row is None:
        return {
            "data": _defaults_for(slug),
            "updated_at": None,
            "updated_by": None,
        }
    return {
        "data": row.data,
        "updated_at": row.updated_at.isoformat() if row.updated_at else None,
        "updated_by": row.updated_by,
    }


@admin_router.put("/pages/{slug}")
def put_admin_page(
    slug: str,
    body: dict,
    current: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> dict:
    model = _model_for(slug)
    try:
        validated = model.model_validate(body).model_dump()
    except Exception as e:
        raise HTTPException(422, f"Invalid {slug} content: {e}") from e
    row = db.query(PageContent).filter(PageContent.slug == slug).one_or_none()
    if row is None:
        row = PageContent(slug=slug, data=validated, updated_by=current.username)
        db.add(row)
    else:
        row.data = validated
        row.updated_by = current.username
    db.commit()
    db.refresh(row)
    return {
        "data": row.data,
        "updated_at": row.updated_at.isoformat() if row.updated_at else None,
        "updated_by": row.updated_by,
    }


@admin_router.post("/pages/{slug}/reset")
def reset_admin_page(
    slug: str,
    current: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> dict:
    _model_for(slug)
    row = db.query(PageContent).filter(PageContent.slug == slug).one_or_none()
    defaults = _defaults_for(slug)
    if row is None:
        row = PageContent(slug=slug, data=defaults, updated_by=current.username)
        db.add(row)
    else:
        row.data = defaults
        row.updated_by = current.username
    db.commit()
    db.refresh(row)
    return {
        "data": row.data,
        "updated_at": row.updated_at.isoformat() if row.updated_at else None,
        "updated_by": row.updated_by,
    }
