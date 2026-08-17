export type GovernanceChip = {
  label: string;
  emphasis: "primary" | "default";
};

export type ValueItem = {
  iconKey: string;
  title: string;
  body: string;
};

export type TitledBody = {
  title: string;
  body: string;
};

export type AboutContent = {
  seo: {
    title: string;
    description: string;
  };

  intro: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };

  mission: {
    enabled: boolean;
    overline: string;
    statement: string;
  };

  historyVision: {
    enabled: boolean;
    history: TitledBody;
    vision: TitledBody;
  };

  values: {
    enabled: boolean;
    title: string;
    items: ValueItem[];
  };

  governance: {
    enabled: boolean;
    title: string;
    subtitle: string;
    chips: GovernanceChip[];
  };

  ctaBand: {
    enabled: boolean;
    title: string;
    body: string | null;
  };
};

export const aboutDefaults: AboutContent = {
  seo: {
    title: "About NTI",
    description:
      "Northern Transformation Initiative is a nonprofit organization working to protect vulnerable children in Kenya and expand access to education, health, safety, and opportunity.",
  },

  intro: {
    eyebrow: "About",
    title: "Building brighter futures for vulnerable children.",
    subtitle:
      "Founded in Kenya in 2011, Northern Transformation Initiative works to create safe, stable pathways for vulnerable children to learn, grow, and thrive. NTI is also an IRS-recognized U.S. 501(c)(3) public charity.",
  },

  mission: {
    enabled: true,
    overline: "Mission",
    statement:
      "To protect vulnerable children and expand their opportunities through safe care, education, nutrition, health support, safeguarding, and child-centered development.",
  },

  historyVision: {
    enabled: true,

    history: {
      title: "Our history",
      body:
        "Northern Transformation Initiative was founded in Kenya in 2011 with a commitment to improving opportunities for vulnerable children. That commitment continues through structured programs designed around safety, education, health, dignity, and long-term development.",
    },

    vision: {
      title: "Our vision",
      body:
        "We envision a future in which vulnerable children are protected from instability and given the consistent care, education, health support, and opportunities they need to reach their potential.",
    },
  },

  values: {
    enabled: true,
    title: "Values that guide our work",

    items: [
      {
        iconKey: "shield",
        title: "Child Protection",
        body:
          "The safety, dignity, and well-being of every child come first.",
      },
      {
        iconKey: "check",
        title: "Integrity",
        body:
          "We approach every responsibility with honesty, transparency, and responsible stewardship.",
      },
      {
        iconKey: "scale",
        title: "Accountability",
        body:
          "Programs are designed around clear responsibilities, oversight, and measurable outcomes.",
      },
      {
        iconKey: "heart",
        title: "Dignity",
        body:
          "Every child deserves to be treated with respect and supported in an environment where they can grow with confidence.",
      },
    ],
  },

  governance: {
    enabled: true,
    title: "Registration & governance",
    subtitle:
      "NTI operates through nonprofit governance, financial oversight, safeguarding, and accountability structures in support of its mission.",

    chips: [
      {
        label: "Founded in Kenya · Feb 10, 2011",
        emphasis: "primary",
      },
      {
        label: "U.S. 501(c)(3) Public Charity",
        emphasis: "primary",
      },
      {
        label: "HQ: Nairobi, Kenya",
        emphasis: "default",
      },
      {
        label: "U.S. Office: Boston, MA",
        emphasis: "default",
      },
    ],
  },

  ctaBand: {
    enabled: true,
    title: "Help build a safer, brighter future for a child.",
    body: null,
  },
};
