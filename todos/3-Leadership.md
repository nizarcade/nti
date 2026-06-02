# Leadership Page CMS — Plan

Make the Leadership page admin-editable. Builds on the foundations in `Home-Todos.md` (single `page_content` table, slug-parameterized routes, icon registry, repeatable-list editor). This doc only covers what's specific to Leadership.

---

## 1. Inventory: what's on the Leadership page today

Source: `src/pages/Leadership.tsx`. Sections in order:

1. **Header** — eyebrow ("Leadership") + title.
2. **Featured leader card** — single highlighted leader (currently Adan Muktar): photo/avatar, name, role line, phone, two paragraphs of bio.
3. **"Voice born from experience" block** — eyebrow + title + intro paragraph + 2 pull-quotes (currently `adanQuote` + `adanQuote2` from `site.ts`).
4. **Leadership structure** — section title + list of officers/board (currently 3 cards: President & Director, Treasurer, Clerk).
5. **SEO** — title + description.

---

## 2. Data model

Reuse `page_content`. Insert row with `slug = "leadership"`.

**JSON schema** (Pydantic `LeadershipContent`):

```ts
type LeadershipContent = {
  seo: { title: string; description: string };
  intro: { eyebrow: string; title: string };
  featured: {
    enabled: boolean;
    name: string;
    role: string;                  // "Founder & Executive Director · Boston, Massachusetts"
    initials?: string;             // fallback when no photo
    photoUrl?: string;             // optional uploaded headshot
    phoneDisplay?: string;
    phoneTel?: string;
    paragraphs: string[];          // bio paragraphs, 1..n
  };
  voiceBlock: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    intro: string;
    quotes: Array<{ text: string; attribution?: string }>;
  };
  structure: {
    enabled: boolean;
    title: string;
    members: Array<{
      role: string;
      name: string;
      photoUrl?: string;           // optional, for v1.1
      bioShort?: string;           // optional
    }>;
  };
};
```

No new tables. No new columns.

---

## 3. Backend

Same slug-parameterized routes from the Home plan. Register `LeadershipContent` under `SCHEMA_BY_SLUG["leadership"]`. Seed migration inserts current literal values.

If headshots are wanted in v1, the media uploads work from `Home-Todos.md` § 4 is the dependency — otherwise `photoUrl` stays an editable URL field pointing into `/public/`.

---

## 4. Frontend — public site

- New: `src/content/leadershipDefaults.ts`.
- New: `src/hooks/useLeadershipContent.ts` (wraps the generic page-content hook).
- Refactor `src/pages/Leadership.tsx` to consume the hook. Layout unchanged.
- Avatar component falls back to `initials` when `photoUrl` is empty.

---

## 5. Frontend — admin

New page: `src/pages/admin/AdminLeadershipPage.tsx`. Route: `/admin/pages/leadership`. Add to "Site Content" sidebar group.

Section list: Intro, Featured Leader, Voice & Quotes, Leadership Structure, SEO.

Per-section forms:
- **Intro / SEO** — flat.
- **Featured Leader** — flat fields + photo picker + paragraph repeater (each paragraph is one textarea).
- **Voice & Quotes** — flat fields + quote repeater (textarea + optional attribution).
- **Leadership Structure** — repeatable list (role, name, optional photo, optional short bio) with drag-reorder. Reuses Home's repeatable-list component.

Save / Discard / Reset.

---

## 6. Build order

Assumes Home phases 1–2 are done.

**Phase 1 — Backend**
1. `LeadershipContent` Pydantic model + defaults.
2. Migration insert seeding the `leadership` row.

**Phase 2 — Public refactor**
3. `leadershipDefaults.ts`, `useLeadershipContent()`.
4. Refactor `Leadership.tsx`. Verify visual parity.

**Phase 3 — Admin UI**
5. `AdminLeadershipPage` shell + sidebar link.
6. Forms for Intro / SEO / Featured Leader / Voice & Quotes.
7. Leadership Structure repeater.

**Phase 4 (optional) — Headshots**
8. Wire photo picker for featured leader + board members (depends on media uploads from Home plan).

---

## 7. Deliberately NOT building

- Per-leader detail pages.
- Public bio routes (`/leadership/:slug`).
- Rich-text in bios — plain paragraphs are enough.
- Multi-language bios.

---

## 8. Open questions

1. Do we want real headshots in v1, or stay with initials avatars and add photos in v1.1?
2. Should the featured-leader slot allow multiple people (e.g. co-founders) or stay singular?
3. Should board members each have a public phone/email, or contact stays centralized?
