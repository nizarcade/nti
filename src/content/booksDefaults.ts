export type BookItem = {
  title: string;
  blurb: string;
  coverImageUrl: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  badge: string | null;
};

export type BooksContent = {
  seo: {
    title: string;
    description: string;
  };

  intro: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };

  books: BookItem[];
};

export const booksDefaults: BooksContent = {
  seo: {
    title: "Books by Adan Muktar",
    description:
      "Books by NTI founder Adan Muktar — lived testimony of displacement, resilience, identity, and the transformative power of education.",
  },

  intro: {
    eyebrow: "Books by Adan Muktar",
    title: "A voice born from experience.",
    subtitle:
      "Adan's writing reflects lived experiences of hardship, displacement, institutional instability, resilience, and the role education can play in changing a child's future.",
  },

  books: [
    {
      title: "Memoirs of a Lost Boy: A Journey of Identity",
      blurb:
        "A lived testimony of displacement, resilience, identity, and the transformative power of education.",
      coverImageUrl: null,
      ctaLabel: "View on Amazon",
      ctaUrl:
        "https://www.amazon.com/MEMOIRS-LOST-BOY-journey-identity-ebook/dp/B0FS69WM9Q",
      badge: null,
    },
  ],
};
