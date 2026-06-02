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
      { label: "Grace Bridge Initiative", to: "/programs/grace-bridge" },
      { label: "The Problem", to: "/programs/grace-bridge/problem" },
      { label: "Our Solution", to: "/programs/grace-bridge/solution" },
    ],
  },
  { label: "Impact", to: "/impact" },
  { label: "Campaigns", to: "/campaigns" },
  { label: "Get Involved", to: "/get-involved" },
  { label: "Contact", to: "/contact" },
];
