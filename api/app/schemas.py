from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator

Frequency = Literal["one_time", "monthly"]
Designation = Literal["general", "grace_bridge", "education", "livelihood"]


class DonationIntentIn(BaseModel):
    amount: int = Field(ge=1, le=100_000, description="Amount in whole USD")
    frequency: Frequency = "one_time"
    designation: Designation = "general"
    donor_name: str | None = None
    donor_email: EmailStr | None = None
    campaign_slug: str | None = Field(default=None, max_length=120)
    is_anonymous: bool = False

    @field_validator("donor_name")
    @classmethod
    def _trim(cls, v: str | None) -> str | None:
        return v.strip() if v else v


class DonationIntentOut(BaseModel):
    checkout_url: str
    session_id: str


class PaypalCreateIn(BaseModel):
    amount: int = Field(ge=1, le=100_000)
    frequency: Frequency = "one_time"
    designation: Designation = "general"
    donor_name: str | None = None
    donor_email: EmailStr | None = None
    campaign_slug: str | None = Field(default=None, max_length=120)
    is_anonymous: bool = False


class PaypalCreateOut(BaseModel):
    order_id: str
    approve_url: str | None = None
    kind: Literal["order", "subscription"] = "order"


class PaypalCaptureIn(BaseModel):
    order_id: str


class PaypalCaptureOut(BaseModel):
    status: str


class ContactIn(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    subject: str | None = Field(default=None, max_length=200)
    message: str = Field(min_length=1, max_length=5000)


class VolunteerIn(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=40)
    location: str | None = Field(default=None, max_length=200)
    skills: str = Field(min_length=1, max_length=1000)
    availability: str | None = Field(default=None, max_length=200)
    message: str | None = Field(default=None, max_length=3000)


# ---- Campaigns ----

CampaignStatus = Literal["draft", "active", "paused", "completed", "archived"]


class ImpactItem(BaseModel):
    amount_cents: int = Field(ge=0)
    label: str = Field(min_length=1, max_length=200)


class CampaignBase(BaseModel):
    slug: str = Field(min_length=1, max_length=120, pattern=r"^[a-z0-9][a-z0-9\-]*$")
    title: str = Field(min_length=1, max_length=200)
    summary: str = Field(default="", max_length=400)
    story_html: str = Field(default="", max_length=50_000)
    hero_image_url: str | None = Field(default=None, max_length=500)
    goal_cents: int = Field(default=0, ge=0)
    currency: str = Field(default="usd", max_length=8)
    designation: Designation = "general"
    status: CampaignStatus = "draft"
    featured: bool = False
    starts_at: datetime | None = None
    ends_at: datetime | None = None
    impact_items: list[ImpactItem] | None = None


class CampaignCreate(CampaignBase):
    pass


class CampaignUpdate(BaseModel):
    slug: str | None = Field(default=None, min_length=1, max_length=120, pattern=r"^[a-z0-9][a-z0-9\-]*$")
    title: str | None = Field(default=None, min_length=1, max_length=200)
    summary: str | None = Field(default=None, max_length=400)
    story_html: str | None = Field(default=None, max_length=50_000)
    hero_image_url: str | None = Field(default=None, max_length=500)
    goal_cents: int | None = Field(default=None, ge=0)
    currency: str | None = Field(default=None, max_length=8)
    designation: Designation | None = None
    status: CampaignStatus | None = None
    featured: bool | None = None
    starts_at: datetime | None = None
    ends_at: datetime | None = None
    impact_items: list[ImpactItem] | None = None


class CampaignOut(BaseModel):
    id: str
    slug: str
    title: str
    summary: str
    story_html: str
    hero_image_url: str | None
    goal_cents: int
    currency: str
    designation: str
    status: CampaignStatus
    featured: bool
    starts_at: datetime
    ends_at: datetime | None
    impact_items: list[ImpactItem] | None
    raised_cents: int
    donors_count: int
    progress_pct: float
    is_ended: bool
    share_url: str
    created_at: datetime
    updated_at: datetime


class CampaignDonor(BaseModel):
    donor_name: str  # "Anonymous" if hidden
    amount_cents: int
    currency: str
    frequency: str
    created_at: datetime


class CampaignUpdatePostIn(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    body_html: str = Field(min_length=1, max_length=20_000)


class CampaignUpdatePostOut(BaseModel):
    id: str
    campaign_id: str
    title: str
    body_html: str
    created_at: datetime

