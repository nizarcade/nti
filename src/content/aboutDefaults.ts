export type GovernanceChip = { label: string; emphasis: "primary" | "default" };
export type ValueItem = { iconKey: string; title: string; body: string };
export type TitledBody = { title: string; body: string };

export type AboutContent = {
  seo: { title: string; description: string };
  intro: { eyebrow: string; title: string; subtitle: string };
  mission: { enabled: boolean; overline: string; statement: string };
  historyVision: {
    enabled: boolean;
    history: TitledBody;
    vision: TitledBody;
  };
  values: { enabled: boolean; title: string; items: ValueItem[] };
  governance: {
    enabled: boolean;
    title: string;
    subtitle: string;
    chips: GovernanceChip[];
  };
  ctaBand: { enabled: boolean; title: string; body: string | null };
};

export const aboutDefaults: AboutContent = {
  seo: {
    title: "About NTI",
    description:
      "Northern Transformation Initiative — a registered nonprofit committed to ethical leadership, structured community development, and measurable impact across Kenya since 2011.",
  },
  intro: {
    eyebrow: "About",
    title: "A registered nonprofit, built for measurable impact.",
    subtitle:
      "Founded in Kenya in 2011 and incorporated in the United States in 2026 to broaden fundraising capacity and international partnerships. Northern Transformation Initiative Inc. is a Massachusetts nonprofit corporation; federal 501(c)(3) tax-exempt status is pending with the IRS.",
  },
  mission: {
    enabled: true,
    overline: "Mission",
    statement:
      "To empower vulnerable communities across Kenya through education, maternal support, and livelihood development — building dignity, opportunity, and measurable impact.",
  },
  historyVision: {
    enabled: true,
    history: {
      title: "Our history",
      body:
        "Established on February 10, 2011, with its head office in Nairobi, Kenya, NTI supports families and youth across Northern Kenya through livelihood and agricultural programs, educational assistance for vulnerable students, and women empowerment and youth training workshops.",
    },
    vision: {
      title: "Our vision",
      body:
        "We believe generosity should produce results — not dependency. NTI maintains structured planning, budgeting, monitoring, evaluation, and audit processes to ensure accountability and measurable outcomes.",
    },
  },
  values: {
    enabled: true,
    title: "Values that guide our work",
    items: [
      { iconKey: "check", title: "Integrity", body: "Stewarding every contribution with transparent reporting." },
      { iconKey: "shield", title: "Dignity", body: "Programs designed to restore agency, not deepen dependency." },
      { iconKey: "scale", title: "Accountability", body: "Structured planning, monitoring, evaluation, and audit." },
      { iconKey: "heart", title: "Compassion", body: "Disciplined generosity — responsive yet sustainable." },
    ],
  },
  governance: {
    enabled: true,
    title: "Registration & governance",
    subtitle: "NTI is a registered nonprofit operating under Kenyan and U.S. nonprofit regulatory frameworks.",
    chips: [
      { label: "Founded in Kenya · Feb 10, 2011", emphasis: "primary" },
      { label: "Incorporated in the U.S. · 2026 (Massachusetts)", emphasis: "primary" },
      { label: "HQ: Nairobi, Kenya", emphasis: "default" },
      { label: "U.S. Office: Boston, MA", emphasis: "default" },
      { label: "501(c)(3) status: pending with the IRS", emphasis: "default" },
    ],
  },
  ctaBand: {
    enabled: true,
    title: "Partner with a transparent, accountable nonprofit.",
    body: null,
  },
};
