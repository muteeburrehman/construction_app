# ==============================================================================
# Apex Construction Group — Development & Operations Makefile
# ==============================================================================

.PHONY: help install dev-backend dev-frontend dev test lint format migrate makemigrations build clean docker-up docker-down prod-pull prod-up

help:
	@echo "Available commands:"
	@echo "  make install        Install backend (uv) and frontend (npm) dependencies"
	@echo "  make dev-backend    Start Django development server"
	@echo "  make dev-frontend   Start Vite frontend development server"
	@echo "  make test           Run backend pytest and frontend typecheck"
	@echo "  make lint           Run backend ruff check and frontend oxlint"
	@echo "  make format         Autoformat backend with ruff"
	@echo "  make migrate        Apply database migrations"
	@echo "  make makemigrations Generate new database migrations"
	@echo "  make build          Compile frontend production bundle"
	@echo "  make docker-up      Start local containers (db, web, caddy)"
	@echo "  make docker-down    Stop local containers"
	@echo "  make prod-pull      Pull pre-built image from registry on production VPS"
	@echo "  make prod-up        Start production container with memory bounds"

install:
	cd backend && uv sync
	cd frontend && npm install

dev-backend:
	cd backend && uv run python manage.py runserver 127.0.0.1:8000

dev-frontend:
	cd frontend && npm run dev

test:
	cd backend && uv run pytest
	cd frontend && npm run typecheck

lint:
	cd backend && uv run ruff check .
	cd frontend && npm run lint

format:
	cd backend && uv run ruff format .

migrate:
	cd backend && uv run python manage.py migrate

makemigrations:
	cd backend && uv run python manage.py makemigrations

build:
	cd frontend && npm run build

docker-up:
	docker compose up -d

docker-down:
	docker compose down

prod-pull:
	docker compose -f docker-compose.prod.yml pull

prod-up:
	docker compose -f docker-compose.prod.yml up -d
