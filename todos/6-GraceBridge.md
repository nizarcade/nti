# Grace Bridge Page CMS — Plan

Make the Grace Bridge program page admin-editable. Builds on `Home-Todos.md` foundations.

---

## 1. Inventory

Source: `src/pages/GraceBridge.tsx`. Sections:

1. **Hero** — gradient background, overline, title, subhead.
2. **"Inspired by" block** — section title + long body paragraph (currently the Grace Rosado tribute).
3. **"What we provide" pillars grid** — N cards (currently 7 from `graceBridgePillars`): icon, title, body.
4. **Footer CTAs** — two buttons: "Understand the problem" / "See our solution" (links).
5. **CTA band** — title + body.
6. **SEO** — title + description.

---

## 2. Data model

Reuse `page_content`. Slug `"grace-bridge"`.

```ts
type GraceBridgeContent = {
  seo: { title: string; description: string };
  hero: {
    overline: string;
    title: string;
    subhead: string;
    backgroundImageUrl?: string;
  };
  inspiredBy: {
    enabled: boolean;
    title: string;
    body: string;                  // multi-paragraph as \n\n
  };
  pillars: {
    enabled: boolean;
    title: string;
    items: Array<{ iconKey: string; title: string; body: string }>;
  };
  footerCtas: {
    enabled: boolean;
    buttons: Array<{ label: string; href: string; variant: "outlined" | "contained" }>;
  };
  ctaBand: { enabled: boolean; title: string; body?: string };
};
```

---

## 3. Backend

Register `GraceBridgeContent` under `SCHEMA_BY_SLUG["grace-bridge"]`. Seed with current literal values.

---

## 4. Frontend — public

- `graceBridgeDefaults.ts`, `useGraceBridgeContent()`.
- Refactor `GraceBridge.tsx` to consume hook. Move `pillarIcons` map into the shared icon registry.
- Layout unchanged.

---

## 5. Frontend — admin

`AdminGraceBridgePage.tsx`. Route `/admin/pages/grace-bridge`.

Sections: Hero, Inspired By, Pillars (repeater w/ icon picker), Footer CTAs (repeater), CTA Band, SEO.

---

## 6. Build order

1. `GraceBridgeContent` model + defaults + seed.
2. Public refactor + parity check.
3. Admin shell + sidebar link.
4. Flat forms (Hero / Inspired By / CTA Band / SEO).
5. Pillars repeater + Footer CTAs repeater.

---

## 7. NOT building

- Photo gallery (revisit after media uploads land).
- Beneficiary testimonials section.
- Donation form embedded on this page (Donate page handles giving).

---

## 8. Open questions

1. Hero background — keep gradient, or allow image upload?
2. Allow more than two footer CTAs, or cap at two for layout reasons?
