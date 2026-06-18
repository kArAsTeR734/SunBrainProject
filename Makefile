DEV_COMPOSE = docker compose -p sunbrain_dev -f docker-compose-dev.yml
PROD_COMPOSE = docker compose -p sunbrain_prod -f docker-compose.yml
LEGACY_COMPOSE = docker compose -p sunbrainproject -f docker-compose.yml

.PHONY: help dev up build rebuild restore-db db-restore down restart ps logs logs-backend logs-frontend logs-db prod-down legacy-down

help:
	@echo SunBrain commands:
	@echo   make dev          Start the dev platform
	@echo   make restore-db   Restore SunBrain_dev.backup into the dev database
	@echo   make up           Start dev containers
	@echo   make build        Rebuild dev backend/frontend images
	@echo   make rebuild      Rebuild dev backend/frontend images without cache
	@echo   make down         Stop dev containers
	@echo   make restart      Restart dev platform
	@echo   make ps           Show dev container status
	@echo   make logs         Follow all dev logs
	@echo   make logs-backend Follow backend logs
	@echo   make logs-frontend Follow frontend logs
	@echo   make logs-db      Follow database logs
	@echo   make prod-down    Stop production compose stack
	@echo   make legacy-down  Stop old default-name compose stack

dev:
	$(MAKE) up
	$(DEV_COMPOSE) ps

up:
	$(DEV_COMPOSE) up -d db
	$(DEV_COMPOSE) up -d backend
	$(DEV_COMPOSE) up -d frontend

build:
	$(DEV_COMPOSE) build backend frontend

restore-db db-restore:
	$(DEV_COMPOSE) up -d db
	$(DEV_COMPOSE) exec -T db sh -c "until pg_isready -U postgres -d postgres >/dev/null 2>&1; do sleep 1; done"
	$(DEV_COMPOSE) cp SunBrain_dev.backup db:/tmp/SunBrain_dev.backup
	$(DEV_COMPOSE) exec -T db psql -U postgres -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'SunBrain_dev' AND pid <> pg_backend_pid();"
	$(DEV_COMPOSE) exec -T db dropdb -U postgres --if-exists SunBrain_dev
	$(DEV_COMPOSE) exec -T db createdb -U postgres SunBrain_dev
	$(DEV_COMPOSE) exec -T db sh -c "if pg_restore --list /tmp/SunBrain_dev.backup >/dev/null 2>&1; then pg_restore --verbose --no-owner --no-acl -U postgres -d SunBrain_dev /tmp/SunBrain_dev.backup; else psql -v ON_ERROR_STOP=1 -U postgres -d SunBrain_dev -f /tmp/SunBrain_dev.backup; fi"
	$(DEV_COMPOSE) up -d backend frontend

down:
	$(DEV_COMPOSE) down --remove-orphans

restart: down dev

ps:
	$(DEV_COMPOSE) ps

logs:
	$(DEV_COMPOSE) logs -f --tail=200

logs-backend:
	$(DEV_COMPOSE) logs -f --tail=200 backend

logs-frontend:
	$(DEV_COMPOSE) logs -f --tail=200 frontend

logs-db:
	$(DEV_COMPOSE) logs -f --tail=200 db

prod-down:
	$(PROD_COMPOSE) down --remove-orphans

legacy-down:
	$(LEGACY_COMPOSE) down --remove-orphans
