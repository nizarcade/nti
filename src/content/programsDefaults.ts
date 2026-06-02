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
      "NTI's three program pillars: Education, Livelihood & Empowerment, and Youth & Community Development.",
  },
  intro: {
    eyebrow: "Our programs",
    title: "Three pillars. One disciplined approach.",
    subtitle:
      "Every program is designed to compound: education opens doors, livelihoods replace aid with agency, and community development sustains the gains.",
  },
  pillars: {
    enabled: true,
    items: [
      {
        slug: "education",
        title: "Education Support",
        summary:
          "School uniforms and books, tuition assistance, sanitary dignity support for girls, and youth mentorship workshops.",
        bullets: [
          "School uniforms and books",
          "Tuition assistance",
          "Sanitary dignity support for girls",
          "Youth mentorship and leadership workshops",
        ],
        iconKey: "school",
        linkHref: null,
        linkLabel: null,
      },
      {
        slug: "livelihood",
        title: "Livelihood & Empowerment",
        summary:
          "Vocational skills, agricultural support, small enterprise development, and women capacity-building.",
        bullets: [
          "Vocational skills training",
          "Agricultural support",
          "Small enterprise development",
          "Women capacity-building initiatives",
        ],
        iconKey: "build",
        linkHref: null,
        linkLabel: null,
      },
      {
        slug: "youth",
        title: "Youth & Community Development",
        summary:
          "Leadership development, behavioral change communication, peace-building, and community workshops.",
        bullets: [
          "Leadership development",
          "Behavioral change communication",
          "Peace-building initiatives",
          "Community-based workshops",
        ],
        iconKey: "groups",
        linkHref: null,
        linkLabel: null,
      },
    ],
  },
  currentFocus: {
    enabled: true,
    title: "Current focus: Grace Bridge Initiative",
    body:
      "Grace Bridge is NTI's active humanitarian project supporting vulnerable mothers, children, and underserved families with housing, healthcare, nutrition, education sponsorship, sanitary dignity, skills training, and structured mentorship.",
    ctaHref: "/programs/grace-bridge",
    ctaLabel: "Explore Grace Bridge",
  },
  ctaBand: {
    enabled: true,
    title: "Help us sustain these programs.",
    body: null,
  },
};
