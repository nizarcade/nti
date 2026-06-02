SHELL := /bin/bash

API_DIR := api
COMPOSE := docker compose -f docker-compose.dev.yml
PROD := docker compose -f docker-compose.yml

.PHONY: help \
        up dev down logs ps build restart recreate \
        api-restart web-restart proxy-restart \
        api-logs api-sh api-shell \
        web-logs web-sh web-install web-build web-typecheck \
        proxy-logs proxy-rebuild \
        db-shell db-tables \
        prod-up prod-down prod-build prod-logs prod-ps prod-restart prod-pull \
        clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS=":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

# ─── Full stack ─────────────────────────────────────────────────────────
up: ## Start full stack detached (api + web + proxy)
	$(COMPOSE) up --build -d
	@echo ""
	@echo "Stack up:"
	@echo "  Web   →  http://nti.localhost:3030"
	@echo "  API   →  http://api.nti.localhost:8090"
	@echo "  Logs  →  make logs"

dev: ## Start full stack in foreground (Ctrl+C to stop)
	$(COMPOSE) up --build

down: ## Stop full stack
	$(COMPOSE) down

restart: ## Recreate api, web, proxy (picks up .env changes)
	$(COMPOSE) up -d --force-recreate --no-deps api web proxy

recreate: ## Rebuild + recreate api, web, proxy
	$(COMPOSE) up -d --build --force-recreate api web proxy

api-restart: ## Recreate api (picks up .env changes)
	$(COMPOSE) up -d --force-recreate --no-deps api

web-restart: ## Recreate web
	$(COMPOSE) up -d --force-recreate --no-deps web

proxy-restart: ## Restart nginx proxy
	$(COMPOSE) restart proxy

logs: ## Tail api + web + proxy logs
	$(COMPOSE) logs -f api web proxy

ps: ## Show stack status
	$(COMPOSE) ps

build: ## Build all images
	$(COMPOSE) build

# ─── Backend (api) ──────────────────────────────────────────────────────
api-logs: ## Tail api logs
	$(COMPOSE) logs -f api

api-sh: ## Shell into api container
	$(COMPOSE) exec api bash

api-shell: ## Python REPL inside api container with app loaded
	$(COMPOSE) exec api python -c "from app.db import SessionLocal; from app import models; print('models:', [m for m in dir(models) if not m.startswith(\"_\")]); import code; code.interact(local={'S': SessionLocal, 'm': models})"

# ─── Frontend (web) ─────────────────────────────────────────────────────
web-logs: ## Tail web logs
	$(COMPOSE) logs -f web

web-sh: ## Shell into web container
	$(COMPOSE) exec web sh

web-install: ## npm install (host-side, for IDE / typecheck)
	npm install

web-build: ## Build the web app for production (host-side)
	npm run build

web-typecheck: ## tsc --noEmit (host-side)
	npm run typecheck

# ─── Proxy ──────────────────────────────────────────────────────────────
proxy-logs: ## Tail proxy logs
	$(COMPOSE) logs -f proxy

proxy-rebuild: ## Rebuild + recreate proxy (after editing nginx config)
	$(COMPOSE) up -d --force-recreate --build proxy

# ─── Database (Neon) helpers ────────────────────────────────────────────
db-tables: ## List rows-per-table in the configured database
	$(COMPOSE) exec api python -c "from app.db import SessionLocal; from app.models import Donation, ContactMessage, VolunteerSignup; \
		s = SessionLocal(); \
		print('donations:        ', s.query(Donation).count()); \
		print('contact_messages: ', s.query(ContactMessage).count()); \
		print('volunteer_signups:', s.query(VolunteerSignup).count())"

# ─── Production (single-host docker compose, e.g. DigitalOcean) ─────────
prod-build: ## Build production images (web on :80, api internal)
	$(PROD) build

prod-up: ## Start production stack detached
	$(PROD) up -d --build
	@echo ""
	@echo "Prod stack up:"
	@echo "  Public →  http://<server>:80   (proxy)"
	@echo "    /          → SPA (web container)"
	@echo "    /api/*     → FastAPI (api container, rate-limited)"
	@echo "    /uploads/* → FastAPI (campaign images)"

prod-down: ## Stop production stack (keeps volumes)
	$(PROD) down

prod-logs: ## Tail production logs
	$(PROD) logs -f --tail=200

prod-ps: ## Show production stack status
	$(PROD) ps

prod-restart: ## Recreate api + web + proxy (picks up .env changes)
	$(PROD) up -d --force-recreate --no-deps api web proxy

prod-proxy-restart: ## Recreate just the proxy (after editing prod.default.conf)
	$(PROD) up -d --force-recreate --no-deps --build proxy

prod-pull: ## Pull updated base images
	$(PROD) pull

# ─── Misc ───────────────────────────────────────────────────────────────
clean: ## Stop stack and remove web build artifacts
	$(COMPOSE) down || true
	rm -rf dist
