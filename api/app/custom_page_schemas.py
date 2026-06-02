"""Pydantic schemas for the typed content blocks used by `CustomPage`.

Each block is `{ id, type, data }`. `BLOCK_MODELS` maps `type` → data model.
Validation strategy: validate `data` against the matching model. Unknown
types are rejected at write time, ignored at read time on the client
(forward compat).
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class _StrictBlock(BaseModel):
    model_config = ConfigDict(extra="forbid")


# --- block data models -----------------------------------------------------


class HeroData(_StrictBlock):
    eyebrow: str = ""
    title: str
    subtitle: str = ""
    ctaLabel: str = ""
    ctaTo: str = ""
    image: str = ""


class RichTextData(_StrictBlock):
    html: str = ""


class ImageTextData(_StrictBlock):
    image: str = ""
    side: Literal["left", "right"] = "left"
    title: str = ""
    body: str = ""


class FeatureGridItem(_StrictBlock):
    iconKey: str = ""
    title: str = ""
    body: str = ""


class FeatureGridData(_StrictBlock):
    title: str = ""
    items: list[FeatureGridItem] = Field(default_factory=list)


class QuoteData(_StrictBlock):
    text: str = ""
    attribution: str = ""


class CTAData(_StrictBlock):
    title: str = ""
    body: str = ""
    primaryLabel: str = ""
    primaryTo: str = ""
    secondaryLabel: str = ""
    secondaryTo: str = ""


class FAQItem(_StrictBlock):
    q: str = ""
    a: str = ""


class FAQData(_StrictBlock):
    items: list[FAQItem] = Field(default_factory=list)


class EmbedData(_StrictBlock):
    kind: Literal["youtube", "raw"] = "youtube"
    value: str = ""


BLOCK_MODELS: dict[str, type[BaseModel]] = {
    "hero": HeroData,
    "richText": RichTextData,
    "imageText": ImageTextData,
    "featureGrid": FeatureGridData,
    "quote": QuoteData,
    "cta": CTAData,
    "faq": FAQData,
    "embed": EmbedData,
}


# --- page-level schemas ----------------------------------------------------


class SeoData(BaseModel):
    model_config = ConfigDict(extra="ignore")

    description: str = ""
    ogImage: str = ""


def validate_blocks(raw: list) -> list[dict]:
    """Validate a list of blocks. Returns the validated, normalized list."""
    if not isinstance(raw, list):
        raise ValueError("blocks must be a list")
    out: list[dict] = []
    for i, block in enumerate(raw):
        if not isinstance(block, dict):
            raise ValueError(f"block[{i}] must be an object")
        btype = block.get("type")
        bid = block.get("id")
        bdata = block.get("data", {})
        if not isinstance(btype, str) or not btype:
            raise ValueError(f"block[{i}] missing 'type'")
        if not isinstance(bid, str) or not bid:
            raise ValueError(f"block[{i}] missing 'id'")
        model = BLOCK_MODELS.get(btype)
        if model is None:
            raise ValueError(f"block[{i}] unknown type '{btype}'")
        validated = model.model_validate(bdata).model_dump()
        out.append({"id": bid, "type": btype, "data": validated})
    return out


# --- slug validation -------------------------------------------------------

# Anything that is already a route, an admin namespace, an API namespace,
# or a static asset path must not be claimed as a custom-page slug.
RESERVED_SLUGS: frozenset[str] = frozenset(
    {
        "admin",
        "api",
        "assets",
        "static",
        "public",
        "favicon.ico",
        "robots.txt",
        "sitemap.xml",
        "404",
        "login",
        "logout",
        "donate",
        "campaigns",
        "campaign",
        "contact",
        "volunteer",
        "privacy",
        "terms",
    }
)
