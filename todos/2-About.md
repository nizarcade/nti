# About Page CMS — Plan

Make every section of the About page admin-editable. Reuses the foundation laid out in `Home-Todos.md` (one `page_content` row per slug, same router pattern, same admin-UI conventions). This doc only covers what's specific to About.

---

## 1. Inventory: what's on the About page today

Source: `src/pages/About.tsx`. Sections in order:

1. **Header / intro** — SEO eyebrow + title + subtitle (currently carries the legal disclosure copy).
2. **Mission callout** — overline "Mission" + mission statement (currently `missionStatement` from `site.ts`).
3. **Two-column history + vision** — `Our history` (heading + body) and `Our vision` (heading + body).
4. **Values grid** — section title + 4 value cards (icon, title, body).
5. **Registration & governance** — section title + subtitle + list of chips (founded, incorporated, HQ, U.S. office, 501(c)(3) status).
6. **CTA band** — title only today; body optional.
7. **SEO** — title + description.

---

## 2. Data model

Reuse the `page_content` table from the Home plan. Insert a row with `slug = "about"`.

**JSON schema** (Pydantic `AboutContent` in `api/app/schemas.py`):

```ts
type AboutContent = {
  seo: { title: string; description: string };
  intro: {
    eyebrow: string;          // "About"
    title: string;
    subtitle: string;         // legal-disclosure copy goes here
  };
  mission: {
    enabled: boolean;
    overline: string;         // "Mission"
    statement: string;
  };
  historyVision: {
    enabled: boolean;
    history: { title: string; body: string };
    vision:  { title: string; body: string };
  };
  values: {
    enabled: boolean;
    title: string;
    items: Array<{
      icon: "check" | "shield" | "heart" | "scale" | "...";  // icon registry key
      title: string;
      body: string;
    }>;
  };
  governance: {
    enabled: boolean;
    title: string;
    subtitle: string;
    chips: Array<{ label: string; emphasis: "primary" | "default" }>;
  };
  ctaBand: {
    enabled: boolean;
    title: string;
    body?: string;
  };
};
```

No new tables. No new columns.

---

## 3. Backend

Generalize the Home routes from the previous plan so they take a slug:

- `GET  /api/site/pages/{slug}` → public.
- `GET  /api/admin/pages/{slug}` → admin.
- `PUT  /api/admin/pages/{slug}` → admin, validates against the right Pydantic model based on slug.
- `POST /api/admin/pages/{slug}/reset` → admin.

Slug-to-schema map lives in one place (`SCHEMA_BY_SLUG = {"home": HomeContent, "about": AboutContent, ...}`) so adding the next page is a one-line change.

Seed migration inserts current `About.tsx` literal values as the initial `about` row.

---

## 4. Frontend — public site

- New: `src/content/aboutDefaults.ts` — current literal values as fallback.
- Reuse `src/api/pageContent.ts` (already generalized in the Home plan): `getPageContent<T>(slug)`.
- New: `src/hooks/useAboutContent.ts` — thin wrapper around the generic hook.
- Refactor `src/pages/About.tsx` to consume the hook, drop the inline literals, keep the layout identical.
- Icon registry from the Home work extended with the values-card icons (`check`, `shield`, `heart`, `scale`, etc.).

No layout changes. No new visual sections.

---

## 5. Frontend — admin

New page: `src/pages/admin/AdminAboutPage.tsx`. Route: `/admin/pages/about`. Add link to `AdminLayout` sidebar under the "Site Content" group (next to "Home" added in the Home plan).

Section list in the left rail: Intro, Mission, History & Vision, Values, Governance, CTA Band, SEO.

Per-section forms:
- **Intro / Mission / CTA Band / SEO** — flat forms.
- **History & Vision** — two side-by-side title/body editors.
- **Values** — repeatable list (icon picker + title + body) with drag-reorder. Reuse the repeatable-list component built for Home pillars/stats.
- **Governance** — text fields for title/subtitle + repeatable chip list (label + emphasis dropdown).

Same Save / Discard / Reset behavior as Home.

---

## 6. Build order

Assumes the Home phases 1 & 2 from `Home-Todos.md` are done first; this plan rides on those foundations.

**Phase 1 — Backend slug**
1. Confirm routes are slug-parameterized (they should already be after the Home build).
2. Add `AboutContent` Pydantic model + defaults.
3. Migration insert seeding the `about` row.

**Phase 2 — Public refactor**
4. `aboutDefaults.ts`, `useAboutContent()`.
5. Refactor `About.tsx`. Verify visual parity.

**Phase 3 — Admin UI**
6. `AdminAboutPage` shell + sidebar link.
7. Flat-form sections (Intro, Mission, CTA Band, SEO).
8. History & Vision form.
9. Values repeatable list (reusing Home's component).
10. Governance chip list editor.

---

## 7. Deliberately NOT building (same as Home plan)

- Per-page versioning / drafts.
- Rich-text editor — plain multi-line text only.
- Image uploads (About has no images today; revisit if leadership photos move here).
- Generic block engine.

---

## 8. Open questions

1. Should the legal-disclosure copy stay in the `intro.subtitle` field, or be promoted to its own structured section so it can be reused (e.g. on Donate)?
2. Do the values icons need to be admin-pickable, or do we lock the four current icons and let admins only edit text?
3. Should the chip list under Governance support a link per chip (e.g. linking the 501(c)(3) status chip to an IRS lookup), or keep it text-only?
