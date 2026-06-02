from __future__ import annotations

from collections.abc import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings


class Base(DeclarativeBase):
    pass


_is_sqlite = settings.DATABASE_URL.startswith("sqlite")

if _is_sqlite:
    _connect_args: dict = {"check_same_thread": False}
else:
    # Postgres (psycopg 3): enable TCP keepalives so the OS detects
    # half-open connections that managed hosts (Neon, Render, Heroku)
    # silently drop. Without this, an idle connection can read EOF
    # mid-query → "SSL error: unexpected eof while reading".
    _connect_args = {
        "keepalives": 1,
        "keepalives_idle": 30,
        "keepalives_interval": 10,
        "keepalives_count": 5,
    }

# Neon (and most managed Postgres) silently drops idle SSL connections.
# `pool_pre_ping` issues a cheap SELECT 1 before handing a pooled connection
# back to the app and transparently reconnects if it's dead. `pool_recycle`
# proactively rotates connections — kept short because managed PG often
# kills idle conns aggressively. TCP keepalives (see connect_args above)
# cover the in-flight case where a connection dies mid-statement.
engine = create_engine(
    settings.DATABASE_URL,
    connect_args=_connect_args,
    future=True,
    pool_pre_ping=True,
    pool_recycle=120,
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


def init_db() -> None:
    # Lazy-import so model classes register their tables.
    from app import models  # noqa: F401

    Base.metadata.create_all(bind=engine)
    _ensure_donation_columns()


def _ensure_donation_columns() -> None:
    """Lightweight forward-only schema migration.

    `create_all()` only CREATEs missing tables; it never ALTERs existing
    ones. We add the new donations columns here so existing deployments
    don't need Alembic for this small change. Postgres-only (SQLite users
    get column errors only if they preserve data across schema changes —
    fine for dev).
    """
    if not settings.DATABASE_URL.startswith("postgres"):
        return
    with engine.begin() as conn:
        conn.exec_driver_sql(
            "ALTER TABLE donations ADD COLUMN IF NOT EXISTS campaign_id VARCHAR(36)"
        )
        conn.exec_driver_sql(
            "ALTER TABLE donations ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN NOT NULL DEFAULT FALSE"
        )
        conn.exec_driver_sql(
            "CREATE INDEX IF NOT EXISTS ix_donations_campaign_id ON donations (campaign_id)"
        )


def get_db() -> Iterator[Session]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
