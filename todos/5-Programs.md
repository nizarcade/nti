# Programs Page CMS — Plan

Make the Programs page admin-editable. Builds on `Home-Todos.md` (single `page_content` table, slug routes, icon registry, repeatable-list editor).

---

## 1. Inventory

Source: `src/pages/Programs.tsx`. Sections:

1. **Header** — eyebrow + title + subtitle.
2. **Pillars grid** — N program cards (currently 3 from `programs` in `site.ts`): title, summary, bullet list.
3. **Current focus callout** — title + body (currently Grace Bridge teaser block).
4. **CTA band** — title.
5. **SEO** — title + description.

---

## 2. Data model

Reuse `page_content`. Slug `"programs"`.

```ts
type ProgramsContent = {
  seo: { title: string; description: string };
  intro: { eyebrow: string; title: string; subtitle: string };
  pillars: {
    enabled: boolean;
    items: Array<{
      slug: string;
      title: string;
      summary: string;
      bullets: string[];
      iconKey?: string;          // optional, from icon registry
      linkHref?: string;         // optional "Learn more" link
      linkLabel?: string;
    }>;
  };
  currentFocus: {
    enabled: boolean;
    title: string;
    body: string;
    ctaHref?: string;
    ctaLabel?: string;
  };
  ctaBand: { enabled: boolean; title: string; body?: string };
};
```

---

## 3. Backend

Register `ProgramsContent` under `SCHEMA_BY_SLUG["programs"]`. Seed migration with current `programs` array + Grace Bridge callout.

---

## 4. Frontend — public

- `src/content/programsDefaults.ts`, `src/hooks/useProgramsContent.ts`.
- Refactor `src/pages/Programs.tsx` to consume hook. Layout unchanged.
- Pillar cards keep current visual; icon optional.

---

## 5. Frontend — admin

`src/pages/admin/AdminProgramsPage.tsx`. Route `/admin/pages/programs`.

Sections: Intro, Pillars (repeatable list with bullets sub-repeater), Current Focus, CTA Band, SEO.

---

## 6. Build order

1. `ProgramsContent` model + defaults + seed migration.
2. Public refactor + parity check.
3. Admin shell + sidebar link.
4. Flat forms (Intro / Current Focus / CTA / SEO).
5. Pillars repeater with nested bullets editor.

---

## 7. NOT building

- Per-program detail pages — Grace Bridge already has its own pages; others stay summary cards.
- Per-program photos.
- Metrics per program.

---

## 8. Open questions

1. Should each pillar optionally link to its own detail page (`/programs/:slug`), and if so do we generate those from this same content row?
2. Lock icons to a registry, or allow custom upload per pillar?
