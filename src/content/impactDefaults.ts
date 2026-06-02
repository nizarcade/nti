export type ImpactStat = { value: string; label: string };
export type ImpactDoc = {
  title: string;
  status: "available" | "coming-soon";
  fileUrl: string | null;
  year: number | null;
};

export type ImpactContent = {
  seo: { title: string; description: string };
  intro: { eyebrow: string; title: string; subtitle: string };
  stats: { enabled: boolean; items: ImpactStat[] };
  documents: { enabled: boolean; title: string; items: ImpactDoc[] };
  whyGiftMatters: { enabled: boolean; title: string; body: string };
  ctaBand: { enabled: boolean; title: string; body: string | null };
};

export const impactDefaults: ImpactContent = {
  seo: {
    title: "Impact & Transparency",
    description: "Annual reports, financial summary, and compliance documents from NTI.",
  },
  intro: {
    eyebrow: "Impact & Transparency",
    title: "Measurable outcomes. Open books.",
    subtitle:
      "NTI follows structured financial oversight, project evaluation systems, and accountability standards. Documents below will be published as audits and reports complete.",
  },
  stats: {
    enabled: true,
    items: [
      { value: "15+", label: "Years of community service in Kenya since 2011" },
      { value: "2026", label: "Incorporated in the U.S. (Massachusetts)" },
      { value: "3", label: "Active program pillars" },
    ],
  },
  documents: {
    enabled: true,
    title: "Documents",
    items: [
      { title: "Annual Report", status: "coming-soon", fileUrl: null, year: null },
      { title: "Financial Summary", status: "coming-soon", fileUrl: null, year: null },
      { title: "Compliance & Registration Certificates", status: "coming-soon", fileUrl: null, year: null },
    ],
  },
  whyGiftMatters: {
    enabled: true,
    title: "Why your gift matters",
    body: "The stories documented in Adan's books are not fiction detached from reality. They reflect lived experiences of hardship, displacement, and resilience. Today, NTI works to ensure that vulnerable children and families are not defined by conflict or poverty — but by opportunity, dignity, and access to education.",
  },
  ctaBand: {
    enabled: true,
    title: "Help us publish the next chapter of impact.",
    body: null,
  },
};
