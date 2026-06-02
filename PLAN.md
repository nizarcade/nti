# NTI / Grace Bridge Initiative — Implementation Plan

> Public-facing nonprofit website for **Northern Transformation Initiative (NTI)**
> with its flagship program **Grace Bridge Initiative**. NGO-style, trust-first,
> mobile-friendly, with integrated donations (Stripe + PayPal).

---

## 1. Goals & Constraints

| Goal | Notes |
|------|-------|
| Trust-building NGO aesthetic | Clean, restrained, professional — not flashy |
| Mobile-first | All breakpoints down to 360px must work |
| Conversion-oriented | Every page has a clear Donate / Get Involved CTA |
| Accessibility (WCAG 2.1 AA) | Color contrast, alt text, keyboard nav, ARIA |
| Performance | Lighthouse ≥ 90 on mobile (LCP < 2.5s) |
| SEO | Static OG tags, sitemap, schema.org `NGO` markup |
| Compliance | Donor receipts, privacy policy, cookie consent |

---

## 2. Tech Stack

**Frontend** (this repo: `nti-bridge/`)
- **React 18 + TypeScript** (Vite)
- **MUI v5** (`@mui/material`, `@mui/icons-material`)
- **React Router v6** for client-side routing
- **TanStack Query** for any data fetching (donations API, content)
- **react-hook-form + zod** for forms (contact, volunteer, donation amount)
- **Emotion** (default with MUI) for styling
- **i18next** (optional — EN + SW for Kenyan audience)

**Backend** (lightweight donations + contact API)
- Reuse FastAPI pattern from `mchanga-api` OR a thin standalone service
- Endpoints: `POST /donations/intent`, `POST /donations/webhook`, `POST /contact`, `POST /volunteer`
- Postgres for donor records, contact submissions, volunteer signups
- SMTP (Postmark / SES) for receipt + thank-you emails

**Payments**
- **Stripe** — primary (Checkout Session + Webhooks for one-time & recurring)
- **PayPal** — secondary (Smart Buttons, optional)
- Both branded under a single "Donate" surface; provider chosen by donor

**Hosting / Infra**
- Frontend: Vercel or Netlify (static + edge)
- Backend: Fly.io / Render (Dockerized FastAPI)
- DNS: ntiafrica.org (apex + `www`)
- HTTPS via provider-managed certs
- Secrets via env (Stripe keys, PayPal client id, SMTP creds)

---

## 3. Project Structure

```
nti-bridge/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── public/
│   ├── favicon.svg
│   ├── og-image.png
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── theme.ts                 # MUI theme tokens (palette, typography)
│   ├── routes.tsx               # Centralized route table
│   ├── i18n/
│   │   ├── en.json
│   │   └── sw.json
│   ├── api/
│   │   ├── client.ts            # axios/fetch wrapper
│   │   ├── donations.ts
│   │   └── contact.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileDrawer.tsx
│   │   │   └── Layout.tsx
│   │   ├── ui/
│   │   │   ├── DonateButton.tsx
│   │   │   ├── SectionHeading.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── ImpactTile.tsx
│   │   │   ├── ProgramCard.tsx
│   │   │   ├── Quote.tsx
│   │   │   ├── BookCover.tsx
│   │   │   └── TrustBadges.tsx
│   │   ├── donate/
│   │   │   ├── DonationForm.tsx
│   │   │   ├── AmountPicker.tsx
│   │   │   ├── FrequencyToggle.tsx
│   │   │   ├── StripeCheckout.tsx
│   │   │   └── PaypalButtons.tsx
│   │   └── forms/
│   │       ├── ContactForm.tsx
│   │       └── VolunteerForm.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Programs.tsx
│   │   ├── GraceBridge.tsx
│   │   ├── TheProblem.tsx
│   │   ├── OurSolution.tsx
│   │   ├── ImpactTransparency.tsx
│   │   ├── GetInvolved.tsx
│   │   ├── Donate.tsx
│   │   ├── DonateSuccess.tsx
│   │   ├── DonateCancel.tsx
│   │   ├── Contact.tsx
│   │   ├── Leadership.tsx
│   │   ├── Books.tsx
│   │   ├── PrivacyPolicy.tsx
│   │   ├── Terms.tsx
│   │   └── NotFound.tsx
│   ├── content/
│   │   ├── home.ts              # Static copy as typed constants
│   │   ├── programs.ts
│   │   ├── impactStats.ts
│   │   └── leadership.ts
│   ├── assets/
│   │   ├── images/
│   │   │   ├── hero/
│   │   │   ├── programs/
│   │   │   ├── leadership/
│   │   │   └── books/
│   │   └── logos/
│   ├── hooks/
│   │   └── useScrollToTop.ts
│   └── utils/
│       ├── format.ts            # currency, dates
│       └── seo.ts               # Helmet/meta helpers
└── tests/
    ├── e2e/                     # Playwright smoke tests
    └── unit/                    # vitest
```

---

## 4. Design System (MUI Theme)

**Palette** — quiet, dignified, hopeful.

| Token | Value | Use |
|-------|-------|-----|
| `primary.main` | `#1E5A8A` (deep trust blue) | Headers, primary buttons |
| `primary.dark` | `#143E63` | Hover states |
| `secondary.main` | `#C58A3F` (warm earth gold) | Donate CTA, accents |
| `success.main` | `#3F8A5C` | Success messages |
| `background.default` | `#FAFAF7` (warm white) | Page bg |
| `background.paper` | `#FFFFFF` | Cards |
| `text.primary` | `#1F2A37` | Body |
| `text.secondary` | `#52606D` | Subtle copy |
| `divider` | `#E5E7EB` | Hairlines |

**Typography**
- Headings: **Source Serif Pro** (or **Lora**) — serif for warmth & gravitas
- Body: **Inter** — neutral, highly legible
- Base size 16px; line-height 1.6; H1 ~2.5rem desktop / 2rem mobile

**Spacing**: MUI default 8px unit; section vertical padding `py: { xs: 6, md: 10 }`.

**Components** overrides (in `theme.ts`):
- `MuiButton`: `disableElevation`, larger touch target (44px min)
- `MuiContainer`: `maxWidth="lg"` default
- `MuiAppBar`: `position="sticky"`, white bg, subtle shadow on scroll
- `MuiCard`: rounded `borderRadius: 12`, subtle border instead of shadow

---

## 5. Routing & Pages

| Path | Page | Purpose |
|------|------|---------|
| `/` | `Home` | Headline, mission, hero CTA, impact stats, program teaser, donor tiers, quote |
| `/about` | `About` | History (since 2011), vision, mission, leadership preview, registration |
| `/about/leadership` | `Leadership` | Adan Muktar bio + board (TBA placeholders) |
| `/about/books` | `Books` | Memoirs of a Lost Boy, The Rebirth of a Nation |
| `/programs` | `Programs` | Overview: Education, Livelihood, Youth |
| `/programs/grace-bridge` | `GraceBridge` | Flagship program detail |
| `/programs/grace-bridge/problem` | `TheProblem` | Teen pregnancy, poverty, housing insecurity |
| `/programs/grace-bridge/solution` | `OurSolution` | Housing, healthcare, nutrition, skills, reintegration |
| `/impact` | `ImpactTransparency` | Annual reports, financials, compliance docs |
| `/get-involved` | `GetInvolved` | Donate / Partner / Volunteer hub |
| `/donate` | `Donate` | Donation form (amount, frequency, provider) |
| `/donate/success` | `DonateSuccess` | Post-Stripe redirect |
| `/donate/cancel` | `DonateCancel` | Stripe cancel return |
| `/contact` | `Contact` | Contact form + offices |
| `/privacy` | `PrivacyPolicy` | Required for Stripe/PayPal |
| `/terms` | `Terms` | Donor terms |
| `*` | `NotFound` | 404 |

---

## 6. Page-by-Page Content Outline

### 6.1 Home
1. **Hero** — full-width image (Kenya landscape / families), overlay with:
   - H1: *"Restoring Dignity. Expanding Opportunity."*
   - Sub: brief mission line
   - Primary CTA `Donate`, secondary `Learn About Grace Bridge`
2. **Mission band** — 1-paragraph mission + 3 pillars (Education, Maternal Support, Livelihoods) as icon cards
3. **Grace Bridge teaser** — image left, copy right, "Learn more →"
4. **Impact stats strip** — `20,000+ families`, `Since 2011`, `Programs in Kenya`
5. **Donor tiers** — $25, $50, $100 cards with "Give now"
6. **Quote** — Adan's school sanctuary quote, attributed
7. **Final CTA band** — Donate / Partner / Volunteer triad

### 6.2 About NTI
- History (Founded Feb 10, 2011 · Nairobi HQ)
- Vision & Values
- Leadership preview (link to `/about/leadership`)
- Registration status placeholder (Registration No: `_____`)
- Trust badges (Kenya NGO Board, US 501(c)(3) when available)

### 6.3 Leadership
- Adan Muktar — Founder & ED — photo, bio, contact line, link to books
- Program Director — *To Be Announced* (placeholder card)
- Board of Directors — placeholder grid (TBA)

### 6.4 Books
- `Memoirs of a Lost Boy` with cover + Amazon link
- `The Rebirth of a Nation` with cover (link TBA)
- Author quote block

### 6.5 Programs (overview)
- 3 program cards: Education, Livelihood & Empowerment, Youth & Community
- Each links to a section anchor or future detail page

### 6.6 Grace Bridge Initiative
- Hero with program name + tagline ("Structured compassion")
- "Inspired by Grace Rosado" section with attribution
- What we provide (7-bullet list with icons)
- Links to `/problem` and `/solution` sub-pages
- Donor CTA at bottom

### 6.7 The Problem
- Stats on teen pregnancy in Kenya (cite sources)
- Poverty / housing insecurity
- Need for structured support
- Use `Accordion` or alternating image+text rows

### 6.8 Our Solution
- 5 pillars as cards: Safe Housing, Healthcare, Nutrition, Skills Training, Reintegration
- Each with icon + 2-3 sentence description

### 6.9 Impact & Transparency
- Headline stats
- Annual reports — downloadable PDFs (Table / list)
- Financial summary (latest year)
- Compliance documents (registration certificates)
- "Why your gift matters" narrative block

### 6.10 Get Involved
- Three columns: **Donate**, **Partner** (corporate/church), **Volunteer**
- Volunteer form (name, email, skills, location)
- Partnership inquiry → routes to contact form with subject

### 6.11 Donate
**Most important page.** See §7 below.

### 6.12 Contact
- Kenya office: P.O. Box 14271-00100 Nairobi · info@ntiafrica.org · +254 728 979 121
- US office: Boston, MA · 646-997-016
- Contact form (name, email, subject, message) → backend
- Embedded map (optional, lazy-loaded)

---

## 7. Donation System

### 7.1 UX Flow
1. Donor lands on `/donate` (or clicks any `DonateButton`)
2. Selects **Frequency**: One-time / Monthly
3. Selects **Amount**: preset tiles ($25 / $50 / $100 / $250 / $500 / $1,000) + custom input
4. Selects **Designation** (optional dropdown): General / Grace Bridge / Education / Livelihoods
5. Selects **Provider**: Stripe (card, Apple/Google Pay) or PayPal
6. Enters name + email
7. Redirected to Stripe Checkout OR opens PayPal modal
8. On success → `/donate/success` with receipt note; backend emails receipt
9. On cancel → `/donate/cancel` with retry CTA

### 7.2 Stripe Integration
- **Stripe Checkout** (hosted) — fastest path, PCI scope minimal
- Backend `POST /api/donations/intent` creates a Checkout Session:
  - `mode: "payment"` for one-time, `mode: "subscription"` for monthly (uses a recurring Price)
  - `success_url`, `cancel_url`
  - Metadata: `designation`, `donor_name`, `frequency`
- Webhook `POST /api/donations/webhook` handles:
  - `checkout.session.completed` → persist Donation row, send receipt email
  - `invoice.payment_succeeded` (recurring) → log recurring payment
  - `customer.subscription.deleted` → mark inactive
- Idempotency via Stripe event id

### 7.3 PayPal Integration
- **PayPal JS SDK** with Smart Buttons (`@paypal/react-paypal-js`)
- Client creates order via backend `POST /api/donations/paypal/create`
- On approve → backend `POST /api/donations/paypal/capture` captures + persists
- Subscriptions via PayPal Plans (separate flow)

### 7.4 Data Model (backend)
```sql
donations (
  id uuid pk,
  provider text,            -- 'stripe' | 'paypal'
  provider_ref text unique, -- session_id / order_id
  donor_name text,
  donor_email text,
  amount_cents int,
  currency text default 'usd',
  frequency text,           -- 'one_time' | 'monthly'
  designation text,
  status text,              -- 'pending' | 'succeeded' | 'failed' | 'refunded'
  created_at timestamptz,
  raw jsonb
);
```

### 7.5 Compliance
- Privacy policy page (required by Stripe/PayPal)
- Cookie consent banner (only if analytics enabled)
- Receipt email contains: amount, date, EIN / registration #, "no goods/services provided"
- Refund policy linked in footer

---

## 8. Backend API (Sketch)

```
POST /api/donations/intent          → { checkout_url }     [Stripe]
POST /api/donations/webhook         → 200 OK                [Stripe webhook]
POST /api/donations/paypal/create   → { order_id }
POST /api/donations/paypal/capture  → { status }
POST /api/contact                   → 202 Accepted
POST /api/volunteer                 → 202 Accepted
GET  /api/health                    → { status: "ok" }
```

All write endpoints rate-limited + reCAPTCHA-protected on public forms.

---

## 9. SEO / Performance

- **Meta tags** per route via `react-helmet-async`
- **Schema.org `NGO`** JSON-LD on Home (name, founder, address, sameAs)
- **Sitemap.xml** generated at build (vite-plugin-sitemap)
- **Open Graph** image for each major page
- **Image optimization**: AVIF/WebP with `<picture>`, lazy-load below fold
- **Code splitting**: route-level `React.lazy` for non-Home routes
- **Fonts**: self-hosted, `font-display: swap`
- **Analytics**: Plausible (privacy-friendly) or GA4 with consent

---

## 10. Accessibility

- Landmark regions (`<header>`, `<nav>`, `<main>`, `<footer>`)
- Skip-to-content link
- All images have meaningful `alt`
- Form fields with associated labels + error text
- Focus rings preserved
- Color contrast ≥ 4.5:1
- Tested with axe-core + keyboard-only run

---

## 11. Content Management

**Phase 1 (MVP)**: copy lives in typed TS files under `src/content/` — fast, no CMS overhead.

**Phase 2 (later)**: migrate to a headless CMS (Sanity / Strapi / Decap) if non-devs need to edit content. Defer until needed.

---

## 12. Testing Strategy

| Layer | Tool | What |
|-------|------|------|
| Unit | Vitest + React Testing Library | Components, utils |
| E2E | Playwright | Home → Donate → Stripe test mode → success |
| Visual | Optional: Chromatic | Component regressions |
| Lighthouse CI | GH Action | Perf/a11y budgets on PR |

---

## 13. Implementation Phases

### Phase 0 — Scaffold (Day 1)
- `npm create vite@latest nti-bridge -- --template react-ts`
- Install MUI, Router, Emotion, react-helmet-async, axios, react-hook-form, zod
- Set up `theme.ts`, `Layout`, `Header`, `Footer`, `routes.tsx`
- Placeholder pages with TODOs

### Phase 1 — Static Site (Week 1)
- Implement Home, About, Programs, Grace Bridge, Problem, Solution, Contact (static form)
- Real copy from this brief, placeholder images
- Mobile responsiveness pass
- Accessibility pass

### Phase 2 — Donations (Week 2)
- Backend skeleton (FastAPI) with donations + webhook
- Stripe Checkout one-time + monthly
- Donate page UI
- Receipt email
- Privacy + Terms pages

### Phase 3 — PayPal & Polish (Week 3)
- PayPal Smart Buttons + capture flow
- Volunteer + Contact form backend wiring
- Annual reports / compliance doc downloads
- SEO meta + sitemap + JSON-LD
- Lighthouse / a11y fixes

### Phase 4 — Launch
- Domain DNS, HTTPS, prod env vars
- Stripe live mode (after activation)
- Analytics + uptime monitoring (UptimeRobot / Better Stack)
- Final QA on real devices

---

## 14. Open Questions / To Confirm

- [ ] Confirm legal entity name: "Northern Transformation Initiative" (the brief opens with "NTI (full legal name)" — clarify expansion)
- [ ] Specific Kenyan county for Grace Bridge operations
- [ ] Registration No. (Kenya NGO Board) — for footer + compliance page
- [ ] U.S. 501(c)(3) status — affects tax-deductibility messaging
- [ ] EIN (if US nonprofit) for donor receipts
- [ ] Final book cover assets (2 images)
- [ ] Photos: hero, programs, leadership headshot of Adan
- [ ] Board of Directors names (currently TBA)
- [ ] Annual report PDFs to publish
- [ ] Preferred currency: USD primary, KES secondary?
- [ ] Phone number format: `646-997-016` appears short — confirm full US number
- [ ] Domain: `ntiafrica.org` confirmed?

---

## 15. Next Step

Approve this plan, then I'll scaffold Phase 0 (Vite + MUI + routing + layout shell) in `nti-bridge/`.
