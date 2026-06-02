# Impact & Transparency Page CMS — Plan

Make the Impact page admin-editable. Adds one new capability vs other pages: **document uploads** (PDFs for annual reports). Builds on `Home-Todos.md`.

---

## 1. Inventory

Source: `src/pages/ImpactTransparency.tsx`. Sections:

1. **Header** — eyebrow + title + subtitle.
2. **Stats grid** — N stats (currently from shared `impactStats` in `site.ts`).
3. **Documents list** — N rows (currently 3 placeholders): title + status ("Coming Soon") or downloadable PDF link.
4. **"Why your gift matters" callout** — title + body.
5. **CTA band** — title.
6. **SEO** — title + description.

---

## 2. Data model

Reuse `page_content`. Slug `"impact"`.

```ts
type ImpactContent = {
  seo: { title: string; description: string };
  intro: { eyebrow: string; title: string; subtitle: string };
  stats: {
    enabled: boolean;
    items: Array<{ value: string; label: string }>;
  };
  documents: {
    enabled: boolean;
    title: string;                 // section heading, e.g. "Documents"
    items: Array<{
      title: string;
      status: "available" | "coming-soon";
      fileUrl?: string;            // when status = available
      year?: number;
    }>;
  };
  whyGiftMatters: {
    enabled: boolean;
    title: string;
    body: string;
  };
  ctaBand: { enabled: boolean; title: string; body?: string };
};
```

**Stats reuse note:** stats are also surfaced on Home. Two reasonable options:
- (A) Keep separate `stats` slice per page (duplication, easy edits).
- (B) Promote stats to a site-wide singleton (`/api/site/settings`) and reference from both pages.

Recommend (A) for v1 — simpler — and revisit only if duplication becomes painful.

---

## 3. Backend

Register `ImpactContent` under `SCHEMA_BY_SLUG["impact"]`. Seed with current values.

**Document uploads** depend on the media router from `Home-Todos.md § 4`, extended to accept PDFs (whitelist `application/pdf`, size cap higher, e.g. 25 MB). Stored alongside images, listed in the media library with a type filter.

---

## 4. Frontend — public

- `impactDefaults.ts`, `useImpactContent()`.
- Refactor `ImpactTransparency.tsx`. Stop importing `impactStats` from `site.ts`.
- Documents row renders a download button when `status = available`, a muted "Coming soon" chip otherwise.

---

## 5. Frontend — admin

`AdminImpactPage.tsx`. Route `/admin/pages/impact`.

Sections: Intro, Stats (repeater), Documents (repeater with status dropdown + file picker), Why Gift Matters, CTA Band, SEO.

Documents repeater row: title, year, status dropdown, file picker (visible when status = available).

---

## 6. Build order

**Phase 1 — Content without uploads**
1. `ImpactContent` model + defaults + seed.
2. Public refactor + parity check.
3. Admin shell + flat forms + Stats repeater.
4. Documents repeater with `fileUrl` as plain URL field (no upload yet).

**Phase 2 — Uploads (depends on media work from Home plan)**
5. Extend media router to accept PDFs.
6. Swap `fileUrl` URL field for file picker.

---

## 7. NOT building

- Auto-generated annual report from DB data.
- Per-document analytics / download tracking.
- Versioned documents (uploading a new file just replaces the URL).

---

## 8. Open questions

1. Should Stats be a shared singleton across Home + Impact, or duplicated per page (per § 2 note)?
2. PDF size cap — 25 MB enough, or expect bigger audit packets?
3. Do we want a public download counter / "last updated" timestamp per document?
