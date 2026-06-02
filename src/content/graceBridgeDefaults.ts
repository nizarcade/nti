export type GBPillar = { iconKey: string; title: string; body: string };
export type GBFooterCtaButton = {
  label: string;
  href: string;
  variant: "outlined" | "contained";
};

export type GraceBridgeContent = {
  seo: { title: string; description: string };
  hero: {
    overline: string;
    title: string;
    subhead: string;
    backgroundImageUrl: string | null;
  };
  inspiredBy: { enabled: boolean; title: string; body: string };
  pillars: { enabled: boolean; title: string; items: GBPillar[] };
  footerCtas: { enabled: boolean; buttons: GBFooterCtaButton[] };
  ctaBand: { enabled: boolean; title: string; body: string | null };
};

export const graceBridgeDefaults: GraceBridgeContent = {
  seo: {
    title: "Grace Bridge Initiative",
    description:
      "NTI's flagship program supporting vulnerable young mothers in Kenya through safe housing, healthcare, nutrition, skills training, and reintegration.",
  },
  hero: {
    overline: "Our current focus",
    title: "Grace Bridge Initiative",
    subhead:
      "Structured compassion for vulnerable young mothers and underserved families in Kenya — practical solutions designed to restore stability and long-term opportunity.",
    backgroundImageUrl: null,
  },
  inspiredBy: {
    enabled: true,
    title: "Inspired by Grace Rosado",
    body: "Grace Bridge Initiative is inspired by Grace Rosado, founder of New Life Home in Manchester, New Hampshire. Grace has devoted years of her life to serving vulnerable families with humility, consistency, and integrity. Her leadership reflects disciplined compassion — generosity paired with responsibility and accountability. Her work reminds us that authentic service is not about recognition; it is about impact. Grace Bridge carries that same spirit forward.",
  },
  pillars: {
    enabled: true,
    title: "What we provide",
    items: [
      { iconKey: "home", title: "Safe Housing", body: "Temporary, dignified housing assistance for young mothers." },
      { iconKey: "hospital", title: "Healthcare Access", body: "Connection to maternal and primary health services." },
      { iconKey: "nutrition", title: "Nutrition Support", body: "Food and nutrition for mothers and their children." },
      { iconKey: "school", title: "Education Sponsorship", body: "Books, uniforms, and tuition assistance to keep children in school." },
      { iconKey: "shield", title: "Sanitary Dignity", body: "Sanitary dignity programs so schoolgirls never miss class." },
      { iconKey: "build", title: "Skills Training", body: "Vocational and entrepreneurial training toward independence." },
      { iconKey: "groups", title: "Reintegration", body: "Structured mentorship and family reintegration support." },
    ],
  },
  footerCtas: {
    enabled: true,
    buttons: [
      { label: "Understand the problem", href: "/programs/grace-bridge/problem", variant: "outlined" },
      { label: "See our solution", href: "/programs/grace-bridge/solution", variant: "contained" },
    ],
  },
  ctaBand: {
    enabled: true,
    title: "Support a young mother today.",
    body: "Every gift contributes to housing, healthcare, nutrition, and skills training.",
  },
};
