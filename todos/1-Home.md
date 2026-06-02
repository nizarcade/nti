# Home Page CMS — Plan

Make every section of the Home page admin-editable without redeploying. Scope is **Home page only** for now; other pages stay code-owned. Approach: structured per-section content (not a generic block engine), so the layout stays predictable and the admin UI stays simple.

---

## 1. Inventory: what's on the Home page today

Source: `src/pages/Home.tsx`. Sections in order:

1. **Hero** — overline, headline (HTML/line breaks), subhead, primary CTA (label + link), secondary CTA (label + link), tertiary link.
2. **Mission pillars** — section eyebrow + title + subtitle, 3 cards (icon, title, body).
3. **Grace Bridge teaser** — eyebrow, title, body, CTA (label + link), background image/gradient + overlay text.
4. **Impact stats** — 3 stats (value + label). Already partly in `site.ts`.
5. **Donation tiers** — section heading + 3 tiers (amount, title, body). Already in `site.ts`.
6. **Featured campaigns** — pulled from existing campaigns API (already dynamic). Admin control: how many to show, toggle section on/off.
7. **Quote** — quote text + attribution (name + role).
8. **CTA band** — title + body + button.
9. **SEO** — title, description, JSON-LD overrides.
10. **Section toggles** — show/hide each section, reorder a small allow-list (optional, nice-to-have).

---

## 2. Data model (backend)

Single document per page keyed by slug. Start with one row: `slug = "home"`.

**Table:** `page_content`

| column      | type           | notes                                    |
|-------------|----------------|------------------------------------------|
| id          | uuid pk        |                                          |
| slug        | text unique    | "home"                                   |
| data        | jsonb          | typed JSON matching the schema below     |
| updated_at  | timestamptz    |                                          |
| updated_by  | text           | admin username                           |

Alembic migration: `nti-bridge/api/alembic/versions/<ts>_page_content.py`.

**JSON schema (TypeScript-style, lives in `api/app/schemas.py` as Pydantic):**

```ts
type HomeContent = {
  seo: { title: string; description: string };
  hero: {
    enabled: boolean;
    overline: string;          // "Founded in Kenya · 2011 | …"
    headline: string;          // supports \n for line breaks
    subhead: string;
    primaryCta: { label: string; href: string; kind: "donate" | "link" };
    secondaryCta?: { label: string; href: string };
    tertiaryCta?: { label: string; href: string };
    backgroundImageUrl?: string;
  };
  pillars: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    items: Array<{ icon: "school" | "heart" | "groups" | "..."; title: string; body: string }>;
  };
  graceBridge: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    body: string;
    cta: { label: string; href: string };
    imageUrl?: string;
    overlayText?: string;
  };
  stats: {
    enabled: boolean;
    items: Array<{ value: string; label: string }>;
  };
  donationTiers: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    items: Array<{ amount: number; title: string; body: string }>;
  };
  featuredCampaigns: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    limit: number;             // default 3
  };
  quote: {
    enabled: boolean;
    text: string;
    attributionName: string;
    attributionRole: string;
  };
  ctaBand: {
    enabled: boolean;
    title: string;
    body: string;
  };
  sectionOrder?: string[];     // optional reordering, defaults to declared order
};
```

---

## 3. Backend (FastAPI)

New router: `api/app/routers/page_content.py`.

- `GET  /api/site/pages/home` → public, cached, returns current `data`. Falls back to a hard-coded default if the row doesn't exist yet.
- `GET  /api/admin/pages/home` → admin auth, same payload + `updated_at` / `updated_by`.
- `PUT  /api/admin/pages/home` → admin auth, validates against `HomeContent` Pydantic model, writes row.
- `POST /api/admin/pages/home/reset` → admin auth, resets to defaults (handy "oops" button).

Cache: simple in-process cache with `updated_at` invalidation, or no cache and rely on Caddy / browser. Start with no cache.

Seed: run-once migration that inserts the current `site.ts` values as the initial `home` row so the public site doesn't change on deploy.

---

## 4. Image uploads (needed for hero / Grace Bridge bg)

New router: `api/app/routers/media.py`.

- `POST /api/admin/media` (multipart) → stores to local `./uploads/` (dev) or S3/Spaces (prod, env-toggled), returns `{ url, id, width, height, alt? }`.
- `GET  /api/admin/media` → paginated list for picker.
- `DELETE /api/admin/media/:id`.

Compose: mount `./uploads` volume; Caddy serves `/media/*` from the API or directly. Limit: 5 MB, image mimetypes only, auto-resize to a max width (e.g. 1920) via Pillow.

If you want to skip this for v1, hero/Grace Bridge images stay as static assets in `public/` and only the URL is editable.

---

## 5. Frontend — public site

- New: `src/content/homeDefaults.ts` — the current literal values, used as the SSR-less fallback.
- New: `src/api/pageContent.ts` — `getHomeContent(): Promise<HomeContent>`.
- New: `src/hooks/useHomeContent.ts` — React Query / SWR hook, fallback to defaults on error.
- Refactor `src/pages/Home.tsx`:
  - Remove inline literals; consume `useHomeContent()`.
  - Each section reads from its slice and respects `enabled`.
  - Keep all visual structure exactly as-is. **No layout change.**
  - Icons: map string keys (`"school"`, `"heart"`, `"groups"`) to MUI icon components in a small registry so JSON can reference them.

---

## 6. Frontend — admin

New page: `src/pages/admin/AdminHomePage.tsx`. Route: `/admin/pages/home`. Add link to `AdminLayout` sidebar under a new "Site Content" group.

Layout: left rail = section list (Hero, Pillars, Grace Bridge, Stats, Donation Tiers, Featured Campaigns, Quote, CTA Band, SEO). Click a section → right pane = form.

Per-section forms:
- **Hero:** text fields + image picker + two CTA editors (label + href).
- **Pillars / Stats / Donation Tiers:** repeatable list with add/remove/drag-reorder (use `@dnd-kit/sortable`, already small).
- **Grace Bridge / Quote / CTA Band:** flat form.
- **Featured Campaigns:** enabled toggle + limit number + heading text.
- **SEO:** title + description.

Top bar: "Discard changes" / "Save". Save calls `PUT /api/admin/pages/home`. Show `updated_at` and `updated_by`. Toast on success.

Optional v1.1: "Preview" button opens `/?preview=<token>` that injects unsaved JSON into the public page renderer.

---

## 7. Build order (recommended)

**Phase 1 — Foundations** (skeleton, no UI polish)
1. Alembic migration for `page_content`.
2. Pydantic `HomeContent` model + defaults constant mirroring current `site.ts` values.
3. FastAPI router with `GET /api/site/pages/home`, `GET/PUT /api/admin/pages/home`.
4. Frontend: `homeDefaults.ts`, `useHomeContent()`, refactor `Home.tsx` to read from it. **Verify public site looks identical.**

**Phase 2 — Admin UI**
5. `AdminHomePage` shell + sidebar nav entry + section list.
6. Forms for the flat sections first (Hero, Grace Bridge, Quote, CTA Band, SEO).
7. Repeatable-list editor + reuse for Pillars, Stats, Donation Tiers.
8. Featured Campaigns toggle + limit.
9. Save / Discard / Reset.

**Phase 3 — Media (optional, gated on need)**
10. Media router + upload form + image picker component.
11. Wire image picker into Hero and Grace Bridge sections.

**Phase 4 — Polish**
12. Section enable/disable toggles surfaced in admin.
13. Optional drag-reorder for sections (`sectionOrder`).
14. Optional preview mode.
15. Optional audit log row per save (who, when, diff size).

---

## 8. Things we are deliberately NOT building

- Generic block engine for arbitrary pages (overkill; revisit only if About/Programs also become dynamic).
- Page versioning / draft vs published / scheduled publish (add later if needed).
- Multi-user roles beyond the existing single admin (the current auth is fine for v1).
- Visual drag-and-drop on the live page. Editing happens in admin forms; the public page just renders the result.
- Rich-text editor for body copy — plain multi-line text is enough for now. If we need formatting later, add a constrained Markdown renderer.

---

## 9. Open questions (decide before Phase 1)

1. Do hero / Grace Bridge images need to be admin-uploadable, or is editing the URL field (with images committed to `public/`) good enough for v1?
2. Storage for uploads: local disk on the droplet, or S3 / DigitalOcean Spaces?
3. Should saving immediately publish, or do we want a draft/publish flow?
4. Do we want a public-side cache (Caddy / `Cache-Control`) on `/api/site/pages/home`, and what staleness is acceptable?
