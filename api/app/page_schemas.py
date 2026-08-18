"""Schemas + defaults for admin-editable page content.

Each page slug has a Pydantic model registered in `SCHEMA_BY_SLUG` plus a
default dictionary used to seed the row and as the public fallback before
an admin saves the first edit.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


# ==========================================================================
# SHARED MODELS
# ==========================================================================


class Seo(BaseModel):
    title: str = ""
    description: str = ""


class Cta(BaseModel):
    label: str = ""
    href: str = ""
    kind: Literal["link", "donate"] = "link"


class StatItem(BaseModel):
    value: str
    label: str


class TierItem(BaseModel):
    amount: int = Field(ge=1)
    title: str
    body: str


class PillarItem(BaseModel):
    iconKey: str = "groups"
    title: str
    body: str


class HomeCtaBand(BaseModel):
    enabled: bool = True
    title: str
    body: str | None = None


# ==========================================================================
# HOME
# ==========================================================================


class HomeHero(BaseModel):
    enabled: bool = True
    overline: str
    headline: str
    subhead: str
    primaryCta: Cta
    secondaryCta: Cta | None = None
    tertiaryCta: Cta | None = None
    backgroundImageUrl: str | None = None


class HomePillars(BaseModel):
    enabled: bool = True
    eyebrow: str
    title: str
    subtitle: str
    items: list[PillarItem]


class HomeGraceBridge(BaseModel):
    """
    Internal legacy model name retained for compatibility.

    Public-facing program name: Bright Futures Kenya.
    """

    enabled: bool = True
    eyebrow: str
    title: str
    body: str
    cta: Cta
    imageUrl: str | None = None
    overlayText: str | None = None


class HomeStats(BaseModel):
    enabled: bool = True
    items: list[StatItem]


class HomeTiers(BaseModel):
    enabled: bool = True
    eyebrow: str
    title: str
    items: list[TierItem]


class HomeFeaturedCampaigns(BaseModel):
    enabled: bool = True
    eyebrow: str
    title: str
    subtitle: str
    limit: int = Field(default=3, ge=1, le=12)


class HomeQuote(BaseModel):
    enabled: bool = True
    text: str
    attributionName: str
    attributionRole: str


class HomeContent(BaseModel):
    seo: Seo
    hero: HomeHero
    pillars: HomePillars
    graceBridge: HomeGraceBridge
    stats: HomeStats
    donationTiers: HomeTiers
    featuredCampaigns: HomeFeaturedCampaigns
    quote: HomeQuote
    ctaBand: HomeCtaBand


# ==========================================================================
# ABOUT
# ==========================================================================


class AboutIntro(BaseModel):
    eyebrow: str
    title: str
    subtitle: str


class AboutMission(BaseModel):
    enabled: bool = True
    overline: str
    statement: str


class TitledBody(BaseModel):
    title: str
    body: str


class AboutHistoryVision(BaseModel):
    enabled: bool = True
    history: TitledBody
    vision: TitledBody


class ValueItem(BaseModel):
    iconKey: str = "check"
    title: str
    body: str


class AboutValues(BaseModel):
    enabled: bool = True
    title: str
    items: list[ValueItem]


class GovernanceChip(BaseModel):
    label: str
    emphasis: Literal["primary", "default"] = "default"


class AboutGovernance(BaseModel):
    enabled: bool = True
    title: str
    subtitle: str
    chips: list[GovernanceChip]


class AboutContent(BaseModel):
    seo: Seo
    intro: AboutIntro
    mission: AboutMission
    historyVision: AboutHistoryVision
    values: AboutValues
    governance: AboutGovernance
    ctaBand: HomeCtaBand


# ==========================================================================
# LEADERSHIP
# ==========================================================================


class LeadershipIntro(BaseModel):
    eyebrow: str
    title: str


class LeadershipFeatured(BaseModel):
    enabled: bool = True
    name: str
    role: str
    initials: str | None = None
    photoUrl: str | None = None
    phoneDisplay: str | None = None
    phoneTel: str | None = None
    paragraphs: list[str]


class QuoteItem(BaseModel):
    text: str
    attribution: str | None = None


class LeadershipVoice(BaseModel):
    enabled: bool = True
    eyebrow: str
    title: str
    intro: str
    quotes: list[QuoteItem]


class StructureMember(BaseModel):
    role: str
    name: str
    photoUrl: str | None = None
    bioShort: str | None = None


class LeadershipStructure(BaseModel):
    enabled: bool = True
    title: str
    members: list[StructureMember]


class LeadershipContent(BaseModel):
    seo: Seo
    intro: LeadershipIntro
    featured: LeadershipFeatured
    voiceBlock: LeadershipVoice
    structure: LeadershipStructure


# ==========================================================================
# BOOKS
# ==========================================================================


class BookItem(BaseModel):
    title: str
    blurb: str
    coverImageUrl: str | None = None
    ctaLabel: str | None = None
    ctaUrl: str | None = None
    badge: str | None = None


class BooksIntro(BaseModel):
    eyebrow: str
    title: str
    subtitle: str


class BooksContent(BaseModel):
    seo: Seo
    intro: BooksIntro
    books: list[BookItem]


# ==========================================================================
# PROGRAMS
# ==========================================================================


class ProgramPillar(BaseModel):
    slug: str
    title: str
    summary: str
    bullets: list[str]
    iconKey: str | None = None
    linkHref: str | None = None
    linkLabel: str | None = None


class ProgramsIntro(BaseModel):
    eyebrow: str
    title: str
    subtitle: str


class ProgramsPillars(BaseModel):
    enabled: bool = True
    items: list[ProgramPillar]


class ProgramsCurrentFocus(BaseModel):
    enabled: bool = True
    title: str
    body: str
    ctaHref: str | None = None
    ctaLabel: str | None = None


class ProgramsContent(BaseModel):
    seo: Seo
    intro: ProgramsIntro
    pillars: ProgramsPillars
    currentFocus: ProgramsCurrentFocus
    ctaBand: HomeCtaBand


# ==========================================================================
# BRIGHT FUTURES KENYA
# ==========================================================================
#
# Legacy Python class names are retained where changing them could break
# existing imports, API code, CMS data, or frontend integration.
# ==========================================================================


class GBHero(BaseModel):
    overline: str
    title: str
    subhead: str
    backgroundImageUrl: str | None = None


class GBInspiredBy(BaseModel):
    enabled: bool = True
    title: str
    body: str


class GBPillars(BaseModel):
    enabled: bool = True
    title: str
    items: list[PillarItem]


class GBFooterCtaButton(BaseModel):
    label: str
    href: str
    variant: Literal["outlined", "contained"] = "outlined"


class GBFooterCtas(BaseModel):
    enabled: bool = True
    buttons: list[GBFooterCtaButton]


class GraceBridgeContent(BaseModel):
    seo: Seo
    hero: GBHero
    inspiredBy: GBInspiredBy
    pillars: GBPillars
    footerCtas: GBFooterCtas
    ctaBand: HomeCtaBand


# ==========================================================================
# THE NEED
# ==========================================================================


class TPIntro(BaseModel):
    eyebrow: str
    title: str


class TPIssue(BaseModel):
    title: str
    body: str


class TPIssues(BaseModel):
    enabled: bool = True
    items: list[TPIssue]


class TheProblemContent(BaseModel):
    seo: Seo
    intro: TPIntro
    issues: TPIssues
    ctaBand: HomeCtaBand


# ==========================================================================
# OUR SOLUTION
# ==========================================================================


class OSIntro(BaseModel):
    eyebrow: str
    title: str
    subtitle: str


class OSPillars(BaseModel):
    enabled: bool = True
    items: list[PillarItem]


class OurSolutionContent(BaseModel):
    seo: Seo
    intro: OSIntro
    pillars: OSPillars
    ctaBand: HomeCtaBand


# ==========================================================================
# IMPACT & TRANSPARENCY
# ==========================================================================


class ImpactIntro(BaseModel):
    eyebrow: str
    title: str
    subtitle: str


class ImpactStats(BaseModel):
    enabled: bool = True
    items: list[StatItem]


class ImpactDocItem(BaseModel):
    title: str
    status: Literal["available", "coming-soon"] = "coming-soon"
    fileUrl: str | None = None
    year: int | None = None


class ImpactDocuments(BaseModel):
    enabled: bool = True
    title: str
    items: list[ImpactDocItem]


class ImpactWhyGiftMatters(BaseModel):
    enabled: bool = True
    title: str
    body: str


class ImpactContent(BaseModel):
    seo: Seo
    intro: ImpactIntro
    stats: ImpactStats
    documents: ImpactDocuments
    whyGiftMatters: ImpactWhyGiftMatters
    ctaBand: HomeCtaBand


# ==========================================================================
# GET INVOLVED
# ==========================================================================


class GIIntro(BaseModel):
    eyebrow: str
    title: str
    align: Literal["left", "center"] = "center"


class GIOption(BaseModel):
    iconKey: str = "favorite"
    title: str
    body: str
    ctaLabel: str
    ctaHref: str
    ctaColor: Literal["primary", "secondary"] = "primary"


class GIOptions(BaseModel):
    enabled: bool = True
    items: list[GIOption]


class GetInvolvedContent(BaseModel):
    seo: Seo
    intro: GIIntro
    options: GIOptions


# ==========================================================================
# SITE-WIDE LAYOUT
# ==========================================================================


class LayoutNavChild(BaseModel):
    label: str
    to: str


class LayoutNavItem(BaseModel):
    label: str
    to: str
    children: list[LayoutNavChild] = Field(default_factory=list)


class LayoutNav(BaseModel):
    brandName: str
    brandTagline: str
    items: list[LayoutNavItem]


class LayoutFooterLink(BaseModel):
    label: str
    to: str


class LayoutFooterColumn(BaseModel):
    heading: str
    links: list[LayoutFooterLink]


class LayoutFooterContact(BaseModel):
    usOfficeLine: str
    usPhoneDisplay: str
    usPhoneTel: str
    kePhoneDisplay: str
    kePhoneTel: str
    email: str
    keAddress: str


class LayoutFooter(BaseModel):
    brandName: str
    brandBlurb: str
    columns: list[LayoutFooterColumn]
    contact: LayoutFooterContact
    legalDisclosure: str
    copyright: str
    bottomLinks: list[LayoutFooterLink]


class LayoutContent(BaseModel):
    nav: LayoutNav
    footer: LayoutFooter


# ==========================================================================
# DEFAULT CONTENT
# ==========================================================================


HOME_DEFAULTS: dict = {
    "seo": {
        "title": "Home",
        "description": (
            "Northern Transformation Initiative (NTI) expands opportunity for "
            "vulnerable children in Kenya through safe care, education, nutrition, "
            "health, protection, and long-term development."
        ),
    },
    "hero": {
        "enabled": True,
        "overline": "Founded in Kenya · 2011  |  U.S. 501(c)(3) Public Charity",
        "headline": (
            "Protecting Children.\n"
            "Expanding Opportunity.\n"
            "Building Brighter Futures."
        ),
        "subhead": (
            "Northern Transformation Initiative creates safe, stable pathways "
            "for vulnerable children in Kenya to learn, grow, and thrive through "
            "education, protection, nutrition, health support, and structured care."
        ),
        "primaryCta": {
            "label": "Donate",
            "href": "/donate",
            "kind": "donate",
        },
        "secondaryCta": {
            "label": "Explore Bright Futures Kenya",
            "href": "/programs/bright-futures-kenya",
            "kind": "link",
        },
        "tertiaryCta": {
            "label": "Learn About NTI",
            "href": "/about",
            "kind": "link",
        },
    },
    "pillars": {
        "enabled": True,
        "eyebrow": "Our approach",
        "title": (
            "Every child deserves safety, education, and the opportunity to thrive."
        ),
        "subtitle": (
            "We address the interconnected barriers that place vulnerable children "
            "at risk by combining safe care, consistent education, health and "
            "nutrition support, and child-centered development."
        ),
        "items": [
            {
                "iconKey": "home",
                "title": "Safe Care & Protection",
                "body": (
                    "A stable, protective environment where vulnerable children can "
                    "live with dignity, security, consistent care, and strong safeguarding."
                ),
            },
            {
                "iconKey": "school",
                "title": "Education & Learning",
                "body": (
                    "School access, transportation, uniforms, learning materials, "
                    "tutoring, and homework support that help children remain engaged "
                    "and progress academically."
                ),
            },
            {
                "iconKey": "heart",
                "title": "Health & Development",
                "body": (
                    "Nutritious meals, clothing and hygiene essentials, health and "
                    "dental support, recreation, mentorship, and opportunities for "
                    "healthy childhood development."
                ),
            },
        ],
    },

    # Internal legacy key retained for frontend/API compatibility.
    "graceBridge": {
        "enabled": True,
        "eyebrow": "Our flagship initiative",
        "title": "Bright Futures Kenya",
        "body": (
            "Bright Futures Kenya is NTI's child-focused residential education, "
            "protection, and development initiative for vulnerable children ages "
            "6–10 in Kenya. The program is designed to provide safe care, school "
            "access, nutritious meals, health support, safeguarding, tutoring, "
            "recreation, and the stability children need to build stronger futures."
        ),
        "cta": {
            "label": "Explore Bright Futures Kenya",
            "href": "/programs/bright-futures-kenya",
            "kind": "link",
        },
        "overlayText": (
            "A safe place to live. A real chance to learn. A brighter future."
        ),
    },
    "stats": {
        "enabled": True,
        "items": [
            {
                "value": "2011",
                "label": "NTI founded in Kenya",
            },
            {
                "value": "6–10",
                "label": "Ages served by Bright Futures Kenya",
            },
            {
                "value": "501(c)(3)",
                "label": "IRS-recognized U.S. public charity",
            },
        ],
    },
    "donationTiers": {
        "enabled": True,
        "eyebrow": "Your impact",
        "title": "Help create the conditions every child needs to thrive",
        "items": [
            {
                "amount": 25,
                "title": "Support Daily Essentials",
                "body": (
                    "Helps provide essential learning, hygiene, clothing, or "
                    "nutrition needs for children supported through NTI programs."
                ),
            },
            {
                "amount": 50,
                "title": "Strengthen a Child's Education",
                "body": (
                    "Helps provide school supplies, learning materials, transportation, "
                    "tutoring, and other educational support that keeps a child "
                    "connected to learning."
                ),
            },
            {
                "amount": 100,
                "title": "Invest in Safe, Stable Care",
                "body": (
                    "Helps support the combined costs of safe care, nutritious meals, "
                    "education, health needs, safeguarding, and child development."
                ),
            },
        ],
    },
    "featuredCampaigns": {
        "enabled": True,
        "eyebrow": "Take action",
        "title": "Support our current campaigns",
        "subtitle": (
            "Fund practical, accountable programs that protect vulnerable children "
            "and expand their opportunities for the future."
        ),
        "limit": 3,
    },
    "quote": {
        "enabled": True,
        "text": (
            "When a child has safety, education, and consistent support, "
            "poverty does not have to determine the future."
        ),
        "attributionName": "Northern Transformation Initiative",
        "attributionRole": "Bright Futures Kenya",
    },
    "ctaBand": {
        "enabled": True,
        "title": "Help give a child the foundation for a brighter future.",
        "body": (
            "Your support helps provide vulnerable children with safety, education, "
            "nutrition, health support, protection, and opportunities to grow."
        ),
    },
}


ABOUT_DEFAULTS: dict = {
    "seo": {
        "title": "About NTI",
        "description": (
            "Northern Transformation Initiative is a nonprofit organization "
            "working to protect vulnerable children in Kenya and expand access "
            "to education, health, safety, and opportunity."
        ),
    },
    "intro": {
        "eyebrow": "About",
        "title": "Building brighter futures for vulnerable children.",
        "subtitle": (
            "Founded in Kenya in 2011, Northern Transformation Initiative works "
            "to create safe, stable pathways for vulnerable children to learn, "
            "grow, and thrive. NTI is also an IRS-recognized U.S. 501(c)(3) "
            "public charity."
        ),
    },
    "mission": {
        "enabled": True,
        "overline": "Mission",
        "statement": (
            "To protect vulnerable children and expand their opportunities through "
            "safe care, education, nutrition, health support, safeguarding, and "
            "child-centered development."
        ),
    },
    "historyVision": {
        "enabled": True,
        "history": {
            "title": "Our history",
            "body": (
                "Northern Transformation Initiative was founded in Kenya in 2011 "
                "with a commitment to improving opportunities for vulnerable children. "
                "That commitment continues through structured programs designed around "
                "safety, education, health, dignity, and long-term development."
            ),
        },
        "vision": {
            "title": "Our vision",
            "body": (
                "We envision a future in which vulnerable children are protected "
                "from instability and given the consistent care, education, health "
                "support, and opportunities they need to reach their potential."
            ),
        },
    },
    "values": {
        "enabled": True,
        "title": "Values that guide our work",
        "items": [
            {
                "iconKey": "shield",
                "title": "Child Protection",
                "body": (
                    "The safety, dignity, and well-being of every child come first."
                ),
            },
            {
                "iconKey": "check",
                "title": "Integrity",
                "body": (
                    "We approach every responsibility with honesty, transparency, "
                    "and responsible stewardship."
                ),
            },
            {
                "iconKey": "scale",
                "title": "Accountability",
                "body": (
                    "Programs are designed around clear responsibilities, oversight, "
                    "and measurable outcomes."
                ),
            },
            {
                "iconKey": "heart",
                "title": "Dignity",
                "body": (
                    "Every child deserves to be treated with respect and supported "
                    "in an environment where they can grow with confidence."
                ),
            },
        ],
    },
    "governance": {
        "enabled": True,
        "title": "Registration & governance",
        "subtitle": (
            "NTI operates through nonprofit governance, financial oversight, "
            "safeguarding, and accountability structures in support of its mission."
        ),
        "chips": [
            {
                "label": "Founded in Kenya · Feb 10, 2011",
                "emphasis": "primary",
            },
            {
                "label": "U.S. 501(c)(3) Public Charity",
                "emphasis": "primary",
            },
            {
                "label": "HQ: Nairobi, Kenya",
                "emphasis": "default",
            },
            {
                "label": "U.S. Office: Boston, MA",
                "emphasis": "default",
            },
        ],
    },
    "ctaBand": {
        "enabled": True,
        "title": "Help build a safer, brighter future for a child.",
        "body": None,
    },
}


LEADERSHIP_DEFAULTS: dict = {
    "seo": {
        "title": "Leadership",
        "description": (
            "Meet Adan Muktar, Founder & Executive Director of Northern "
            "Transformation Initiative, and NTI's leadership structure."
        ),
    },
    "intro": {
        "eyebrow": "Leadership",
        "title": "Leadership grounded in lived experience and accountability.",
    },
    "featured": {
        "enabled": True,
        "name": "Adan Muktar",
        "role": "Founder & Executive Director · Boston, Massachusetts",
        "initials": "AM",
        "photoUrl": None,
        "phoneDisplay": "+1 (646) 991-7016",
        "phoneTel": "+1 (646) 991-7016",
        "paragraphs": [
            (
                "Adan founded Northern Transformation Initiative with a commitment "
                "to expanding opportunity for vulnerable children. His own experience "
                "of hardship, displacement, and the transformative power of education "
                "continues to shape NTI's child-focused mission."
            ),
            (
                "From Boston, Massachusetts, Adan leads U.S. partnerships, fundraising "
                "strategy, international collaboration, and program development. His "
                "leadership emphasizes child protection, education, responsible "
                "stewardship, transparency, and measurable impact."
            ),
        ],
    },
    "voiceBlock": {
        "enabled": True,
        "eyebrow": "A mission shaped by experience",
        "title": "Creating opportunity where poverty limits possibility.",
        "intro": (
            "Experiences of hardship, displacement, and instability helped shape "
            "NTI's commitment to creating safer and more stable pathways for vulnerable "
            "children. Bright Futures Kenya turns that commitment into structured "
            "support centered on protection, education, health, nutrition, and opportunity."
        ),
        "quotes": [
            {
                "text": (
                    "Every child deserves the safety and support needed to imagine "
                    "a future beyond poverty."
                ),
                "attribution": "Northern Transformation Initiative",
            },
            {
                "text": (
                    "Education can open a door, but stability gives a child the "
                    "chance to walk through it."
                ),
                "attribution": "Northern Transformation Initiative",
            },
        ],
    },
    "structure": {
        "enabled": True,
        "title": "Leadership structure",
        "members": [
            {
                "role": "President & Director",
                "name": "Adan Muktar",
                "photoUrl": None,
                "bioShort": None,
            },
            {
                "role": "Treasurer",
                "name": "Osman Haji",
                "photoUrl": None,
                "bioShort": None,
            },
            {
                "role": "Clerk",
                "name": "Ismail Jama",
                "photoUrl": None,
                "bioShort": None,
            },
        ],
    },
}


BOOKS_DEFAULTS: dict = {
    "seo": {
        "title": "Books by Adan Muktar",
        "description": (
            "Books by NTI founder Adan Muktar — lived testimony of displacement, "
            "resilience, identity, and the transformative power of education."
        ),
    },
    "intro": {
        "eyebrow": "Books by Adan Muktar",
        "title": "A voice born from experience.",
        "subtitle": (
            "Adan's writing reflects lived experiences of hardship, displacement, "
            "institutional instability, resilience, and the role education can play "
            "in changing a child's future."
        ),
    },
    "books": [
        {
            "title": "Memoirs of a Lost Boy: A Journey of Identity",
            "blurb": (
                "A lived testimony of displacement, resilience, identity, and the "
                "transformative power of education."
            ),
            "coverImageUrl": None,
            "ctaLabel": "View on Amazon",
            "ctaUrl": (
                "https://www.amazon.com/MEMOIRS-LOST-BOY-journey-identity-ebook/"
                "dp/B0FS69WM9Q"
            ),
            "badge": None,
        },
    ],
}


PROGRAMS_DEFAULTS: dict = {
    "seo": {
        "title": "Programs",
        "description": (
            "NTI programs create safe, stable pathways for vulnerable children "
            "through protection, education, health, nutrition, and development."
        ),
    },
    "intro": {
        "eyebrow": "Our programs",
        "title": "Building the foundation every child needs to thrive.",
        "subtitle": (
            "NTI's programs address the interconnected needs of vulnerable children "
            "by combining safe care and protection, education and learning, and "
            "health and development support."
        ),
    },
    "pillars": {
        "enabled": True,
        "items": [
            {
                "slug": "safe-care-protection",
                "title": "Safe Care & Protection",
                "summary": (
                    "Stable, protective care designed around children's safety, "
                    "dignity, consistency, and well-being."
                ),
                "bullets": [
                    "Safe and stable care",
                    "Child safeguarding",
                    "Clothing and hygiene essentials",
                    "Consistent supervision and support",
                ],
                "iconKey": "home",
                "linkHref": None,
                "linkLabel": None,
            },
            {
                "slug": "education-learning",
                "title": "Education & Learning",
                "summary": (
                    "Practical educational support that helps children enter school, "
                    "remain engaged, and progress academically."
                ),
                "bullets": [
                    "School access",
                    "Transportation",
                    "Uniforms and learning materials",
                    "Tutoring and homework support",
                ],
                "iconKey": "school",
                "linkHref": None,
                "linkLabel": None,
            },
            {
                "slug": "health-development",
                "title": "Health & Development",
                "summary": (
                    "Nutrition, healthcare, recreation, mentorship, and development "
                    "support that strengthen children's overall well-being."
                ),
                "bullets": [
                    "Nutritious meals",
                    "Health and dental support",
                    "Recreation and play",
                    "Mentorship and child development",
                ],
                "iconKey": "heart",
                "linkHref": None,
                "linkLabel": None,
            },
        ],
    },
    "currentFocus": {
        "enabled": True,
        "title": "Current focus: Bright Futures Kenya",
        "body": (
            "Bright Futures Kenya is NTI's child-focused residential education, "
            "protection, and development initiative for vulnerable children ages "
            "6–10 in Kenya. It brings safe care, education, nutrition, health support, "
            "safeguarding, tutoring, recreation, and child development together in "
            "one structured program."
        ),
        "ctaHref": "/programs/bright-futures-kenya",
        "ctaLabel": "Explore Bright Futures Kenya",
    },
    "ctaBand": {
        "enabled": True,
        "title": "Help create a brighter future for a child.",
        "body": None,
    },
}


# Internal constant name retained for compatibility.
GRACE_BRIDGE_DEFAULTS: dict = {
    "seo": {
        "title": "Bright Futures Kenya",
        "description": (
            "Bright Futures Kenya is NTI's child-focused residential education, "
            "protection, and development initiative for vulnerable children ages "
            "6–10 in Kenya."
        ),
    },
    "hero": {
        "overline": "Our flagship initiative",
        "title": "Bright Futures Kenya",
        "subhead": (
            "A child-focused residential education, protection, and development "
            "initiative creating safe, stable pathways for vulnerable children "
            "ages 6–10 in Kenya."
        ),
        "backgroundImageUrl": None,
    },
    "inspiredBy": {
        "enabled": True,
        "title": "A foundation for brighter futures",
        "body": (
            "Bright Futures Kenya is built around a simple principle: children "
            "need more than temporary assistance to thrive. They need safety, "
            "stability, consistent education, nutritious food, health support, "
            "protection, encouragement, and the opportunity to experience childhood "
            "in a secure environment. NTI brings these essential supports together "
            "through a structured, child-centered model."
        ),
    },
    "pillars": {
        "enabled": True,
        "title": "What we provide",
        "items": [
            {
                "iconKey": "home",
                "title": "Safe Residential Care",
                "body": (
                    "A stable and protective living environment centered on "
                    "children's safety, dignity, and well-being."
                ),
            },
            {
                "iconKey": "school",
                "title": "Education Access",
                "body": (
                    "School enrollment, transportation, uniforms, learning "
                    "materials, tutoring, and homework support."
                ),
            },
            {
                "iconKey": "nutrition",
                "title": "Nutrition",
                "body": (
                    "Nutritious meals that support children's health, learning, "
                    "growth, and development."
                ),
            },
            {
                "iconKey": "hospital",
                "title": "Health Support",
                "body": (
                    "Access to appropriate medical and dental support for children "
                    "in the program."
                ),
            },
            {
                "iconKey": "shield",
                "title": "Safeguarding & Protection",
                "body": (
                    "Child-centered safeguarding practices designed to protect "
                    "children from harm and provide consistent supervision."
                ),
            },
            {
                "iconKey": "groups",
                "title": "Development & Mentorship",
                "body": (
                    "Recreation, mentorship, encouragement, and structured "
                    "opportunities that support healthy childhood development."
                ),
            },
        ],
    },
    "footerCtas": {
        "enabled": True,
        "buttons": [
            {
                "label": "Understand the need",
                "href": "/programs/bright-futures-kenya/the-need",
                "variant": "outlined",
            },
            {
                "label": "See our solution",
                "href": "/programs/bright-futures-kenya/our-solution",
                "variant": "contained",
            },
        ],
    },
    "ctaBand": {
        "enabled": True,
        "title": "Help give a child a safe place to grow.",
        "body": (
            "Your support helps provide safe care, education, nutrition, health "
            "support, safeguarding, and opportunities for healthy development."
        ),
    },
}


THE_PROBLEM_DEFAULTS: dict = {
    "seo": {
        "title": "The Need",
        "description": (
            "Why vulnerable children in Kenya need safe care, education, nutrition, "
            "health support, safeguarding, and long-term stability."
        ),
    },
    "intro": {
        "eyebrow": "Bright Futures Kenya · The Need",
        "title": "Children cannot thrive without safety and stability.",
    },
    "issues": {
        "enabled": True,
        "items": [
            {
                "title": "Unsafe or unstable living conditions",
                "body": (
                    "Children experiencing unstable care or unsafe living conditions "
                    "can face serious barriers to their safety, development, education, "
                    "and emotional well-being."
                ),
            },
            {
                "title": "Interrupted education",
                "body": (
                    "Poverty and instability can prevent children from enrolling in "
                    "school consistently or accessing transportation, uniforms, "
                    "learning materials, tutoring, and the support needed to progress."
                ),
            },
            {
                "title": "Nutrition and health barriers",
                "body": (
                    "Without reliable nutrition and access to basic health support, "
                    "children can struggle to learn, grow, participate in school, "
                    "and develop to their full potential."
                ),
            },
            {
                "title": "The need for consistent care",
                "body": (
                    "One-time assistance cannot replace stability. Vulnerable children "
                    "need coordinated protection, education, nutrition, healthcare, "
                    "safeguarding, mentorship, and consistent adult support."
                ),
            },
        ],
    },
    "ctaBand": {
        "enabled": True,
        "title": "A brighter future begins with a safe and stable foundation.",
        "body": None,
    },
}


OUR_SOLUTION_DEFAULTS: dict = {
    "seo": {
        "title": "Our Solution",
        "description": (
            "Bright Futures Kenya combines safe residential care, education, "
            "nutrition, health support, safeguarding, and child development."
        ),
    },
    "intro": {
        "eyebrow": "Bright Futures Kenya · Our Solution",
        "title": "One child-centered model. Every essential support.",
        "subtitle": (
            "Children's needs are interconnected. Safe care supports learning. "
            "Nutrition supports health. Education expands opportunity. Safeguarding "
            "protects progress. Bright Futures Kenya brings these supports together "
            "in one structured environment."
        ),
    },
    "pillars": {
        "enabled": True,
        "items": [
            {
                "iconKey": "home",
                "title": "Safe Residential Care",
                "body": (
                    "A stable, protective living environment where children can "
                    "experience security, dignity, consistent care, and routine."
                ),
            },
            {
                "iconKey": "school",
                "title": "Education & Learning",
                "body": (
                    "School access, transportation, uniforms, learning materials, "
                    "tutoring, and homework support."
                ),
            },
            {
                "iconKey": "nutrition",
                "title": "Nutrition",
                "body": (
                    "Nutritious meals that support children's growth, health, "
                    "concentration, and learning."
                ),
            },
            {
                "iconKey": "hospital",
                "title": "Health Support",
                "body": (
                    "Access to appropriate medical and dental support as part of "
                    "each child's overall care."
                ),
            },
            {
                "iconKey": "shield",
                "title": "Safeguarding & Protection",
                "body": (
                    "Clear child-protection practices, responsible supervision, "
                    "and a program culture centered on safety and dignity."
                ),
            },
            {
                "iconKey": "groups",
                "title": "Development & Mentorship",
                "body": (
                    "Recreation, mentorship, encouragement, and development "
                    "opportunities that allow children to learn, play, and grow."
                ),
            },
        ],
    },
    "ctaBand": {
        "enabled": True,
        "title": "Invest in a child's safety, education, and future.",
        "body": None,
    },
}


IMPACT_DEFAULTS: dict = {
    "seo": {
        "title": "Impact & Transparency",
        "description": (
            "NTI's commitment to measurable impact, responsible stewardship, "
            "financial transparency, and child-centered accountability."
        ),
    },
    "intro": {
        "eyebrow": "Impact & Transparency",
        "title": "Accountability behind every commitment.",
        "subtitle": (
            "NTI is committed to responsible stewardship, program oversight, "
            "child safeguarding, transparent reporting, and measuring the results "
            "of our work."
        ),
    },
    "stats": {
        "enabled": True,
        "items": [
            {
                "value": "2011",
                "label": "NTI founded in Kenya",
            },
            {
                "value": "6–10",
                "label": "Ages served by Bright Futures Kenya",
            },
            {
                "value": "501(c)(3)",
                "label": "IRS-recognized U.S. public charity",
            },
        ],
    },
    "documents": {
        "enabled": True,
        "title": "Documents",
        "items": [
            {
                "title": "Annual Report",
                "status": "coming-soon",
                "fileUrl": None,
                "year": None,
            },
            {
                "title": "Financial Summary",
                "status": "coming-soon",
                "fileUrl": None,
                "year": None,
            },
            {
                "title": "Compliance & Registration Certificates",
                "status": "coming-soon",
                "fileUrl": None,
                "year": None,
            },
        ],
    },
    "whyGiftMatters": {
        "enabled": True,
        "title": "Why your gift matters",
        "body": (
            "For a vulnerable child, stability can change the direction of a life. "
            "Support for NTI helps create access to safe care, education, nutritious "
            "meals, health support, safeguarding, mentorship, and the consistent "
            "environment children need to build stronger futures."
        ),
    },
    "ctaBand": {
        "enabled": True,
        "title": "Help us build measurable, lasting impact for children.",
        "body": None,
    },
}


GET_INVOLVED_DEFAULTS: dict = {
    "seo": {
        "title": "Get Involved",
        "description": (
            "Donate, partner, or volunteer with Northern Transformation Initiative "
            "to help create brighter futures for vulnerable children in Kenya."
        ),
    },
    "intro": {
        "eyebrow": "Get involved",
        "title": "Help create a brighter future for a child.",
        "align": "center",
    },
    "options": {
        "enabled": True,
        "items": [
            {
                "iconKey": "favorite",
                "title": "Donate",
                "body": (
                    "Your support helps provide safe care, education, nutritious "
                    "meals, health support, safeguarding, and development opportunities "
                    "for vulnerable children."
                ),
                "ctaLabel": "Give now",
                "ctaHref": "/donate",
                "ctaColor": "secondary",
            },
            {
                "iconKey": "handshake",
                "title": "Partner",
                "body": (
                    "Organizations, businesses, institutions, and community partners "
                    "can help strengthen sustainable support for children through "
                    "funding, expertise, resources, and collaboration."
                ),
                "ctaLabel": "Start a conversation",
                "ctaHref": "/contact",
                "ctaColor": "primary",
            },
            {
                "iconKey": "heart",
                "title": "Volunteer",
                "body": (
                    "Contribute professional skills and expertise that strengthen "
                    "NTI's programs, operations, communications, education support, "
                    "and organizational capacity."
                ),
                "ctaLabel": "Tell us your skills",
                "ctaHref": "/volunteer",
                "ctaColor": "primary",
            },
        ],
    },
}


LAYOUT_DEFAULTS: dict = {
    "nav": {
        "brandName": "NTI",
        "brandTagline": "Northern Transformation Initiative",
        "items": [
            {
                "label": "About",
                "to": "/about",
                "children": [
                    {
                        "label": "Our Story",
                        "to": "/about",
                    },
                    {
                        "label": "Leadership",
                        "to": "/about/leadership",
                    },
                    {
                        "label": "Books",
                        "to": "/about/books",
                    },
                ],
            },
            {
                "label": "Programs",
                "to": "/programs",
                "children": [
                    {
                        "label": "All Programs",
                        "to": "/programs",
                    },
                    {
                        "label": "Bright Futures Kenya",
                        "to": "/programs/bright-futures-kenya",
                    },
                    {
                        "label": "The Need",
                        "to": "/programs/bright-futures-kenya/the-need",
                    },
                    {
                        "label": "Our Solution",
                        "to": "/programs/bright-futures-kenya/our-solution",
                    },
                ],
            },
            {
                "label": "Impact",
                "to": "/impact",
                "children": [],
            },
            {
                "label": "Campaigns",
                "to": "/campaigns",
                "children": [],
            },
            {
                "label": "Get Involved",
                "to": "/get-involved",
                "children": [],
            },
            {
                "label": "Contact",
                "to": "/contact",
                "children": [],
            },
        ],
    },
    "footer": {
        "brandName": "Northern Transformation Initiative",
        "brandBlurb": (
            "Creating safe, stable pathways to education, protection, health, "
            "and opportunity for vulnerable children in Kenya."
        ),
        "columns": [
            {
                "heading": "Explore",
                "links": [
                    {
                        "label": "About",
                        "to": "/about",
                    },
                    {
                        "label": "Programs",
                        "to": "/programs",
                    },
                    {
                        "label": "Bright Futures Kenya",
                        "to": "/programs/bright-futures-kenya",
                    },
                    {
                        "label": "Impact",
                        "to": "/impact",
                    },
                ],
            },
            {
                "heading": "Engage",
                "links": [
                    {
                        "label": "Donate",
                        "to": "/donate",
                    },
                    {
                        "label": "Campaigns",
                        "to": "/campaigns",
                    },
                    {
                        "label": "Get Involved",
                        "to": "/get-involved",
                    },
                    {
                        "label": "Contact",
                        "to": "/contact",
                    },
                    {
                        "label": "Books",
                        "to": "/about/books",
                    },
                ],
            },
        ],
        "contact": {
            "usOfficeLine": "119 Sumner Street, Boston, MA 02128",
            "usPhoneDisplay": "+1 (646) 991-7016",
            "usPhoneTel": "+1 (646) 991-7016",
            "kePhoneDisplay": "+254 728 979121",
            "kePhoneTel": "+254 728 979121",
            "email": "info@northerntransformationinitiative.org",
            "keAddress": "P.O. Box 14271-00100\nNairobi, Kenya",
        },
        "legalDisclosure": (
            "Northern Transformation Initiative Inc. is a Massachusetts nonprofit "
            "corporation and a federally recognized 501(c)(3) tax-exempt organization."
        ),
        "copyright": (
            "© {year} Northern Transformation Initiative. All rights reserved."
        ),
        "bottomLinks": [
            {
                "label": "Privacy",
                "to": "/privacy",
            },
            {
                "label": "Terms",
                "to": "/terms",
            },
        ],
    },
}


# ==========================================================================
# REGISTRY
# ==========================================================================
#
# Legacy slug keys are retained because existing backend/frontend code may
# still request them. Public navigation uses Bright Futures Kenya URLs.
#
# Do not rename these internal keys until the routing/API layer is migrated.
# ==========================================================================


SCHEMA_BY_SLUG: dict[str, type[BaseModel]] = {
    "home": HomeContent,
    "about": AboutContent,
    "leadership": LeadershipContent,
    "books": BooksContent,
    "programs": ProgramsContent,
    "grace-bridge": GraceBridgeContent,
    "the-problem": TheProblemContent,
    "our-solution": OurSolutionContent,
    "impact": ImpactContent,
    "get-involved": GetInvolvedContent,
    "layout": LayoutContent,
}


DEFAULTS_BY_SLUG: dict[str, dict] = {
    "home": HOME_DEFAULTS,
    "about": ABOUT_DEFAULTS,
    "leadership": LEADERSHIP_DEFAULTS,
    "books": BOOKS_DEFAULTS,
    "programs": PROGRAMS_DEFAULTS,
    "grace-bridge": GRACE_BRIDGE_DEFAULTS,
    "the-problem": THE_PROBLEM_DEFAULTS,
    "our-solution": OUR_SOLUTION_DEFAULTS,
    "impact": IMPACT_DEFAULTS,
    "get-involved": GET_INVOLVED_DEFAULTS,
    "layout": LAYOUT_DEFAULTS,
}
