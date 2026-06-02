# Our Solution Page CMS — Plan

Make the Grace Bridge "Our Solution" page admin-editable. Mirrors the Problem page in structure; pillars grid instead of stacked cards. Builds on `Home-Todos.md`.

---

## 1. Inventory

Source: `src/pages/OurSolution.tsx`. Sections:

1. **Header** — eyebrow + title + subtitle.
2. **Pillars grid** — N cards (currently 5): icon, title, body.
3. **CTA band** — title.
4. **SEO** — title + description.

---

## 2. Data model

Reuse `page_content`. Slug `"our-solution"`.

```ts
type OurSolutionContent = {
  seo: { title: string; description: string };
  intro: { eyebrow: string; title: string; subtitle: string };
  pillars: {
    enabled: boolean;
    items: Array<{ iconKey: string; title: string; body: string }>;
  };
  ctaBand: { enabled: boolean; title: string; body?: string };
};
```

The pillars shape matches Grace Bridge's "What we provide" — keep the two distinct rows so each page can be edited independently, but the icon registry and admin repeater are shared.

---

## 3. Backend

Register `OurSolutionContent` under `SCHEMA_BY_SLUG["our-solution"]`. Seed with current 5 pillars.

---

## 4. Frontend — public

- `ourSolutionDefaults.ts`, `useOurSolutionContent()`.
- Refactor `OurSolution.tsx`. Layout unchanged. Use shared icon registry.

---

## 5. Frontend — admin

`AdminOurSolutionPage.tsx`. Route `/admin/pages/our-solution`.

Sections: Intro, Pillars (icon-picker repeater), CTA Band, SEO.

---

## 6. Build order

1. `OurSolutionContent` model + defaults + seed.
2. Public refactor + parity check.
3. Admin shell + sidebar link + forms (reuses repeater).

---

## 7. NOT building

- Per-pillar metrics or beneficiary counts (no source of truth yet).
- Per-pillar detail pages.

---

## 8. Open questions

1. Should pillar shape stay decoupled from Grace Bridge's "What we provide", or unify into one editable list re-rendered on both pages?
