export type NavItem = {
  label: string;
  to: string;
  children?: { label: string; to: string }[];
};

export const navItems: NavItem[] = [
  {
    label: "About",
    to: "/about",
    children: [
      { label: "Our Story", to: "/about" },
      { label: "Leadership", to: "/about/leadership" },
      { label: "Books", to: "/about/books" },
    ],
  },
  {
    label: "Programs",
    to: "/programs",
    children: [
      { label: "All Programs", to: "/programs" },
      { label: "Bright Futures Kenya", to: "/programs/bright-futures-kenya" },
      { label: "The Need", to: "/programs/bright-futures-kenya/the-need" },
     { label: "Our Solution", to: "/programs/bright-futures-kenya/our-solution" },
    ],
  },
  { label: "Impact", to: "/impact" },
  { label: "Campaigns", to: "/campaigns" },
  { label: "Get Involved", to: "/get-involved" },
  { label: "Contact", to: "/contact" },
];
