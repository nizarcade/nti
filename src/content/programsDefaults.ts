export type ProgramPillar = {
  slug: string;
  title: string;
  summary: string;
  bullets: string[];
  iconKey: string | null;
  linkHref: string | null;
  linkLabel: string | null;
};

export type ProgramsContent = {
  seo: { title: string; description: string };
  intro: { eyebrow: string; title: string; subtitle: string };
  pillars: { enabled: boolean; items: ProgramPillar[] };
  currentFocus: {
    enabled: boolean;
    title: string;
    body: string;
    ctaHref: string | null;
    ctaLabel: string | null;
  };
  ctaBand: { enabled: boolean; title: string; body: string | null };
};

export const programsDefaults: ProgramsContent = {
  seo: {
    title: "Programs",
    description:
      "NTI supports vulnerable children in Kenya through safe residential care, education, protection, health, nutrition, and child development.",
  },

  intro: {
    eyebrow: "Our programs",
    title: "Protecting children. Expanding opportunity.",
    subtitle:
      "Our work addresses the interconnected needs of vulnerable children by combining safe care, education, protection, health and nutrition support, and opportunities for healthy development.",
  },

  pillars: {
    enabled: true,
    items: [
      {
        slug: "safe-care",
        title: "Safe Care & Protection",
        summary:
          "Safe residential care, safeguarding, clothing, hygiene support, referrals, and structured protection for vulnerable children.",
        bullets: [
          "Safe residential care",
          "Child safeguarding and protection",
          "Clothing and hygiene support",
          "Referrals and documentation support",
        ],
        iconKey: "shield",
        linkHref: null,
        linkLabel: null,
      },

      {
        slug: "education",
        title: "Education & Learning",
        summary:
          "Consistent access to school, transportation, learning materials, tutoring, and homework support.",
        bullets: [
          "School access and transportation",
          "Uniforms and learning materials",
          "Tutoring and homework support",
          "Consistent educational support",
        ],
        iconKey: "school",
        linkHref: null,
        linkLabel: null,
      },

      {
        slug: "health-development",
        title: "Health, Nutrition & Development",
        summary:
          "Nutritious meals, health and dental support, recreation, and structured opportunities for healthy child development.",
        bullets: [
          "Nutritious meals",
          "Health and dental support",
          "Recreation and play",
          "Child development support",
        ],
        iconKey: "heart",
        linkHref: null,
        linkLabel: null,
      },
    ],
  },

  currentFocus: {
    enabled: true,
    title: "Current focus: Bright Futures Kenya",
    body:
      "Bright Futures Kenya is NTI's child-focused residential education, protection, and development program for vulnerable children ages 6–10 in Kenya. The program brings safe care, school access, nutrition, health support, safeguarding, tutoring, recreation, and child development together in one structured model.",
    ctaHref: "/programs/bright-futures-kenya",
    ctaLabel: "Explore Bright Futures Kenya",
  },

  ctaBand: {
    enabled: true,
    title: "Help us sustain these programs.",
    body: null,
  },
};
