export type OSPillar = {
  iconKey: string;
  title: string;
  body: string;
};

export type OurSolutionContent = {
  seo: {
    title: string;
    description: string;
  };
  intro: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  pillars: {
    enabled: boolean;
    items: OSPillar[];
  };
  ctaBand: {
    enabled: boolean;
    title: string;
    body: string | null;
  };
};

export const ourSolutionDefaults: OurSolutionContent = {
  seo: {
    title: "Our Solution",
    description:
      "Bright Futures Kenya provides vulnerable children with safe residential care, education, nutrition, health support, safeguarding, and child development.",
  },

  intro: {
    eyebrow: "Bright Futures Kenya · Our Solution",
    title: "A comprehensive model of care and opportunity.",
    subtitle:
      "Bright Futures Kenya brings together the essential services vulnerable children need in one structured model — safe residential care, education, nutrition, health support, safeguarding, and child development.",
  },

  pillars: {
    enabled: true,
    items: [
      {
        iconKey: "home",
        title: "Safe Residential Care",
        body:
          "A safe and stable residential environment where vulnerable children can receive consistent care and protection.",
      },
      {
        iconKey: "school",
        title: "Education & Learning Support",
        body:
          "School access and transportation, uniforms, learning materials, tutoring, and homework support.",
      },
      {
        iconKey: "nutrition",
        title: "Nutrition & Essential Needs",
        body:
          "Nutritious meals, clothing, hygiene supplies, and other essentials that support children's health, dignity, and ability to learn.",
      },
      {
        iconKey: "hospital",
        title: "Health & Dental Support",
        body:
          "Access to health and dental support as part of each child's overall care and wellbeing.",
      },
      {
        iconKey: "shield",
        title: "Protection & Safeguarding",
        body:
          "Child-centered safeguarding, referrals, documentation support, and structured protection for children at risk.",
      },
      {
        iconKey: "groups",
        title: "Child Development",
        body:
          "Recreation, structured activities, guidance, and development support that help children grow socially and emotionally.",
      },
    ],
  },

  ctaBand: {
    enabled: true,
    title: "Help build brighter futures for vulnerable children.",
    body:
      "Your support helps provide the safe care, education, nutrition, health, protection, and development children need to thrive.",
  },
};
