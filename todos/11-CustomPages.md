# 11 — Custom pages (self-service page builder)

Let admins create brand-new pages from the admin UI, with a working public URL and a one-click "add to nav" flow. Hand-crafted pages (Home, About, …) continue to use the per-slug `page_content` CMS untouched.

---

## 1. Data model (backend)

New table `custom_page` — kept separate from `page_content` so it can't collide with hand-crafted slugs.

| column        | type        | notes                                                                                                  |
| ------------- | ----------- | ------------------------------------------------------------------------------------------------------ |
| `id`          | uuid        | pk                                                                                                     |
| `slug`        | text unique | URL-safe, validated `^[a-z0-9][a-z0-9-]*$`; reserved-slug blocklist (see §7)                           |
| `title`       | text        | used in `<Seo>` and default H1                                                                         |
| `status`      | enum        | `draft` \| `published` — only `published` is reachable publicly                                         |
| `blocks`      | jsonb       | ordered list of typed content blocks (see §2)                                                          |
| `seo`         | jsonb       | `{ description, ogImage? }`                                                                            |
| `created_at`  | timestamptz |                                                                                                        |
| `updated_at`  | timestamptz |                                                                                                        |
| `updated_by`  | text        | admin username                                                                                         |

Alembic migration: create table + unique index on `slug` + index on `status`.

## 2. Block schema (shared contract)

Body is `blocks: Block[]` where each block is `{ id: string, type: string, data: <typed> }`. Pydantic v2 discriminated union keyed on `type`. Unknown types are ignored on render (forward compat).

Initial block types:

- `hero` — `{ eyebrow?, title, subtitle?, ctaLabel?, ctaTo?, image? }`
- `richText` — `{ html }` (TipTap-produced HTML, sanitized with DOMPurify on render)
- `imageText` — `{ image, side: "left" | "right", title, body }`
- `featureGrid` — `{ title?, items: { iconKey?, title, body }[] }`
- `quote` — `{ text, attribution? }`
- `cta` — `{ title, body?, primaryLabel, primaryTo, secondaryLabel?, secondaryTo? }`
- `faq` — `{ items: { q, a }[] }`
- `embed` — `{ kind: "youtube" | "raw", value }` (raw HTML gated behind admin-only feature flag)

## 3. API (backend)

`api/app/routers/custom_pages.py`:

- `GET  /api/site/pages-custom/{slug}` — public; `404` if missing or not published.
- `GET  /api/admin/pages-custom` — list `(id, slug, title, status, updated_at)`.
- `POST /api/admin/pages-custom` — create `{ slug, title }`; validates slug, rejects reserved.
- `GET  /api/admin/pages-custom/{id}` — full doc.
- `PUT  /api/admin/pages-custom/{id}` — update `{ title, status, blocks, seo }`.
- `POST /api/admin/pages-custom/{id}/duplicate` — clone with new slug.
- `DELETE /api/admin/pages-custom/{id}` — hard delete; UI confirms.

Every write emits an audit log entry (same pattern as `page_content`).

## 4. Public routing & renderer (frontend)

- Add catch-all in `src/App.tsx`, **after** all explicit routes: `<Route path="/:slug" element={<DynamicPage />} />`.
- `src/pages/DynamicPage.tsx`:
  - `useParams()` → slug, fetch via `customPages.public(slug)`.
  - Loading skeleton; on miss render the existing 404.
  - `<Seo title={page.title} description={page.seo.description} />`.
  - Render `page.blocks` through `BlockRenderer`.
- `src/components/blocks/` — one presentational component per block type, all consuming existing theme tokens.
- Rich text rendered as sanitized HTML via DOMPurify (same pattern as `CampaignDetail`); editor uses the existing TipTap stack.

## 5. Admin UI (frontend)

New sidebar group under **Pages** → **Custom pages**.

- `src/pages/admin/AdminCustomPagesListPage.tsx` (`/admin/pages-custom`)
  - Table: title · slug · status badge · updated · actions (Edit / Duplicate / Delete / View public).
  - "New page" → dialog `{ title, slug (auto-slugified, editable) }` → create → navigate to editor.
- `src/pages/admin/AdminCustomPageEditor.tsx` (`/admin/pages-custom/:id`)
  - Reuse `PageContentAdmin` chrome (load/save/reset/toast/viewport toggle/sticky `PreviewFrame`). Refactor it to accept generic load/save callbacks, or build a sibling `CustomPageAdmin` mirroring it.
  - Editor pane: title · slug (with "rename changes the URL" warning) · status toggle · SEO accordion · **Block list**.
  - Block list: reorder (drag handle + up/down), delete, duplicate per block; "Add block" menu listing block types; each type has its own inline editor built from `TextRow`, `RepeaterList`, `IconPicker`, `StringListEditor`.
  - Preview pane: `<BlockRenderer blocks={…} />` inside `PreviewFrame` so it renders exactly like the public page.

## 6. Nav wiring (close the loop)

1. In the custom-page editor: **"Add to navigation"** button → small picker (top-level item + optional parent) → PATCH the `layout` page content to append `{ label: title, to: "/"+slug }`. Toast + link back to Header & Footer editor.
2. In Header & Footer editor's path field: autocomplete suggesting existing custom-page slugs + known static routes, so admins can't fat-finger a path.

## 7. Safety & validation

- Server-side slug validation + reserved blocklist: everything in `SCHEMA_BY_SLUG`, plus `admin`, `api`, `assets`, `static`, `favicon.ico`, etc.
- Rich text + raw embeds sanitized with DOMPurify before render; `embed.raw` admin-only and feature-flagged.
- 404 for unknown / unpublished slugs; never leak `status=draft` publicly.
- Admin routes require existing admin auth middleware; all writes audited.

## 8. Rollout order (small, mergeable PRs)

1. **Backend**: model + migration + Pydantic blocks + public GET + admin CRUD + tests.
2. **Public frontend**: `BlockRenderer`, all block components, `DynamicPage`, catch-all route, 404 polish.
3. **Admin shell**: list page + create dialog + editor shell (title / slug / status / SEO; raw JSON fallback for blocks).
4. **Admin blocks**: per-block visual editors, reorder / add / delete / duplicate.
5. **Nav integration**: "Add to nav" button + path autocomplete in Header & Footer editor.
6. **Polish**: duplicate page, status workflow, "unsaved changes" guard, preview viewport parity.

## 9. Out of scope (intentionally)

- Versioning / revisions (future `custom_page_revision` table).
- Scheduled publishing.
- Multi-language.
- Per-block visibility / A/B rules.
- Inline WYSIWYG editing on the public page.
- File / media library (block images use plain URL fields for now; upload pipeline is a separate effort).
