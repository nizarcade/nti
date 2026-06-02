"""Schemas + defaults for admin-editable page content.

Each page slug has a Pydantic model registered in `SCHEMA_BY_SLUG` plus a
default dictionary used to seed the row and as the public fallback before
an admin saves the first edit.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


# ---------- Shared sub-models ----------


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


# ---------- Home ----------


class HomeHero(BaseModel):
    enabled: bool = True
    overline: str
    headline: str  # supports \n for line breaks
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


class HomeCtaBand(BaseModel):
    enabled: bool = True
    title: str
    body: str | None = None


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


# ---------- About ----------


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


# ---------- Leadership ----------


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


# ---------- Books ----------


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


# ---------- Programs ----------


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


HOME_DEFAULTS: dict = {
    "seo": {
        "title": "Home",
        "description": (
            "Northern Transformation Initiative (NTI) — restoring dignity and "
            "expanding opportunity through education, maternal support, and "
            "livelihoods across Kenya."
        ),
    },
    "hero": {
        "enabled": True,
        "overline": "Founded in Kenya · 2011  |  Incorporated in the U.S. · 2026",
        "headline": "Restoring Dignity.\nExpanding Opportunity.\nDelivering Measurable Impact.",
        "subhead": (
            "NTI strengthens vulnerable communities across Kenya through education "
            "access, maternal support, livelihood development, and structured "
            "humanitarian programs — with integrity, transparency, and measurable impact."
        ),
        "primaryCta": {"label": "Donate", "href": "/donate", "kind": "donate"},
        "secondaryCta": {
            "label": "Learn About Grace Bridge",
            "href": "/programs/grace-bridge",
            "kind": "link",
        },
        "tertiaryCta": {"label": "Learn More", "href": "/about", "kind": "link"},
    },
    "pillars": {
        "enabled": True,
        "eyebrow": "Our mission",
        "title": "Generosity that produces results — not dependency.",
        "subtitle": (
            "We focus on three pillars that compound: education that opens doors, "
            "maternal stability that protects futures, and livelihoods that replace "
            "aid with agency."
        ),
        "items": [
            {
                "iconKey": "school",
                "title": "Education Access",
                "body": "Uniforms, books, tuition assistance, and sanitary dignity support for vulnerable students.",
            },
            {
                "iconKey": "heart",
                "title": "Maternal Support",
                "body": "Safe housing, healthcare access, and mentorship for young mothers through Grace Bridge.",
            },
            {
                "iconKey": "groups",
                "title": "Livelihood & Community",
                "body": "Vocational training, women's empowerment, and community development workshops.",
            },
        ],
    },
    "graceBridge": {
        "enabled": True,
        "eyebrow": "Our current focus",
        "title": "Grace Bridge Initiative",
        "body": (
            "Grace Bridge supports vulnerable mothers, children, and underserved "
            "families through temporary housing, healthcare access, nutrition, "
            "education sponsorship, skills training, and structured mentorship. "
            "Inspired by the disciplined compassion of Grace Rosado, founder of "
            "New Life Home in Manchester, NH."
        ),
        "cta": {"label": "Explore Grace Bridge", "href": "/programs/grace-bridge", "kind": "link"},
        "overlayText": "Structured compassion, delivered with accountability.",
    },
    "stats": {
        "enabled": True,
        "items": [
            {"value": "15+", "label": "Years of community service in Kenya since 2011"},
            {"value": "2026", "label": "Incorporated in the U.S. (Massachusetts)"},
            {"value": "3", "label": "Active program pillars"},
        ],
    },
    "donationTiers": {
        "enabled": True,
        "eyebrow": "Your impact",
        "title": "What your gift makes possible",
        "items": [
            {
                "amount": 25,
                "title": "Restores Dignity",
                "body": "Can provide 1 girl with a 3-month supply of sanitary pads and essential school supplies to keep her learning with dignity.",
            },
            {
                "amount": 50,
                "title": "Keeps a Child in School",
                "body": "Can help provide a student with school uniform items, shoes, or textbooks to support their learning during the academic term.",
            },
            {
                "amount": 100,
                "title": "Strengthens a Family",
                "body": "Can supply 1 family with a month of nutritious meals and access to basic medical care and housing support.",
            },
        ],
    },
    "featuredCampaigns": {
        "enabled": True,
        "eyebrow": "Fundraising",
        "title": "Active campaigns",
        "subtitle": "Support a specific initiative — every dollar is tracked toward its goal.",
        "limit": 3,
    },
    "quote": {
        "enabled": True,
        "text": (
            "School was my sanctuary. Every day, I walked barefoot over dust and "
            "stones to reach a small classroom… Inside, I could dream."
        ),
        "attributionName": "Adan Muktar",
        "attributionRole": "Founder & Executive Director",
    },
    "ctaBand": {
        "enabled": True,
        "title": "Turn lived experience into structured empowerment.",
        "body": "Your generosity supports education access, maternal stability, and community empowerment across Kenya.",
    },
}


# ---------- Registry ----------

ABOUT_DEFAULTS: dict = {
    "seo": {
        "title": "About NTI",
        "description": (
            "Northern Transformation Initiative — a registered nonprofit "
            "committed to ethical leadership, structured community development, "
            "and measurable impact across Kenya since 2011."
        ),
    },
    "intro": {
        "eyebrow": "About",
        "title": "A registered nonprofit, built for measurable impact.",
        "subtitle": (
            "Founded in Kenya in 2011 and incorporated in the United States in "
            "2026 to broaden fundraising capacity and international partnerships. "
            "Northern Transformation Initiative Inc. is a Massachusetts nonprofit "
            "corporation; federal 501(c)(3) tax-exempt status is pending with the IRS."
        ),
    },
    "mission": {
        "enabled": True,
        "overline": "Mission",
        "statement": (
            "To empower vulnerable communities across Kenya through education, "
            "maternal support, and livelihood development — building dignity, "
            "opportunity, and measurable impact."
        ),
    },
    "historyVision": {
        "enabled": True,
        "history": {
            "title": "Our history",
            "body": (
                "Established on February 10, 2011, with its head office in Nairobi, "
                "Kenya, NTI supports families and youth across Northern Kenya through "
                "livelihood and agricultural programs, educational assistance for "
                "vulnerable students, and women empowerment and youth training workshops."
            ),
        },
        "vision": {
            "title": "Our vision",
            "body": (
                "We believe generosity should produce results — not dependency. NTI "
                "maintains structured planning, budgeting, monitoring, evaluation, "
                "and audit processes to ensure accountability and measurable outcomes."
            ),
        },
    },
    "values": {
        "enabled": True,
        "title": "Values that guide our work",
        "items": [
            {"iconKey": "check", "title": "Integrity", "body": "Stewarding every contribution with transparent reporting."},
            {"iconKey": "shield", "title": "Dignity", "body": "Programs designed to restore agency, not deepen dependency."},
            {"iconKey": "scale", "title": "Accountability", "body": "Structured planning, monitoring, evaluation, and audit."},
            {"iconKey": "heart", "title": "Compassion", "body": "Disciplined generosity — responsive yet sustainable."},
        ],
    },
    "governance": {
        "enabled": True,
        "title": "Registration & governance",
        "subtitle": "NTI is a registered nonprofit operating under Kenyan and U.S. nonprofit regulatory frameworks.",
        "chips": [
            {"label": "Founded in Kenya · Feb 10, 2011", "emphasis": "primary"},
            {"label": "Incorporated in the U.S. · 2026 (Massachusetts)", "emphasis": "primary"},
            {"label": "HQ: Nairobi, Kenya", "emphasis": "default"},
            {"label": "U.S. Office: Boston, MA", "emphasis": "default"},
            {"label": "501(c)(3) status: pending with the IRS", "emphasis": "default"},
        ],
    },
    "ctaBand": {
        "enabled": True,
        "title": "Partner with a transparent, accountable nonprofit.",
        "body": None,
    },
}


LEADERSHIP_DEFAULTS: dict = {
    "seo": {
        "title": "Leadership",
        "description": "Adan Muktar, Founder & Executive Director, and NTI's leadership structure.",
    },
    "intro": {
        "eyebrow": "Leadership",
        "title": "Ethical leadership grounded in lived experience.",
    },
    "featured": {
        "enabled": True,
        "name": "Adan Muktar",
        "role": "Founder & Executive Director \u00b7 Boston, Massachusetts",
        "initials": "AM",
        "photoUrl": None,
        "phoneDisplay": "+1 (646) 991-7016",
        "phoneTel": "+1 (646) 991-7016",
        "paragraphs": [
            "Adan founded Northern Transformation Initiative with a commitment to ethical leadership and structured community development. As the author of Memoirs of a Lost Boy: A Journey of Identity, Adan shares his lived experience of displacement, resilience, and the transformative power of education.",
            "From Boston, MA, Adan oversees U.S. partnerships, fundraising strategy, international collaboration, and program development. His leadership is grounded in first-hand understanding of hardship, a commitment to financial transparency, belief in education as a pathway to independence, and cross-cultural engagement between Africa and the United States.",
        ],
    },
    "voiceBlock": {
        "enabled": True,
        "eyebrow": "A voice born from experience",
        "title": "Lessons translated into structured programs.",
        "intro": (
            "The stories documented in Adan's books are not fiction detached from reality. "
            "They reflect lived experiences of hardship, displacement, institutional instability, "
            "and resilience. NTI transforms those lessons into structured programs that support "
            "vulnerable families, strengthen education systems, provide dignity-centered "
            "assistance, and encourage ethical leadership."
        ),
        "quotes": [
            {
                "text": "School was my sanctuary. Every day, I walked barefoot over dust and stones to reach a small classroom\u2026 Inside, I could dream.",
                "attribution": None,
            },
            {
                "text": "Even in the shadows of fear, sparks of hope persisted. I clung to education as my only escape.",
                "attribution": None,
            },
        ],
    },
    "structure": {
        "enabled": True,
        "title": "Leadership structure",
        "members": [
            {"role": "President & Director", "name": "Abdirahman Muktar"},
            {"role": "Treasurer", "name": "Osman Haji"},
            {"role": "Clerk", "name": "Ismail Jama"},
        ],
    },
}


BOOKS_DEFAULTS: dict = {
    "seo": {
        "title": "Books by Adan Muktar",
        "description": "Books by NTI founder Adan Muktar \u2014 lived testimony of displacement, resilience, and the transformative power of education.",
    },
    "intro": {
        "eyebrow": "Books by Adan Muktar",
        "title": "A voice born from experience.",
        "subtitle": "Adan's writing reflects lived experiences of hardship, displacement, institutional instability, and resilience \u2014 the same lessons NTI translates into structured programs.",
    },
    "books": [
        {
            "title": "Memoirs of a Lost Boy: A Journey of Identity",
            "blurb": "A lived testimony of displacement, resilience, and the transformative power of education.",
            "coverImageUrl": None,
            "ctaLabel": "View on Amazon",
            "ctaUrl": "https://www.amazon.com/MEMOIRS-LOST-BOY-journey-identity-ebook/dp/B0FS69WM9Q",
            "badge": None,
        },
        {
            "title": "The Rebirth of a Nation",
            "blurb": "A reflection on identity, transformation, and the path forward.",
            "coverImageUrl": None,
            "ctaLabel": None,
            "ctaUrl": None,
            "badge": "Coming soon",
        },
    ],
}


PROGRAMS_DEFAULTS: dict = {
    "seo": {
        "title": "Programs",
        "description": "NTI's three program pillars: Education, Livelihood & Empowerment, and Youth & Community Development.",
    },
    "intro": {
        "eyebrow": "Our programs",
        "title": "Three pillars. One disciplined approach.",
        "subtitle": "Every program is designed to compound: education opens doors, livelihoods replace aid with agency, and community development sustains the gains.",
    },
    "pillars": {
        "enabled": True,
        "items": [
            {
                "slug": "education",
                "title": "Education Support",
                "summary": "School uniforms and books, tuition assistance, sanitary dignity support for girls, and youth mentorship workshops.",
                "bullets": [
                    "School uniforms and books",
                    "Tuition assistance",
                    "Sanitary dignity support for girls",
                    "Youth mentorship and leadership workshops",
                ],
                "iconKey": "school",
            },
            {
                "slug": "livelihood",
                "title": "Livelihood & Empowerment",
                "summary": "Vocational skills, agricultural support, small enterprise development, and women capacity-building.",
                "bullets": [
                    "Vocational skills training",
                    "Agricultural support",
                    "Small enterprise development",
                    "Women capacity-building initiatives",
                ],
                "iconKey": "build",
            },
            {
                "slug": "youth",
                "title": "Youth & Community Development",
                "summary": "Leadership development, behavioral change communication, peace-building, and community workshops.",
                "bullets": [
                    "Leadership development",
                    "Behavioral change communication",
                    "Peace-building initiatives",
                    "Community-based workshops",
                ],
                "iconKey": "groups",
            },
        ],
    },
    "currentFocus": {
        "enabled": True,
        "title": "Current focus: Grace Bridge Initiative",
        "body": (
            "Grace Bridge is NTI's active humanitarian project supporting vulnerable mothers, "
            "children, and underserved families with housing, healthcare, nutrition, education "
            "sponsorship, sanitary dignity, skills training, and structured mentorship."
        ),
        "ctaHref": "/programs/grace-bridge",
        "ctaLabel": "Explore Grace Bridge",
    },
    "ctaBand": {
        "enabled": True,
        "title": "Help us sustain these programs.",
        "body": None,
    },
}


# ---------- Grace Bridge ----------


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


# ---------- The Problem ----------


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


# ---------- Our Solution ----------


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


# ---------- Impact & Transparency ----------


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


# ---------- Get Involved ----------


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


# ---------- Site-wide layout (header + footer) ----------


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
    keAddress: str  # multi-line allowed (\n)


class LayoutFooter(BaseModel):
    brandName: str
    brandBlurb: str
    columns: list[LayoutFooterColumn]
    contact: LayoutFooterContact
    legalDisclosure: str
    copyright: str  # supports {year} placeholder
    bottomLinks: list[LayoutFooterLink]


class LayoutContent(BaseModel):
    nav: LayoutNav
    footer: LayoutFooter


GRACE_BRIDGE_DEFAULTS: dict = {
    "seo": {
        "title": "Grace Bridge Initiative",
        "description": "NTI's flagship program supporting vulnerable young mothers in Kenya through safe housing, healthcare, nutrition, skills training, and reintegration.",
    },
    "hero": {
        "overline": "Our current focus",
        "title": "Grace Bridge Initiative",
        "subhead": "Structured compassion for vulnerable young mothers and underserved families in Kenya — practical solutions designed to restore stability and long-term opportunity.",
        "backgroundImageUrl": None,
    },
    "inspiredBy": {
        "enabled": True,
        "title": "Inspired by Grace Rosado",
        "body": (
            "Grace Bridge Initiative is inspired by Grace Rosado, founder of New Life Home in "
            "Manchester, New Hampshire. Grace has devoted years of her life to serving vulnerable "
            "families with humility, consistency, and integrity. Her leadership reflects "
            "disciplined compassion — generosity paired with responsibility and accountability. "
            "Her work reminds us that authentic service is not about recognition; it is about "
            "impact. Grace Bridge carries that same spirit forward."
        ),
    },
    "pillars": {
        "enabled": True,
        "title": "What we provide",
        "items": [
            {"iconKey": "home", "title": "Safe Housing", "body": "Temporary, dignified housing assistance for young mothers."},
            {"iconKey": "hospital", "title": "Healthcare Access", "body": "Connection to maternal and primary health services."},
            {"iconKey": "nutrition", "title": "Nutrition Support", "body": "Food and nutrition for mothers and their children."},
            {"iconKey": "school", "title": "Education Sponsorship", "body": "Books, uniforms, and tuition assistance to keep children in school."},
            {"iconKey": "shield", "title": "Sanitary Dignity", "body": "Sanitary dignity programs so schoolgirls never miss class."},
            {"iconKey": "build", "title": "Skills Training", "body": "Vocational and entrepreneurial training toward independence."},
            {"iconKey": "groups", "title": "Reintegration", "body": "Structured mentorship and family reintegration support."},
        ],
    },
    "footerCtas": {
        "enabled": True,
        "buttons": [
            {"label": "Understand the problem", "href": "/programs/grace-bridge/problem", "variant": "outlined"},
            {"label": "See our solution", "href": "/programs/grace-bridge/solution", "variant": "contained"},
        ],
    },
    "ctaBand": {
        "enabled": True,
        "title": "Support a young mother today.",
        "body": "Every gift contributes to housing, healthcare, nutrition, and skills training.",
    },
}


THE_PROBLEM_DEFAULTS: dict = {
    "seo": {
        "title": "The Problem",
        "description": "Teen pregnancy, poverty, and housing insecurity in Kenya — and why structured support is essential.",
    },
    "intro": {
        "eyebrow": "Grace Bridge · The Problem",
        "title": "The challenges we exist to address.",
    },
    "issues": {
        "enabled": True,
        "items": [
            {
                "title": "Teen pregnancy in Kenya",
                "body": "Adolescent mothers face interrupted education, social stigma, and limited access to maternal care — often leaving them without the support systems they need to recover and thrive.",
            },
            {
                "title": "Poverty challenges",
                "body": "Households living below the poverty line struggle to provide food, school supplies, and medical care — pressures that fall hardest on young women and children.",
            },
            {
                "title": "Housing insecurity",
                "body": "Many young mothers face abandonment or unsafe living conditions, leaving them and their children exposed to exploitation and instability.",
            },
            {
                "title": "Need for structured support",
                "body": "Ad hoc help rarely changes long-term trajectories. Sustainable transformation requires structured housing, healthcare, education, and mentorship working in concert.",
            },
        ],
    },
    "ctaBand": {
        "enabled": True,
        "title": "A structured response begins with structured support.",
        "body": None,
    },
}


OUR_SOLUTION_DEFAULTS: dict = {
    "seo": {
        "title": "Our Solution",
        "description": "Grace Bridge's five-pillar response: housing, healthcare, nutrition, skills training, and reintegration.",
    },
    "intro": {
        "eyebrow": "Grace Bridge · Our Solution",
        "title": "Five pillars working together.",
        "subtitle": "Each pillar reinforces the others. Housing without healthcare is fragile. Skills without nutrition stall. We deliver them together — and stay through reintegration.",
    },
    "pillars": {
        "enabled": True,
        "items": [
            {"iconKey": "home", "title": "Safe Housing", "body": "Temporary, dignified housing assistance for young mothers in crisis."},
            {"iconKey": "hospital", "title": "Healthcare Access", "body": "Connecting mothers and children to maternal and primary health services."},
            {"iconKey": "nutrition", "title": "Nutrition", "body": "Food and nutrition support for vulnerable mothers and their children."},
            {"iconKey": "build", "title": "Skills Training", "body": "Vocational and entrepreneurial training that builds toward independence."},
            {"iconKey": "groups", "title": "Reintegration Support", "body": "Structured mentorship and family reintegration so progress is sustained."},
        ],
    },
    "ctaBand": {
        "enabled": True,
        "title": "Sponsor a mother. Sustain a family.",
        "body": None,
    },
}


IMPACT_DEFAULTS: dict = {
    "seo": {
        "title": "Impact & Transparency",
        "description": "Annual reports, financial summary, and compliance documents from NTI.",
    },
    "intro": {
        "eyebrow": "Impact & Transparency",
        "title": "Measurable outcomes. Open books.",
        "subtitle": "NTI follows structured financial oversight, project evaluation systems, and accountability standards. Documents below will be published as audits and reports complete.",
    },
    "stats": {
        "enabled": True,
        "items": [
            {"value": "15+", "label": "Years of community service in Kenya since 2011"},
            {"value": "2026", "label": "Incorporated in the U.S. (Massachusetts)"},
            {"value": "3", "label": "Active program pillars"},
        ],
    },
    "documents": {
        "enabled": True,
        "title": "Documents",
        "items": [
            {"title": "Annual Report", "status": "coming-soon", "fileUrl": None, "year": None},
            {"title": "Financial Summary", "status": "coming-soon", "fileUrl": None, "year": None},
            {"title": "Compliance & Registration Certificates", "status": "coming-soon", "fileUrl": None, "year": None},
        ],
    },
    "whyGiftMatters": {
        "enabled": True,
        "title": "Why your gift matters",
        "body": "The stories documented in Adan's books are not fiction detached from reality. They reflect lived experiences of hardship, displacement, and resilience. Today, NTI works to ensure that vulnerable children and families are not defined by conflict or poverty — but by opportunity, dignity, and access to education.",
    },
    "ctaBand": {
        "enabled": True,
        "title": "Help us publish the next chapter of impact.",
        "body": None,
    },
}


GET_INVOLVED_DEFAULTS: dict = {
    "seo": {
        "title": "Get Involved",
        "description": "Donate, partner, or volunteer with NTI.",
    },
    "intro": {
        "eyebrow": "Get involved",
        "title": "Three ways to make a measurable difference.",
        "align": "center",
    },
    "options": {
        "enabled": True,
        "items": [
            {
                "iconKey": "favorite",
                "title": "Donate",
                "body": "One-time gifts, monthly partnerships, or sponsor a student. Every contribution is stewarded responsibly toward measurable outcomes.",
                "ctaLabel": "Give now",
                "ctaHref": "/donate",
                "ctaColor": "secondary",
            },
            {
                "iconKey": "handshake",
                "title": "Partner",
                "body": "Corporate and church partnerships expand our reach. Reach out to explore co-branded initiatives, matching programs, or mission trips.",
                "ctaLabel": "Start a conversation",
                "ctaHref": "/contact",
                "ctaColor": "primary",
            },
            {
                "iconKey": "heart",
                "title": "Volunteer",
                "body": "Lend professional skills — mentorship, training, content, finance, design — remotely or in-country in Kenya.",
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
                    {"label": "Our Story", "to": "/about"},
                    {"label": "Leadership", "to": "/about/leadership"},
                    {"label": "Books", "to": "/about/books"},
                ],
            },
            {
                "label": "Programs",
                "to": "/programs",
                "children": [
                    {"label": "All Programs", "to": "/programs"},
                    {"label": "Grace Bridge Initiative", "to": "/programs/grace-bridge"},
                    {"label": "The Problem", "to": "/programs/grace-bridge/problem"},
                    {"label": "Our Solution", "to": "/programs/grace-bridge/solution"},
                ],
            },
            {"label": "Impact", "to": "/impact", "children": []},
            {"label": "Campaigns", "to": "/campaigns", "children": []},
            {"label": "Get Involved", "to": "/get-involved", "children": []},
            {"label": "Contact", "to": "/contact", "children": []},
        ],
    },
    "footer": {
        "brandName": "Northern Transformation Initiative",
        "brandBlurb": "Restoring dignity and expanding opportunity through education, maternal support, and livelihood programs across Kenya.",
        "columns": [
            {
                "heading": "Explore",
                "links": [
                    {"label": "About", "to": "/about"},
                    {"label": "Programs", "to": "/programs"},
                    {"label": "Grace Bridge", "to": "/programs/grace-bridge"},
                    {"label": "Impact", "to": "/impact"},
                ],
            },
            {
                "heading": "Engage",
                "links": [
                    {"label": "Donate", "to": "/donate"},
                    {"label": "Campaigns", "to": "/campaigns"},
                    {"label": "Get Involved", "to": "/get-involved"},
                    {"label": "Contact", "to": "/contact"},
                    {"label": "Books", "to": "/about/books"},
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
            "corporation (2026). Federal 501(c)(3) tax-exempt status is pending with "
            "the IRS. Contributions are not yet tax-deductible until that determination "
            "is received."
        ),
        "copyright": "© {year} Northern Transformation Initiative. All rights reserved.",
        "bottomLinks": [
            {"label": "Privacy", "to": "/privacy"},
            {"label": "Terms", "to": "/terms"},
        ],
    },
}


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
