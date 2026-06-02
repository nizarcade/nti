# The Problem Page CMS — Plan

Make the Grace Bridge "The Problem" page admin-editable. Simplest surface: header + list of issue cards. Builds on `Home-Todos.md`.

---

## 1. Inventory

Source: `src/pages/TheProblem.tsx`. Sections:

1. **Header** — eyebrow + title.
2. **Issues stack** — N stacked cards (currently 4): title + body.
3. **CTA band** — title.
4. **SEO** — title + description.

---

## 2. Data model

Reuse `page_content`. Slug `"the-problem"`.

```ts
type TheProblemContent = {
  seo: { title: string; description: string };
  intro: { eyebrow: string; title: string };
  issues: {
    enabled: boolean;
    items: Array<{ title: string; body: string }>;
  };
  ctaBand: { enabled: boolean; title: string; body?: string };
};
```

---

## 3. Backend

Register `TheProblemContent` under `SCHEMA_BY_SLUG["the-problem"]`. Seed with current 4 issues.

---

## 4. Frontend — public

- `theProblemDefaults.ts`, `useTheProblemContent()`.
- Refactor `TheProblem.tsx`. Layout unchanged.

---

## 5. Frontend — admin

`AdminTheProblemPage.tsx`. Route `/admin/pages/the-problem`.

Sections: Intro, Issues (repeater: title + textarea), CTA Band, SEO. Flat forms only.

---

## 6. Build order

1. `TheProblemContent` model + defaults + seed.
2. Public refactor + parity check.
3. Admin shell + sidebar link + forms.

---

## 7. NOT building

- Source citations / footnotes per issue (could be a v2).
- Charts or stats per issue.
- Country-specific variations.

---

## 8. Open questions

1. Do we want optional supporting stat per issue (e.g. "1 in 5 girls…"), or keep title + body only?
