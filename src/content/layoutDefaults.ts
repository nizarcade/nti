export type LayoutNavChild = { label: string; to: string };

export type LayoutNavItem = {
  label: string;
  to: string;
  children: LayoutNavChild[];
};

export type LayoutFooterLink = { label: string; to: string };

export type LayoutFooterColumn = {
  heading: string;
  links: LayoutFooterLink[];
};

export type LayoutFooterContact = {
  usOfficeLine: string;
  usPhoneDisplay: string;
  usPhoneTel: string;
  kePhoneDisplay: string;
  kePhoneTel: string;
  email: string;
  keAddress: string;
};

export type LayoutContent = {
  nav: {
    brandName: string;
    brandTagline: string;
    items: LayoutNavItem[];
  };
  footer: {
    brandName: string;
    brandBlurb: string;
    columns: LayoutFooterColumn[];
    contact: LayoutFooterContact;
    legalDisclosure: string;
    copyright: string;
    bottomLinks: LayoutFooterLink[];
  };
};

export const layoutDefaults: LayoutContent = {
  nav: {
    brandName: "NTI",
    brandTagline: "Northern Transformation Initiative",
    items: [
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
          {
            label: "Bright Futures Kenya",
            to: "/programs/bright-futures-kenya",
          },
          {
            label: "The Need",
            to: "/programs/bright-futures-kenya/the-need",
          },
          {
            label: "Our Solution",
            to: "/programs/bright-futures-kenya/our-solution",
          },
        ],
      },
      { label: "Impact", to: "/impact", children: [] },
      { label: "Campaigns", to: "/campaigns", children: [] },
      { label: "Get Involved", to: "/get-involved", children: [] },
      { label: "Contact", to: "/contact", children: [] },
    ],
  },

  footer: {
    brandName: "Northern Transformation Initiative",
    brandBlurb:
      "Restoring dignity and expanding opportunity through education, maternal support, and livelihood programs across Kenya.",
    columns: [
      {
        heading: "Explore",
        links: [
          { label: "About", to: "/about" },
          { label: "Programs", to: "/programs" },
          {
            label: "Bright Futures Kenya",
            to: "/programs/bright-futures-kenya",
          },
          { label: "Impact", to: "/impact" },
        ],
      },
      {
        heading: "Engage",
        links: [
          { label: "Donate", to: "/donate" },
          { label: "Campaigns", to: "/campaigns" },
          { label: "Get Involved", to: "/get-involved" },
          { label: "Contact", to: "/contact" },
          { label: "Books", to: "/about/books" },
        ],
      },
    ],

    contact: {
      usOfficeLine: "119 Sumner Street, Boston, MA 02128",
      usPhoneDisplay: "+1 (646) 991-7016",
      usPhoneTel: "+1 (646) 991-7016",
      kePhoneDisplay: "+254 728 979121",
      kePhoneTel: "+254 728 979121",
      email: "info@northerntransformationinitiative.org",
      keAddress: "P.O. Box 14271-00100\nNairobi, Kenya",
    },

    legalDisclosure:
      "Northern Transformation Initiative Inc. is a Massachusetts nonprofit corporation (2026). Federal 501(c)(3) tax-exempt status is pending with the IRS. Contributions are not yet tax-deductible until that determination is received.",

    copyright:
      "© {year} Northern Transformation Initiative. All rights reserved.",

    bottomLinks: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
};
