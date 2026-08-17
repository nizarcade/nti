export type TPIssue = {
  title: string;
  body: string;
};

export type TheProblemContent = {
  seo: {
    title: string;
    description: string;
  };
  intro: {
    eyebrow: string;
    title: string;
  };
  issues: {
    enabled: boolean;
    items: TPIssue[];
  };
  ctaBand: {
    enabled: boolean;
    title: string;
    body: string | null;
  };
};

export const theProblemDefaults: TheProblemContent = {
  seo: {
    title: "The Need",
    description:
      "Why vulnerable children in Kenya need safe care, education, protection, nutrition, health support, and long-term stability.",
  },

  intro: {
    eyebrow: "Bright Futures Kenya · The Need",
    title: "The challenges we exist to address.",
  },

  issues: {
    enabled: true,
    items: [
      {
        title: "Children without reliable parental care",
        body:
          "Bright Futures Kenya focuses on vulnerable children ages 6–10, particularly children who are abandoned, orphaned, without reliable parental care, or otherwise at serious risk.",
      },
      {
        title: "Unsafe and unstable living conditions",
        body:
          "Without a safe and stable environment, vulnerable children face greater risks to their protection, wellbeing, education, and healthy development.",
      },
      {
        title: "Barriers to education",
        body:
          "School access can be disrupted by the lack of transportation, uniforms, learning materials, tutoring, and the consistent support children need to remain engaged in their education.",
      },
      {
        title: "The need for comprehensive support",
        body:
          "Children's needs are interconnected. Safe residential care, education, nutritious meals, clothing and hygiene, health and dental support, safeguarding, referrals, recreation, and child development must work together to create lasting stability and opportunity.",
      },
    ],
  },

  ctaBand: {
    enabled: true,
    title: "Every child deserves safety, stability, and the opportunity to learn.",
    body: null,
  },
};
