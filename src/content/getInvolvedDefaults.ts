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
    description:
      "Donate, partner, or volunteer with Northern Transformation Initiative to help create brighter futures for vulnerable children in Kenya.",
  },

  intro: {
    eyebrow: "Get involved",
    title: "Help create a brighter future for a child.",
    align: "center",
  },

  options: {
    enabled: true,
    items: [
      {
        iconKey: "favorite",
        title: "Donate",
        body:
          "Your support helps provide safe care, education, nutritious meals, health support, safeguarding, and development opportunities for vulnerable children.",
        ctaLabel: "Give now",
        ctaHref: "/donate",
        ctaColor: "secondary",
      },
      {
        iconKey: "handshake",
        title: "Partner",
        body:
          "Organizations, businesses, institutions, and community partners can help strengthen sustainable support for children through funding, expertise, resources, and collaboration.",
        ctaLabel: "Start a conversation",
        ctaHref: "/contact",
        ctaColor: "primary",
      },
      {
        iconKey: "heart",
        title: "Volunteer",
        body:
          "Contribute professional skills and expertise that strengthen NTI's programs, operations, communications, education support, and organizational capacity.",
        ctaLabel: "Tell us your skills",
        ctaHref: "/volunteer",
        ctaColor: "primary",
      },
    ],
  },
};
