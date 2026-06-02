"""Background reconciliation worker for Stripe Checkout sessions.

Why: webhooks aren't always running in dev. After a donation intent is
created we want to confirm the charge without depending on Stripe CLI.

Design:
  - Single asyncio task (singleton) started on FastAPI startup.
  - Loops every POLL_INTERVAL seconds reconciling all pending Stripe rows
    created within RECONCILE_WINDOW_MIN minutes.
  - After IDLE_LIMIT consecutive empty cycles it parks on an asyncio.Event
    and stops polling Stripe.
  - `trigger()` wakes the worker. If it's already running, the wake-up is
    coalesced (Event semantics) — no duplicate work, no queue blow-up.
"""
from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timedelta, timezone

from app.db import SessionLocal
from app.models import Donation
from app.services import stripe_service

log = logging.getLogger("nti.reconciler")

POLL_INTERVAL = 5.0          # seconds between polls when active
IDLE_LIMIT = 6               # ~30s of no pending rows -> park
RECONCILE_WINDOW_MIN = 60    # only reconcile rows created in last hour

_wake: asyncio.Event | None = None
_task: asyncio.Task | None = None
_last_run: datetime | None = None


def _pending_refs() -> list[str]:
    cutoff = datetime.now(timezone.utc) - timedelta(minutes=RECONCILE_WINDOW_MIN)
    with SessionLocal() as db:
        rows = (
            db.query(Donation.provider_ref)
            .filter(
                Donation.provider == "stripe",
                Donation.status == "pending",
                Donation.created_at >= cutoff.replace(tzinfo=None),
                Donation.provider_ref.like("cs_%"),
            )
            .all()
        )
    return [r[0] for r in rows if r[0]]


def _reconcile_once() -> int:
    """Sync all currently pending stripe donations. Returns count processed."""
    global _last_run
    refs = _pending_refs()
    _last_run = datetime.now(timezone.utc)
    for ref in refs:
        try:
            with SessionLocal() as db:
                stripe_service.fetch_and_sync_session(db, ref)
        except Exception:  # noqa: BLE001
            log.exception("reconcile failed for %s", ref)
    return len(refs)


async def _run() -> None:
    assert _wake is not None
    idle = 0
    log.info("donation_reconciler: starting")
    while True:
        try:
            count = await asyncio.to_thread(_reconcile_once)
        except Exception:  # noqa: BLE001
            log.exception("reconcile loop error")
            count = 0

        if count == 0:
            idle += 1
            if idle >= IDLE_LIMIT:
                log.info("donation_reconciler: idle, parking until next trigger")
                _wake.clear()
                await _wake.wait()
                idle = 0
                continue
        else:
            log.info("donation_reconciler: reconciled %d row(s)", count)
            idle = 0

        try:
            await asyncio.wait_for(_wake.wait(), timeout=POLL_INTERVAL)
            _wake.clear()
        except asyncio.TimeoutError:
            pass


def trigger() -> None:
    """Wake the worker. Safe to call any time; coalesced if already running."""
    if _wake is not None:
        try:
            _wake.set()
        except RuntimeError:
            # event bound to a closed loop; ignore
            pass


async def start() -> None:
    global _wake, _task
    if _task and not _task.done():
        return
    _wake = asyncio.Event()
    _wake.set()  # do an immediate first pass on boot
    _task = asyncio.create_task(_run(), name="donation-reconciler")


async def stop() -> None:
    global _task
    if _task and not _task.done():
        _task.cancel()
        try:
            await _task
        except (asyncio.CancelledError, Exception):  # noqa: BLE001
            pass


def status() -> dict:
    return {
        "running": bool(_task and not _task.done()),
        "last_run": _last_run.isoformat() if _last_run else None,
        "poll_interval_sec": POLL_INTERVAL,
        "idle_limit_cycles": IDLE_LIMIT,
    }


def run_now() -> int:
    """Synchronous one-shot reconciliation (used by admin button)."""
    return _reconcile_once()
