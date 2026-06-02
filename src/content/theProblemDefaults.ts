export type TPIssue = { title: string; body: string };

export type TheProblemContent = {
  seo: { title: string; description: string };
  intro: { eyebrow: string; title: string };
  issues: { enabled: boolean; items: TPIssue[] };
  ctaBand: { enabled: boolean; title: string; body: string | null };
};

export const theProblemDefaults: TheProblemContent = {
  seo: {
    title: "The Problem",
    description:
      "Teen pregnancy, poverty, and housing insecurity in Kenya — and why structured support is essential.",
  },
  intro: {
    eyebrow: "Grace Bridge · The Problem",
    title: "The challenges we exist to address.",
  },
  issues: {
    enabled: true,
    items: [
      {
        title: "Teen pregnancy in Kenya",
        body: "Adolescent mothers face interrupted education, social stigma, and limited access to maternal care — often leaving them without the support systems they need to recover and thrive.",
      },
      {
        title: "Poverty challenges",
        body: "Households living below the poverty line struggle to provide food, school supplies, and medical care — pressures that fall hardest on young women and children.",
      },
      {
        title: "Housing insecurity",
        body: "Many young mothers face abandonment or unsafe living conditions, leaving them and their children exposed to exploitation and instability.",
      },
      {
        title: "Need for structured support",
        body: "Ad hoc help rarely changes long-term trajectories. Sustainable transformation requires structured housing, healthcare, education, and mentorship working in concert.",
      },
    ],
  },
  ctaBand: {
    enabled: true,
    title: "A structured response begins with structured support.",
    body: null,
  },
};
