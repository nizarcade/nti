/**
 * Default home-page content. Mirrors the API's HOME_DEFAULTS so the public
 * site renders identically before the backend responds or if it errors out.
 * The CMS-managed source of truth lives in api/app/page_schemas.py.
 */

export type Cta = { label: string; href: string; kind: "link" | "donate" };
export type StatItem = { value: string; label: string };
export type TierItem = { amount: number; title: string; body: string };
export type PillarItem = { iconKey: string; title: string; body: string };

export type HomeContent = {
  seo: { title: string; description: string };

  hero: {
    enabled: boolean;
    overline: string;
    headline: string;
    subhead: string;
    primaryCta: Cta;
    secondaryCta?: Cta | null;
    tertiaryCta?: Cta | null;
    backgroundImageUrl?: string | null;
  };

  pillars: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    items: PillarItem[];
  };

  /*
   * Legacy internal key retained for compatibility with the existing
   * frontend and CMS. Public-facing content is Bright Futures Kenya.
   */
  graceBridge: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    body: string;
    cta: Cta;
    imageUrl?: string | null;
    overlayText?: string | null;
  };

  stats: {
    enabled: boolean;
    items: StatItem[];
  };

  donationTiers: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    items: TierItem[];
  };

  featuredCampaigns: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    limit: number;
  };

  quote: {
    enabled: boolean;
    text: string;
    attributionName: string;
    attributionRole: string;
  };

  ctaBand: {
    enabled: boolean;
    title: string;
    body?: string | null;
  };
};

export const homeDefaults: HomeContent = {
  seo: {
    title: "Home",
    description:
      "Northern Transformation Initiative (NTI) — restoring dignity and expanding opportunity for vulnerable children through education, protection, safe care, health, nutrition, and development in Kenya.",
  },

  hero: {
    enabled: true,
    overline: "Founded in Kenya · 2011  |  Incorporated in the U.S. · 2026",
    headline:
      "Restoring Dignity.\nExpanding Opportunity.\nDelivering Measurable Impact.",
    subhead:
      "NTI strengthens the futures of vulnerable children in Kenya through education access, safe care, child protection, nutrition, health support, and structured development programs — with integrity, transparency, and measurable impact.",
    primaryCta: {
      label: "Donate",
      href: "/donate",
      kind: "donate",
    },
    secondaryCta: {
      label: "Learn About Bright Futures Kenya",
      href: "/programs/bright-futures-kenya",
      kind: "link",
    },
    tertiaryCta: {
      label: "Learn More",
      href: "/about",
      kind: "link",
    },
  },

  pillars: {
    enabled: true,
    eyebrow: "Our mission",
    title: "Generosity that produces results — not dependency.",
    subtitle:
      "We focus on the foundations children need to thrive: protection and safe care, consistent access to education, and the health, nutrition, and development support that strengthens their future.",
    items: [
      {
        iconKey: "shield",
        title: "Safe Care & Protection",
        body:
          "Safe residential care, safeguarding, clothing, hygiene, and structured support for vulnerable children.",
      },
      {
        iconKey: "school",
        title: "Education Access",
        body:
          "School access, transportation, uniforms, learning materials, tutoring, and homework support.",
      },
      {
        iconKey: "heart",
        title: "Health & Development",
        body:
          "Nutritious meals, health and dental support, recreation, mentorship, and opportunities for healthy child development.",
      },
    ],
  },

  graceBridge: {
    enabled: true,
    eyebrow: "Our current focus",
    title: "Bright Futures Kenya",
    body:
      "Bright Futures Kenya is NTI's child-focused residential education, protection, and development program for vulnerable children ages 6–10 in Kenya. The program provides safe residential care, school access and transportation, tutoring and homework support, nutritious meals, clothing and hygiene support, health and dental care, safeguarding, referrals, recreation, and child development.",
    cta: {
      label: "Explore Bright Futures Kenya",
      href: "/programs/bright-futures-kenya",
      kind: "link",
    },
    overlayText:
      "Structured care, education, and protection for vulnerable children.",
  },

  stats: {
    enabled: true,
    items: [
      {
        value: "15+",
        label: "Years of community service in Kenya since 2011",
      },
      {
        value: "6–10",
        label: "Ages served by Bright Futures Kenya",
      },
      {
        value: "501(c)(3)",
        label: "IRS-recognized U.S. public charity",
      },
    ],
  },

  donationTiers: {
    enabled: true,
    eyebrow: "Your impact",
    title: "What your gift makes possible",
    items: [
      {
        amount: 25,
        title: "Supports Essential Needs",
        body:
          "Helps support essential needs such as nutritious meals, clothing, hygiene supplies, and learning materials for vulnerable children.",
      },
      {
        amount: 50,
        title: "Supports Education",
        body:
          "Helps support school access, transportation, uniforms, learning materials, tutoring, and homework support.",
      },
      {
        amount: 100,
        title: "Supports Safe Care",
        body:
          "Helps support the safe residential care, health, nutrition, protection, and development services children need to thrive.",
      },
    ],
  },

  featuredCampaigns: {
    enabled: true,
    eyebrow: "Fundraising",
    title: "Active campaigns",
    subtitle:
      "Support a specific initiative — every dollar is tracked toward its goal.",
    limit: 3,
  },

  quote: {
    enabled: true,
    text:
      "School was my sanctuary. Every day, I walked barefoot over dust and stones to reach a small classroom… Inside, I could dream.",
    attributionName: "Adan Muktar",
    attributionRole: "Founder & Executive Director",
  },

  ctaBand: {
    enabled: true,
    title: "Turn lived experience into structured empowerment.",
    body:
      "Your generosity supports safe care, education, protection, health, nutrition, and development for vulnerable children in Kenya.",
  },
};
