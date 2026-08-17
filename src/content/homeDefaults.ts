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

  /*
   * Internal legacy key retained for compatibility with existing
   * components/API. Public-facing content is Bright Futures Kenya.
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
      "Northern Transformation Initiative (NTI) expands opportunity for vulnerable children in Kenya through safe care, education, nutrition, health, protection, and long-term development.",
  },

  hero: {
    enabled: true,
    overline: "Founded in Kenya · 2011  |  U.S. 501(c)(3) Public Charity",
    headline:
      "Protecting Children.\nExpanding Opportunity.\nBuilding Brighter Futures.",
    subhead:
      "Northern Transformation Initiative creates safe, stable pathways for vulnerable children in Kenya to learn, grow, and thrive through education, protection, nutrition, health support, and structured care.",
    primaryCta: {
      label: "Donate",
      href: "/donate",
      kind: "donate",
    },
    secondaryCta: {
      label: "Explore Bright Futures Kenya",
      href: "/programs/bright-futures-kenya",
      kind: "link",
    },
    tertiaryCta: {
      label: "Learn About NTI",
      href: "/about",
      kind: "link",
    },
  },

  pillars: {
    enabled: true,
    eyebrow: "Our approach",
    title: "Every child deserves safety, education, and the opportunity to thrive.",
    subtitle:
      "We address the interconnected barriers that place vulnerable children at risk by combining safe care, consistent education, health and nutrition support, and child-centered development.",
    items: [
      {
        iconKey: "home",
        title: "Safe Care & Protection",
        body:
          "A stable, protective environment where vulnerable children can live with dignity, security, consistent care, and strong safeguarding.",
      },
      {
        iconKey: "school",
        title: "Education & Learning",
        body:
          "School access, transportation, uniforms, learning materials, tutoring, and homework support that help children remain engaged and progress academically.",
      },
      {
        iconKey: "heart",
        title: "Health & Development",
        body:
          "Nutritious meals, clothing and hygiene essentials, health and dental support, recreation, mentorship, and opportunities for healthy childhood development.",
      },
    ],
  },

  graceBridge: {
    enabled: true,
    eyebrow: "Our flagship initiative",
    title: "Bright Futures Kenya",
    body:
      "Bright Futures Kenya is NTI's child-focused residential education, protection, and development initiative for vulnerable children ages 6–10 in Kenya. The program is designed to provide safe care, school access, nutritious meals, health support, safeguarding, tutoring, recreation, and the stability children need to build stronger futures.",
    cta: {
      label: "Explore Bright Futures Kenya",
      href: "/programs/bright-futures-kenya",
      kind: "link",
    },
    overlayText:
      "A safe place to live. A real chance to learn. A brighter future.",
  },

  stats: {
    enabled: true,
    items: [
      {
        value: "2011",
        label: "NTI founded in Kenya",
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
    title: "Help create the conditions every child needs to thrive",
    items: [
      {
        amount: 25,
        title: "Support Daily Essentials",
        body:
          "Helps provide essential learning, hygiene, clothing, or nutrition needs for children supported through NTI programs.",
      },
      {
        amount: 50,
        title: "Strengthen a Child's Education",
        body:
          "Helps provide school supplies, learning materials, transportation, tutoring, and other educational support that keeps a child connected to learning.",
      },
      {
        amount: 100,
        title: "Invest in Safe, Stable Care",
        body:
          "Helps support the combined costs of safe care, nutritious meals, education, health needs, safeguarding, and child development.",
      },
    ],
  },

  featuredCampaigns: {
    enabled: true,
    eyebrow: "Take action",
    title: "Support our current campaigns",
    subtitle:
      "Fund practical, accountable programs that protect vulnerable children and expand their opportunities for the future.",
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
    title: "Help give a child the foundation for a brighter future.",
    body:
      "Your support helps provide vulnerable children with safety, education, nutrition, health support, protection, and opportunities to grow.",
  },
};
