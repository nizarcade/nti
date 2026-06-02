# Books Page CMS — Plan

Make the Books page admin-editable. The page is essentially a list of books with cover + blurb + external link, so this is the simplest CMS surface on the site. Builds on `Home-Todos.md` foundations (single `page_content` table, slug-parameterized routes, media uploads).

---

## 1. Inventory: what's on the Books page today

Source: `src/pages/Books.tsx`. Sections in order:

1. **Header** — eyebrow + title + subtitle.
2. **Book grid** — N cards (currently 2). Each card has: cover (currently a gradient placeholder with an icon), title, blurb, optional external "View on Amazon" button.
3. **SEO** — title (description currently unset).

---

## 2. Data model

Reuse `page_content`. Insert row with `slug = "books"`.

**JSON schema** (Pydantic `BooksContent`):

```ts
type BooksContent = {
  seo: { title: string; description: string };
  intro: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  books: Array<{
    title: string;
    blurb: string;
    coverImageUrl?: string;        // optional uploaded cover; falls back to gradient placeholder
    ctaLabel?: string;             // defaults to "View on Amazon" when ctaUrl is set
    ctaUrl?: string;               // external link; button hidden when empty
    badge?: string;                // optional small label e.g. "New" or "Best-seller"
    order?: number;                // optional, defaults to array order
  }>;
};
```

No new tables. No new columns.

---

## 3. Backend

Slug-parameterized routes (already generalized in the Home plan). Register `BooksContent` under `SCHEMA_BY_SLUG["books"]`. Seed migration inserts the current two books as the initial `books` row.

Media uploads (from Home plan § 4) become a dependency only if admins should upload covers. If skipped for v1, `coverImageUrl` stays an editable URL field; the gradient placeholder renders when it's empty.

---

## 4. Frontend — public site

- New: `src/content/booksDefaults.ts`.
- New: `src/hooks/useBooksContent.ts`.
- Refactor `src/pages/Books.tsx` to consume the hook. Layout unchanged.
- Card cover renders `coverImageUrl` if present; otherwise keeps today's gradient + `MenuBookIcon`.

---

## 5. Frontend — admin

New page: `src/pages/admin/AdminBooksPage.tsx`. Route: `/admin/pages/books`. Add to "Site Content" sidebar group.

Section list: Intro, Books, SEO.

Per-section forms:
- **Intro / SEO** — flat.
- **Books** — repeatable list with drag-reorder (reuses Home's repeatable-list component). Per-row form: title, blurb (textarea), cover image picker (or URL input), CTA label, CTA URL, optional badge.

Save / Discard / Reset.

---

## 6. Build order

Assumes Home phases 1–2 are done.

**Phase 1 — Backend**
1. `BooksContent` Pydantic model + defaults.
2. Migration insert seeding the `books` row.

**Phase 2 — Public refactor**
3. `booksDefaults.ts`, `useBooksContent()`.
4. Refactor `Books.tsx`. Verify visual parity.

**Phase 3 — Admin UI**
5. `AdminBooksPage` shell + sidebar link.
6. Intro / SEO forms.
7. Books repeater + image picker (or URL field if no uploads in v1).

---

## 7. Deliberately NOT building

- Per-book detail pages (`/books/:slug`).
- Excerpts / sample chapters.
- Reviews / testimonials section.
- Purchase tracking or affiliate analytics.
- Multi-language editions.

---

## 8. Open questions

1. Upload covers, or stick with the gradient placeholder + URL field for v1?
2. Should the CTA support more than one link per book (Amazon + Apple Books + direct PDF)?
3. Do we want a separate "Coming soon" state for unreleased titles, or is omitting the CTA enough?
