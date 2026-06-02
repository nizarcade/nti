# Get Involved Page CMS — Plan

Make the Get Involved page admin-editable. Smallest surface: header + N option cards with CTAs. Builds on `Home-Todos.md`.

---

## 1. Inventory

Source: `src/pages/GetInvolved.tsx`. Sections:

1. **Header** — eyebrow + title (centered).
2. **Options grid** — N cards (currently 3: Donate / Partner / Volunteer): icon, title, body, CTA label + route, CTA color variant.
3. **SEO** — title + description.

No CTA band on this page today.

---

## 2. Data model

Reuse `page_content`. Slug `"get-involved"`.

```ts
type GetInvolvedContent = {
  seo: { title: string; description: string };
  intro: { eyebrow: string; title: string; align?: "left" | "center" };
  options: {
    enabled: boolean;
    items: Array<{
      iconKey: string;             // from icon registry
      title: string;
      body: string;
      ctaLabel: string;
      ctaHref: string;
      ctaColor: "primary" | "secondary";
    }>;
  };
};
```

---

## 3. Backend

Register `GetInvolvedContent` under `SCHEMA_BY_SLUG["get-involved"]`. Seed with current 3 options.

---

## 4. Frontend — public

- `getInvolvedDefaults.ts`, `useGetInvolvedContent()`.
- Refactor `GetInvolved.tsx`. Layout unchanged.

---

## 5. Frontend — admin

`AdminGetInvolvedPage.tsx`. Route `/admin/pages/get-involved`.

Sections: Intro, Options (icon-picker repeater with CTA fields + color dropdown), SEO.

---

## 6. Build order

1. `GetInvolvedContent` model + defaults + seed.
2. Public refactor + parity check.
3. Admin shell + sidebar link + forms.

---

## 7. NOT building

- Inline donation form (the Donate page handles that).
- Inline volunteer signup form (the Volunteer page handles that).
- Per-option detail pages.

---

## 8. Open questions

1. Cap option count at 3 for layout symmetry, or allow N with the grid wrapping?
2. Should `ctaHref` support both internal routes and external URLs (open in new tab when external)?
