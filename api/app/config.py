from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# Always load the api/.env regardless of where the process was started from.
_ENV_FILE = Path(__file__).resolve().parent.parent / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_ENV_FILE),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    APP_ENV: str = "development"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8090
    ALLOWED_ORIGINS: str = "http://localhost:3030"

    DATABASE_URL: str = "sqlite:///./nti.db"

    # Stripe
    STRIPE_SECRET_KEY: str = ""
    STRIPE_PUBLISHABLE_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    STRIPE_MONTHLY_PRICE_MAP: str = "{}"

    # PayPal
    PAYPAL_CLIENT_ID: str = ""
    PAYPAL_CLIENT_SECRET: str = ""
    PAYPAL_BASE_URL: str = "https://api-m.sandbox.paypal.com"

    # Receipts / org
    RECEIPT_FROM_EMAIL: str = "info@ntiafrica.org"
    ORG_LEGAL_NAME: str = "Northern Transformation Initiative"
    ORG_ADDRESS: str = "P.O. Box 14271-00100, Nairobi, Kenya"

    PUBLIC_WEB_URL: str = "http://localhost:3030"
    CONTACT_TO_EMAIL: str = "info@ntiafrica.org"

    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = ""

    # Admin (HTTP Basic)
    ADMIN_USERNAME: str = ""
    ADMIN_PASSWORD: str = ""

    # JWT auth
    JWT_SECRET: str = "change-me-in-prod-this-must-be-set"
    JWT_ALG: str = "HS256"
    JWT_EXPIRES_MIN: int = 60 * 8  # 8 hours

    @property
    def allowed_origins(self) -> list[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    @property
    def monthly_price_map(self) -> dict[str, str]:
        try:
            data = json.loads(self.STRIPE_MONTHLY_PRICE_MAP or "{}")
            return {str(k): str(v) for k, v in data.items()}
        except json.JSONDecodeError:
            return {}


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
