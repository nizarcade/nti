export type GBPillar = {
  iconKey: string;
  title: string;
  body: string;
};

export type GBFooterCtaButton = {
  label: string;
  href: string;
  variant: "outlined" | "contained";
};

export type GraceBridgeContent = {
  seo: {
    title: string;
    description: string;
  };

  hero: {
    overline: string;
    title: string;
    subhead: string;
    backgroundImageUrl: string | null;
  };

  inspiredBy: {
    enabled: boolean;
    title: string;
    body: string;
  };

  pillars: {
    enabled: boolean;
    title: string;
    items: GBPillar[];
  };

  footerCtas: {
    enabled: boolean;
    buttons: GBFooterCtaButton[];
  };

  ctaBand: {
    enabled: boolean;
    title: string;
    body: string | null;
  };
};

export const graceBridgeDefaults: GraceBridgeContent = {
  seo: {
    title: "Bright Futures Kenya",
    description:
      "Bright Futures Kenya is NTI's child-focused residential education, protection, and development program for vulnerable children ages 6–10 in Kenya.",
  },

  hero: {
    overline: "Our current focus",
    title: "Bright Futures Kenya",
    subhead:
      "A child-focused residential education, protection, and development program designed to provide vulnerable children ages 6–10 with safety, stability, education, care, and opportunity.",
    backgroundImageUrl: null,
  },

  /*
   * This section remains in the schema for compatibility with the existing
   * page and CMS, but is disabled because the former Grace Bridge
   * inspiration content is not part of Bright Futures Kenya.
   */
  inspiredBy: {
    enabled: false,
    title: "",
    body: "",
  },

  pillars: {
    enabled: true,
    title: "What Bright Futures Kenya provides",
    items: [
      {
        iconKey: "home",
        title: "Safe Residential Care",
        body:
          "A safe and stable residential environment for vulnerable children who need consistent care and protection.",
      },
      {
        iconKey: "school",
        title: "Education Access",
        body:
          "School access and transportation, uniforms, learning materials, tutoring, and homework support.",
      },
      {
        iconKey: "nutrition",
        title: "Nutrition Support",
        body:
          "Nutritious meals and consistent food support to promote children's health, growth, and ability to learn.",
      },
      {
        iconKey: "hospital",
        title: "Health & Dental Support",
        body:
          "Access to appropriate health and dental support as part of each child's overall care and development.",
      },
      {
        iconKey: "shield",
        title: "Child Protection & Safeguarding",
        body:
          "Structured safeguarding and child-protection practices designed to provide a secure and supportive environment.",
      },
      {
        iconKey: "groups",
        title: "Child Development",
        body:
          "Recreation, structured activities, guidance, and development support that help children grow socially and emotionally.",
      },
      {
        iconKey: "build",
        title: "Referrals & Documentation Support",
        body:
          "Referral and documentation support to help address essential needs affecting a child's care, protection, and access to services.",
      },
    ],
  },

  footerCtas: {
    enabled: true,
    buttons: [
      {
        label: "Understand the need",
        href: "/programs/bright-futures-kenya/the-need",
        variant: "outlined",
      },
      {
        label: "See our solution",
        href: "/programs/bright-futures-kenya/our-solution",
        variant: "contained",
      },
    ],
  },

  ctaBand: {
    enabled: true,
    title: "Help build brighter futures for vulnerable children.",
    body:
      "Your support helps advance safe care, education, nutrition, health, protection, and development through Bright Futures Kenya.",
  },
};
