export type LeadershipQuote = { text: string; attribution: string | null };
export type StructureMember = {
  role: string;
  name: string;
  photoUrl: string | null;
  bioShort: string | null;
};

export type LeadershipContent = {
  seo: { title: string; description: string };
  intro: { eyebrow: string; title: string };
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
    description: "Adan Muktar, Founder & Executive Director, and NTI's leadership structure.",
  },
  intro: {
    eyebrow: "Leadership",
    title: "Ethical leadership grounded in lived experience.",
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
      "Adan founded Northern Transformation Initiative with a commitment to ethical leadership and structured community development. As the author of Memoirs of a Lost Boy: A Journey of Identity, Adan shares his lived experience of displacement, resilience, and the transformative power of education.",
      "From Boston, MA, Adan oversees U.S. partnerships, fundraising strategy, international collaboration, and program development. His leadership is grounded in first-hand understanding of hardship, a commitment to financial transparency, belief in education as a pathway to independence, and cross-cultural engagement between Africa and the United States.",
    ],
  },
  voiceBlock: {
    enabled: true,
    eyebrow: "A voice born from experience",
    title: "Lessons translated into structured programs.",
    intro:
      "The stories documented in Adan's books are not fiction detached from reality. They reflect lived experiences of hardship, displacement, institutional instability, and resilience. NTI transforms those lessons into structured programs that support vulnerable families, strengthen education systems, provide dignity-centered assistance, and encourage ethical leadership.",
    quotes: [
      {
        text: "School was my sanctuary. Every day, I walked barefoot over dust and stones to reach a small classroom… Inside, I could dream.",
        attribution: null,
      },
      {
        text: "Even in the shadows of fear, sparks of hope persisted. I clung to education as my only escape.",
        attribution: null,
      },
    ],
  },
  structure: {
    enabled: true,
    title: "Leadership structure",
    members: [
      { role: "President & Director", name: "Abdirahman Muktar", photoUrl: null, bioShort: null },
      { role: "Treasurer", name: "Osman Haji", photoUrl: null, bioShort: null },
      { role: "Clerk", name: "Ismail Jama", photoUrl: null, bioShort: null },
    ],
  },
};
