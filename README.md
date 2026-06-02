# NTI Bridge

Donation + content site for **Northern Transformation Initiative (NTI)** and the **Grace Bridge Initiative**.

- **Frontend** — React 18 + TypeScript + Vite + MUI v5 ([src/](src/))
- **Backend** — FastAPI + SQLAlchemy 2 + Stripe + PayPal ([api/](api/))

See [PLAN.md](PLAN.md) for the full implementation plan.

---

## Local development

### Frontend
```bash
npm install
npm run dev     # http://localhost:3030
npm run build
npm run preview
```
Env: copy `.env.example` → `.env.local`. Required vars:
- `VITE_API_BASE_URL=http://localhost:8090`
- `VITE_PAYPAL_CLIENT_ID=<sandbox client id>`

### Backend
```bash
cd api
python -m venv .venv && . .venv/bin/activate
pip install -e .
cp .env.example .env   # then fill in Stripe + PayPal keys
uvicorn app.main:app --reload --port 8090
```

Health check: `curl http://localhost:8090/api/health`

---

## Donation flows

| Provider | One-time | Monthly |
|---|---|---|
| Stripe Checkout | payment mode | subscription mode, inline `price_data.recurring` |
| PayPal | v2/checkout/orders | v1/billing/subscriptions (auto-creates Plan on first use) |

### Stripe webhook (production-grade)
Local dev:
```bash
brew install stripe/stripe-cli/stripe
stripe login
stripe listen --forward-to localhost:8090/api/donations/webhook
```
Copy the printed `whsec_...` value into `api/.env` as `STRIPE_WEBHOOK_SECRET`. Without it, the API parses unverified events and logs a warning — fine for dev, **not for production**.

In production, register the webhook URL in your Stripe dashboard and store the secret in your hosting provider's env vars.

---

## API endpoints

| Method | Path | Purpose |
|---|---|---|
| GET  | `/api/health` | Health + config status |
| GET  | `/api/config` | Public keys for the frontend |
| POST | `/api/donations/intent` | Create Stripe Checkout Session |
| POST | `/api/donations/webhook` | Stripe webhook (verified) |
| POST | `/api/donations/paypal/create` | Create PayPal order or subscription |
| POST | `/api/donations/paypal/capture` | Capture PayPal one-time order |
| POST | `/api/contact` | Contact form |
| POST | `/api/volunteer` | Volunteer signup |

---

## Deployment

### Docker Compose (full stack: Postgres + API + nginx web)
```bash
# 1. Fill in api/.env with real keys
# 2. Export the PayPal client id for the web build arg
export VITE_PAYPAL_CLIENT_ID=...
docker compose build
docker compose up -d
# Web on :8080, API on :8090, Postgres on :5432
```

The API uses Postgres in this configuration (`DATABASE_URL=postgresql+psycopg://...`). SQLAlchemy creates tables on startup; for managed production migrations, layer Alembic on top.

### Hosted (recommended)
- **Frontend**: Vercel / Netlify / Cloudflare Pages — `npm run build` → serve `dist/`.
- **API**: Fly.io / Render / Railway — point to [api/Dockerfile](api/Dockerfile). Set env vars from [api/.env.example](api/.env.example). Use managed Postgres.
- **DNS / TLS**: point `ntiafrica.org` at the web host; CNAME `api.ntiafrica.org` to the API host.
- **Webhook**: register `https://api.ntiafrica.org/api/donations/webhook` in Stripe and update `STRIPE_WEBHOOK_SECRET`.

---

## Project structure
```
nti-bridge/
├── api/                   FastAPI service
│   ├── app/
│   │   ├── main.py        app + routers
│   │   ├── config.py      pydantic-settings
│   │   ├── db.py          SQLAlchemy engine + Base
│   │   ├── models.py      Donation, ContactMessage, VolunteerSignup
│   │   ├── schemas.py     pydantic IO models
│   │   ├── routers/       donations, paypal, contact, volunteer
│   │   └── services/      stripe_service, paypal_service, email
│   └── Dockerfile
├── docker/nginx.conf      SPA + security headers
├── docker-compose.yml     full-stack local stack
├── public/                favicon, robots.txt, sitemap.xml
└── src/                   React app
```

```
src/
├── api/                   typed fetch wrappers
├── components/
│   ├── donate/            PaypalButton (Smart Buttons + subscriptions)
│   ├── layout/            Header, Footer, MobileDrawer, Layout, ScrollToTop
│   └── ui/                DonateButton, SectionHeading, CtaBand, Seo, Logo
├── content/site.ts        typed copy (donor tiers, programs, stats, quotes)
├── pages/                 18 pages including /volunteer
├── App.tsx                routes + GlobalNgoJsonLd
└── theme.ts               MUI theme (trust-blue / warm-gold, Lora + Inter)
```

## Scripts (frontend)
- `dev` — Vite dev server with HMR on :3030
- `build` — typecheck + production build to `dist/`
- `preview` — serve the production build
- `typecheck` — `tsc --noEmit`

## Path alias
`@/*` → `src/*` (in [tsconfig.json](tsconfig.json) and [vite.config.ts](vite.config.ts)).
