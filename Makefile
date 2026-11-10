DEV_COMPOSE = docker compose -p sunbrain_dev -f docker-compose-dev.yml
PROD_COMPOSE = docker compose -p sunbrain_prod -f docker-compose.yml
LEGACY_COMPOSE = docker compose -p sunbrainproject -f docker-compose.yml

.PHONY: help start dev up build rebuild down restart ps logs logs-backend logs-frontend logs-db prod-down legacy-down

help:
	@echo SunBrain commands:
	@echo   make start        Build and start the dev platform
	@echo   make up           Start dev containers
	@echo   make build        Rebuild dev images
	@echo   make rebuild      Rebuild dev images without cache
	@echo   make down         Stop dev containers, preserving data
	@echo   make restart      Restart dev platform
	@echo   make ps           Show dev container status
	@echo   make logs         Follow all dev logs
	@echo   make logs-backend Follow backend logs
	@echo   make logs-frontend Follow frontend logs
	@echo   make logs-db      Follow database logs
	@echo   make prod-down    Stop production compose stack
	@echo   make legacy-down  Stop old default-name compose stack

start dev:
	$(DEV_COMPOSE) up -d --build
	$(DEV_COMPOSE) ps

up:
	$(DEV_COMPOSE) up -d

build:
	$(DEV_COMPOSE) build backend frontend

rebuild:
	$(DEV_COMPOSE) build --no-cache backend frontend

down:
	$(DEV_COMPOSE) down --remove-orphans

restart: down start

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
