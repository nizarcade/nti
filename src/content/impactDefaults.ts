export type ImpactStat = {
  value: string;
  label: string;
};

export type ImpactDoc = {
  title: string;
  status: "available" | "coming-soon";
  fileUrl: string | null;
  year: number | null;
};

export type ImpactContent = {
  seo: {
    title: string;
    description: string;
  };

  intro: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };

  stats: {
    enabled: boolean;
    items: ImpactStat[];
  };

  documents: {
    enabled: boolean;
    title: string;
    items: ImpactDoc[];
  };

  whyGiftMatters: {
    enabled: boolean;
    title: string;
    body: string;
  };

  ctaBand: {
    enabled: boolean;
    title: string;
    body: string | null;
  };
};

export const impactDefaults: ImpactContent = {
  seo: {
    title: "Impact & Transparency",
    description:
      "NTI's commitment to measurable impact, responsible stewardship, financial transparency, and child-centered accountability.",
  },

  intro: {
    eyebrow: "Impact & Transparency",
    title: "Accountability behind every commitment.",
    subtitle:
      "NTI is committed to responsible stewardship, program oversight, child safeguarding, transparent reporting, and measuring the results of our work.",
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

  documents: {
    enabled: true,
    title: "Documents",
    items: [
      {
        title: "Annual Report",
        status: "coming-soon",
        fileUrl: null,
        year: null,
      },
      {
        title: "Financial Summary",
        status: "coming-soon",
        fileUrl: null,
        year: null,
      },
      {
        title: "Compliance & Registration Certificates",
        status: "coming-soon",
        fileUrl: null,
        year: null,
      },
    ],
  },

  whyGiftMatters: {
    enabled: true,
    title: "Why your gift matters",
    body:
      "For a vulnerable child, stability can change the direction of a life. Support for NTI helps create access to safe care, education, nutritious meals, health support, safeguarding, mentorship, and the consistent environment children need to build stronger futures.",
  },

  ctaBand: {
    enabled: true,
    title: "Help us build measurable, lasting impact for children.",
    body: null,
  },
};
