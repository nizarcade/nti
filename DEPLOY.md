# Deploying NTI Bridge to a DigitalOcean Droplet

The production stack is a single `docker compose` project:

| Service | Port  | Exposure                                      |
| ------- | ----- | --------------------------------------------- |
| `web`   | `80`  | Public — nginx serves the SPA & proxies `/api` |
| `api`   | 8090  | Internal only (reached via `web` → `/api/*`)  |
| `db`    | 5432  | Internal only (Postgres 16)                   |

The browser always talks to a single origin (`http://your-domain`), so
there is **no CORS** to worry about in normal operation.

---

## 1. Create the droplet

1. Ubuntu 22.04 LTS, 1–2 vCPU / 2 GB RAM is plenty to start.
2. Add your SSH key during creation.
3. Open firewall ports `22`, `80` (and `443` once you add TLS). Block
   everything else — neither `5432` nor `8090` should be reachable from
   the internet.

```bash
ssh root@<droplet-ip>
adduser deploy && usermod -aG sudo deploy
rsync ~/.ssh/authorized_keys /home/deploy/.ssh/   # copy keys
ufw allow OpenSSH && ufw allow 80 && ufw enable
```

## 2. Install Docker + Compose

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker deploy
# log out / back in so the group takes effect
```

The plugin `docker compose` ships with the official `docker-ce` package.

## 3. Get the code on the droplet

```bash
sudo mkdir -p /opt/nti && sudo chown deploy:deploy /opt/nti
cd /opt/nti
git clone <your-repo-url> nti-bridge
cd nti-bridge
```

## 4. Configure secrets

Two env files are needed:

```bash
cp .env.production.example .env
nano .env                       # fill PUBLIC_WEB_URL, POSTGRES_PASSWORD, VITE_PAYPAL_CLIENT_ID

cp api/.env.example api/.env
nano api/.env                   # fill Stripe / PayPal / SMTP secrets
```

In `api/.env` the following keys are overridden by `docker-compose.yml`
and can be left blank or unchanged:

- `DATABASE_URL`
- `ALLOWED_ORIGINS`
- `PUBLIC_WEB_URL`

Set `PUBLIC_WEB_URL` in the root `.env` to the public URL the SPA will
be served from (`http://<droplet-ip>` while you are still on plain HTTP,
or `https://nti.example.com` once you have TLS).

## 5. Build & start

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f api
```

Visit `http://<droplet-ip>` — the React app should load, and any
network call from the browser goes to `http://<droplet-ip>/api/...`
which nginx proxies internally to `api:8090`.

Run database migrations (if/when you add Alembic to the API container):

```bash
docker compose exec api alembic upgrade head
```

## 6. Adding HTTPS (recommended)

The simplest path is a Caddy sidecar acting as the public-facing reverse
proxy with automatic Let's Encrypt certificates. Stop publishing port
`80` from the `web` service and let Caddy front everything:

```yaml
# add to docker-compose.yml
  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - web

volumes:
  caddy_data:
  caddy_config:
```

```caddy
# Caddyfile
nti.example.com {
    encode zstd gzip
    reverse_proxy web:80
}
```

Then change the `web` service to `expose: ["80"]` instead of publishing
the host port. Update `PUBLIC_WEB_URL=https://nti.example.com` in `.env`
and `docker compose up -d --force-recreate`.

## 7. Day-2 ops

```bash
make prod-logs           # tail all services
make prod-ps             # status
make prod-restart        # re-create api + web after .env changes
docker compose pull && docker compose up -d --build   # update
```

Backups: snapshot the `nti-db` and `nti-uploads` volumes (or run
`pg_dump` from inside the `db` container) on a schedule.
