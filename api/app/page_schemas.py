/**
 * Default home-page content. Mirrors the API's HOME_DEFAULTS so the public
 * site renders identically before the backend responds or if it errors out.
 * The CMS-managed source of truth lives in api/app/page_schemas.py.
 */

export type Cta = {
  label: string;
  href: string;
  kind: "link" | "donate";
};

export type StatItem = {
  value: string;
  label: string;
};

export type TierItem = {
  amount: number;
  title: string;
  body: string;
};

export type PillarItem = {
  iconKey: string;
  title: string;
  body: string;
};

export type HomeContent = {
  seo: {
    title: string;
    description: string;
  };

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
      "Northern Transformation Initiative (NTI) — restoring dignity and expanding opportunity through education, maternal support, and livelihoods across Kenya.",
  },

  hero: {
    enabled: true,
    overline: "Founded in Kenya · 2011  |  Incorporated in the U.S. · 2026",
    headline:
      "Restoring Dignity.\nExpanding Opportunity.\nDelivering Measurable Impact.",
    subhead:
      "NTI strengthens vulnerable communities across Kenya through education access, maternal support, livelihood development, and structured humanitarian programs — with integrity, transparency, and measurable impact.",
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
      "We focus on three pillars that compound: education that opens doors, maternal stability that protects futures, and livelihoods that replace aid with agency.",
    items: [
      {
        iconKey: "school",
        title: "Education Access",
        body:
          "Uniforms, books, tuition assistance, and sanitary dignity support for vulnerable students.",
      },
      {
        iconKey: "heart",
        title: "Maternal Support",
        body:
          "Safe housing, healthcare access, and mentorship for young mothers through Bright Futures Kenya.",
      },
      {
        iconKey: "groups",
        title: "Livelihood & Community",
        body:
          "Vocational training, women's empowerment, and community development workshops.",
      },
    ],
  },

  graceBridge: {
    enabled: true,
    eyebrow: "Our current focus",
    title: "Bright Futures Kenya",
    body:
      "Bright Futures Kenya supports vulnerable mothers, children, and underserved families through temporary housing, healthcare access, nutrition, education sponsorship, skills training, and structured mentorship. Inspired by the disciplined compassion of Grace Rosado, founder of New Life Home in Manchester, NH.",
    cta: {
      label: "Explore Bright Futures Kenya",
      href: "/programs/bright-futures-kenya",
      kind: "link",
    },
    overlayText:
      "Structured compassion, delivered with accountability.",
  },

  stats: {
    enabled: true,
    items: [
      {
        value: "15+",
        label: "Years of community service in Kenya since 2011",
      },
      {
        value: "2026",
        label: "Incorporated in the U.S. (Massachusetts)",
      },
      {
        value: "3",
        label: "Active program pillars",
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
        title: "Restores Dignity",
        body:
          "Can provide 1 girl with a 3-month supply of sanitary pads and essential school supplies to keep her learning with dignity.",
      },
      {
        amount: 50,
        title: "Keeps a Child in School",
        body:
          "Can help provide a student with school uniform items, shoes, or textbooks to support their learning during the academic term.",
      },
      {
        amount: 100,
        title: "Strengthens a Family",
        body:
          "Can supply 1 family with a month of nutritious meals and access to basic medical care and housing support.",
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
      "Your generosity supports education access, maternal stability, and community empowerment across Kenya.",
  },
};
