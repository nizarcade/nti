"""Admin JWT auth router."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    get_current_admin,
    verify_password,
)
from app.db import get_db
from app.models import AdminUser

router = APIRouter(prefix="/api/admin/auth", tags=["admin-auth"])


class LoginIn(BaseModel):
    username: str
    password: str


class AdminOut(BaseModel):
    id: str
    username: str
    email: str | None = None
    role: str

    @classmethod
    def from_user(cls, u: AdminUser) -> "AdminOut":
        return cls(id=u.id, username=u.username, email=u.email, role=u.role)


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_at: datetime
    user: AdminOut


@router.post("/login", response_model=TokenOut)
def login(body: LoginIn, db: Annotated[Session, Depends(get_db)]) -> TokenOut:
    user = (
        db.query(AdminUser)
        .filter(AdminUser.username == body.username.strip().lower())
        .one_or_none()
    )
    if user is None or not user.is_active or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "invalid credentials")
    user.last_login_at = datetime.utcnow()
    db.commit()
    token, exp = create_access_token(user)
    return TokenOut(access_token=token, expires_at=exp, user=AdminOut.from_user(user))


@router.get("/me", response_model=AdminOut)
def me(current: Annotated[AdminUser, Depends(get_current_admin)]) -> AdminOut:
    return AdminOut.from_user(current)
