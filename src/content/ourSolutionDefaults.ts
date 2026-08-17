export type OSPillar = { iconKey: string; title: string; body: string };

export type OurSolutionContent = {
  seo: { title: string; description: string };
  intro: { eyebrow: string; title: string; subtitle: string };
  pillars: { enabled: boolean; items: OSPillar[] };
  ctaBand: { enabled: boolean; title: string; body: string | null };
};

export const ourSolutionDefaults: OurSolutionContent = {
  seo: {
    title: "Our Solution",
    description:
      "Bright Futures Kenya's five-pillar response: housing, healthcare, nutrition, skills training, and reintegration.",
  },
  intro: {
    eyebrow: "Bright Futures Kenya · Our Solution",
    title: "Five pillars working together.",
    subtitle:
      "Each pillar reinforces the others. Housing without healthcare is fragile. Skills without nutrition stall. We deliver them together — and stay through reintegration.",
  },
  pillars: {
    enabled: true,
    items: [
      {
        iconKey: "home",
        title: "Safe Housing",
        body: "Temporary, dignified housing assistance for young mothers in crisis.",
      },
      {
        iconKey: "hospital",
        title: "Healthcare Access",
        body: "Connecting mothers and children to maternal and primary health services.",
      },
      {
        iconKey: "nutrition",
        title: "Nutrition",
        body: "Food and nutrition support for vulnerable mothers and their children.",
      },
      {
        iconKey: "build",
        title: "Skills Training",
        body: "Vocational and entrepreneurial training that builds toward independence.",
      },
      {
        iconKey: "groups",
        title: "Reintegration Support",
        body: "Structured mentorship and family reintegration so progress is sustained.",
      },
    ],
  },
  ctaBand: {
    enabled: true,
    title: "Sponsor a mother. Sustain a family.",
    body: null,
  },
};
