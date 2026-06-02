"""Public + admin routes for user-created `CustomPage`s.

Public:
  - GET    /api/site/pages-custom/{slug}            published only

Admin:
  - GET    /api/admin/pages-custom                  list
  - POST   /api/admin/pages-custom                  create { slug, title }
  - GET    /api/admin/pages-custom/{id}             full doc
  - PUT    /api/admin/pages-custom/{id}             update { title, slug?, status, blocks, seo }
  - POST   /api/admin/pages-custom/{id}/duplicate   clone with new slug
  - DELETE /api/admin/pages-custom/{id}             hard delete
"""

from __future__ import annotations

import logging
import re

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.security import get_current_admin
from app.custom_page_schemas import RESERVED_SLUGS, SeoData, validate_blocks
from app.db import get_db
from app.models import AdminUser, CustomPage
from app.page_schemas import SCHEMA_BY_SLUG

log = logging.getLogger("nti.custom_pages")

public_router = APIRouter(prefix="/api/site", tags=["custom-pages-public"])
admin_router = APIRouter(
    prefix="/api/admin", tags=["custom-pages-admin"]
)


SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")


def _validate_slug(slug: str) -> str:
    s = (slug or "").strip().lower()
    if not s:
        raise HTTPException(422, "slug is required")
    if len(s) > 120:
        raise HTTPException(422, "slug must be 120 characters or fewer")
    if not SLUG_RE.match(s):
        raise HTTPException(422, "slug must be lowercase letters, digits, and hyphens")
    if s in RESERVED_SLUGS or s in SCHEMA_BY_SLUG:
        raise HTTPException(409, f"slug '{s}' is reserved")
    return s


def _serialize(row: CustomPage) -> dict:
    return {
        "id": row.id,
        "slug": row.slug,
        "title": row.title,
        "status": row.status,
        "blocks": row.blocks or [],
        "seo": row.seo or {},
        "created_at": row.created_at.isoformat() if row.created_at else None,
        "updated_at": row.updated_at.isoformat() if row.updated_at else None,
        "updated_by": row.updated_by,
    }


def _serialize_summary(row: CustomPage) -> dict:
    return {
        "id": row.id,
        "slug": row.slug,
        "title": row.title,
        "status": row.status,
        "updated_at": row.updated_at.isoformat() if row.updated_at else None,
        "updated_by": row.updated_by,
    }


# --- public ----------------------------------------------------------------


@public_router.get("/pages-custom/{slug}")
def get_public_custom_page(slug: str, db: Session = Depends(get_db)) -> dict:
    row = (
        db.query(CustomPage)
        .filter(CustomPage.slug == slug, CustomPage.status == "published")
        .one_or_none()
    )
    if row is None:
        raise HTTPException(404, "Page not found")
    return _serialize(row)


# --- admin -----------------------------------------------------------------


class CreateCustomPageIn(BaseModel):
    slug: str
    title: str = Field(min_length=1, max_length=200)


class UpdateCustomPageIn(BaseModel):
    slug: str | None = None
    title: str | None = Field(default=None, min_length=1, max_length=200)
    status: str | None = None  # "draft" | "published"
    blocks: list | None = None
    seo: dict | None = None


class DuplicateCustomPageIn(BaseModel):
    slug: str
    title: str | None = None


@admin_router.get("/pages-custom")
def list_custom_pages(
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> list[dict]:
    rows = (
        db.query(CustomPage).order_by(CustomPage.updated_at.desc()).all()
    )
    return [_serialize_summary(r) for r in rows]


@admin_router.post("/pages-custom", status_code=201)
def create_custom_page(
    body: CreateCustomPageIn,
    current: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> dict:
    slug = _validate_slug(body.slug)
    if db.query(CustomPage).filter(CustomPage.slug == slug).one_or_none():
        raise HTTPException(409, f"slug '{slug}' already exists")
    row = CustomPage(
        slug=slug,
        title=body.title.strip(),
        status="draft",
        blocks=[],
        seo={},
        updated_by=current.username,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    log.info("custom_page.create slug=%s by=%s", row.slug, current.username)
    return _serialize(row)


@admin_router.get("/pages-custom/{page_id}")
def get_custom_page(
    page_id: str,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> dict:
    row = db.query(CustomPage).filter(CustomPage.id == page_id).one_or_none()
    if row is None:
        raise HTTPException(404, "Page not found")
    return _serialize(row)


@admin_router.put("/pages-custom/{page_id}")
def update_custom_page(
    page_id: str,
    body: UpdateCustomPageIn,
    current: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> dict:
    row = db.query(CustomPage).filter(CustomPage.id == page_id).one_or_none()
    if row is None:
        raise HTTPException(404, "Page not found")

    if body.slug is not None:
        new_slug = _validate_slug(body.slug)
        if new_slug != row.slug:
            clash = (
                db.query(CustomPage)
                .filter(CustomPage.slug == new_slug, CustomPage.id != row.id)
                .one_or_none()
            )
            if clash:
                raise HTTPException(409, f"slug '{new_slug}' already exists")
            row.slug = new_slug

    if body.title is not None:
        row.title = body.title.strip()

    if body.status is not None:
        if body.status not in ("draft", "published"):
            raise HTTPException(422, "status must be 'draft' or 'published'")
        row.status = body.status

    if body.blocks is not None:
        try:
            row.blocks = validate_blocks(body.blocks)
        except ValueError as e:
            raise HTTPException(422, f"Invalid blocks: {e}") from e

    if body.seo is not None:
        try:
            row.seo = SeoData.model_validate(body.seo).model_dump()
        except Exception as e:
            raise HTTPException(422, f"Invalid seo: {e}") from e

    row.updated_by = current.username
    db.commit()
    db.refresh(row)
    log.info("custom_page.update slug=%s by=%s", row.slug, current.username)
    return _serialize(row)


@admin_router.post("/pages-custom/{page_id}/duplicate", status_code=201)
def duplicate_custom_page(
    page_id: str,
    body: DuplicateCustomPageIn,
    current: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> dict:
    src = db.query(CustomPage).filter(CustomPage.id == page_id).one_or_none()
    if src is None:
        raise HTTPException(404, "Page not found")
    new_slug = _validate_slug(body.slug)
    if db.query(CustomPage).filter(CustomPage.slug == new_slug).one_or_none():
        raise HTTPException(409, f"slug '{new_slug}' already exists")
    row = CustomPage(
        slug=new_slug,
        title=(body.title or f"{src.title} (copy)").strip(),
        status="draft",
        blocks=list(src.blocks or []),
        seo=dict(src.seo or {}),
        updated_by=current.username,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    log.info(
        "custom_page.duplicate src=%s -> %s by=%s",
        src.slug,
        row.slug,
        current.username,
    )
    return _serialize(row)


@admin_router.delete("/pages-custom/{page_id}", status_code=204)
def delete_custom_page(
    page_id: str,
    current: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> None:
    row = db.query(CustomPage).filter(CustomPage.id == page_id).one_or_none()
    if row is None:
        raise HTTPException(404, "Page not found")
    db.delete(row)
    db.commit()
    log.info("custom_page.delete slug=%s by=%s", row.slug, current.username)
