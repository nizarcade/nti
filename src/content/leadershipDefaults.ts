export type LeadershipQuote = {
  text: string;
  attribution: string | null;
};

export type StructureMember = {
  role: string;
  name: string;
  photoUrl: string | null;
  bioShort: string | null;
};

export type LeadershipContent = {
  seo: {
    title: string;
    description: string;
  };

  intro: {
    eyebrow: string;
    title: string;
  };

  featured: {
    enabled: boolean;
    name: string;
    role: string;
    initials: string | null;
    photoUrl: string | null;
    phoneDisplay: string | null;
    phoneTel: string | null;
    paragraphs: string[];
  };

  voiceBlock: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    intro: string;
    quotes: LeadershipQuote[];
  };

  structure: {
    enabled: boolean;
    title: string;
    members: StructureMember[];
  };
};

export const leadershipDefaults: LeadershipContent = {
  seo: {
    title: "Leadership",
    description:
      "Meet Adan Muktar, Founder & Executive Director of Northern Transformation Initiative, and NTI's leadership structure.",
  },

  intro: {
    eyebrow: "Leadership",
    title: "Leadership grounded in lived experience and accountability.",
  },

  featured: {
    enabled: true,
    name: "Adan Muktar",
    role: "Founder & Executive Director · Boston, Massachusetts",
    initials: "AM",
    photoUrl: null,
    phoneDisplay: "+1 (646) 991-7016",
    phoneTel: "+1 (646) 991-7016",

    paragraphs: [
      "Adan founded Northern Transformation Initiative with a commitment to expanding opportunity for vulnerable children. His own experience of hardship, displacement, and the transformative power of education continues to shape NTI's child-focused mission.",
      "From Boston, Massachusetts, Adan leads U.S. partnerships, fundraising strategy, international collaboration, and program development. His leadership emphasizes child protection, education, responsible stewardship, transparency, and measurable impact.",
    ],
  },

  voiceBlock: {
    enabled: true,
    eyebrow: "A voice born from experience",
    title: "Lived experience transformed into opportunity for children.",
    intro:
      "Adan's experiences of hardship, displacement, institutional instability, and resilience inform NTI's commitment to creating safer and more stable pathways for vulnerable children. Education offered him possibility; NTI works to help make that possibility available to others.",

    quotes: [
      {
        text:
          "School was my sanctuary. Every day, I walked barefoot over dust and stones to reach a small classroom… Inside, I could dream.",
        attribution: null,
      },
      {
        text:
          "Even in the shadows of fear, sparks of hope persisted. I clung to education as my only escape.",
        attribution: null,
      },
    ],
  },

  structure: {
    enabled: true,
    title: "Leadership structure",

    members: [
      {
        role: "President & Director",
        name: "Adan Muktar",
        photoUrl: null,
        bioShort: null,
      },
      {
        role: "Treasurer",
        name: "Osman Haji",
        photoUrl: null,
        bioShort: null,
      },
      {
        role: "Clerk",
        name: "Ismail Jama",
        photoUrl: null,
        bioShort: null,
      },
    ],
  },
};
