export type GIOption = {
  iconKey: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  ctaColor: "primary" | "secondary";
};

export type GetInvolvedContent = {
  seo: { title: string; description: string };
  intro: { eyebrow: string; title: string; align: "left" | "center" };
  options: { enabled: boolean; items: GIOption[] };
};

export const getInvolvedDefaults: GetInvolvedContent = {
  seo: {
    title: "Get Involved",
    description: "Donate, partner, or volunteer with NTI.",
  },
  intro: {
    eyebrow: "Get involved",
    title: "Three ways to make a measurable difference.",
    align: "center",
  },
  options: {
    enabled: true,
    items: [
      {
        iconKey: "favorite",
        title: "Donate",
        body: "One-time gifts, monthly partnerships, or sponsor a student. Every contribution is stewarded responsibly toward measurable outcomes.",
        ctaLabel: "Give now",
        ctaHref: "/donate",
        ctaColor: "secondary",
      },
      {
        iconKey: "handshake",
        title: "Partner",
        body: "Corporate and church partnerships expand our reach. Reach out to explore co-branded initiatives, matching programs, or mission trips.",
        ctaLabel: "Start a conversation",
        ctaHref: "/contact",
        ctaColor: "primary",
      },
      {
        iconKey: "heart",
        title: "Volunteer",
        body: "Lend professional skills — mentorship, training, content, finance, design — remotely or in-country in Kenya.",
        ctaLabel: "Tell us your skills",
        ctaHref: "/volunteer",
        ctaColor: "primary",
      },
    ],
  },
};
