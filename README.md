# Apex Construction Group — Turnkey Luxury Web Application

A production-quality web application and marketing platform for **Apex Construction Group**, high-end custom residential and commercial general contractor. In continuous business since 1998 (CSLB Lic. #849201). Features turnkey dynamic re-branding via the `/admin` executive portal.

---

## 1. Quickstart (Local Development)

Run the following commands to get both backend and frontend running:

```bash
# 1. Clone repository and install dependencies
cd backend && uv sync
cd ../frontend && npm install

# 2. Run backend database migrations
cd ../backend && uv run python manage.py migrate

# 3. Start development servers:
# Terminal A (Backend API):
cd backend && uv run python manage.py runserver 127.0.0.1:8000

# Terminal B (Frontend SPA with instant HMR):
cd frontend && npm run dev
```

- **Frontend App**: [http://localhost:5173/](http://localhost:5173/)
- **Design System & Styleguide**: [http://localhost:5173/styleguide](http://localhost:5173/styleguide)
- **Backend Health Check**: [http://localhost:8000/api/v1/health/](http://localhost:8000/api/v1/health/)
- **OpenAPI Schema & Swagger UI**: [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)

---

## 2. Quality Gates & Verification

Run these commands before any commit or section handoff:

```bash
# Backend linting & formatting (Ruff line-length: 100)
cd backend && uv run ruff check .
cd backend && uv run ruff format --check .

# Backend test suite (pytest + pytest-django)
cd backend && uv run pytest

# Frontend typecheck, lint & production build
cd frontend && npm run typecheck
cd frontend && npm run lint
cd frontend && npm run build
```

---

## 3. Brand Direction & Design Tokens

Designed for a multi-decade Napa Valley builder: built, not decorated. Stone, steel, glass, vineyard green, and daylight.

| Token | Hex | Role |
| :--- | :--- | :--- |
| `ink` | `#121713` | Deep green-black background, primary type on bone |
| `ink-2` | `#1C231C` | Secondary dark, cards in dark mode, footer |
| `bone` | `#EFEBE2` | Warm paper background, high-contrast text on ink |
| `stone` | `#DCD7CB` | Limestone neutral, borders, callout cards |
| `vine` | `#3F5140` | Vineyard green accent, environmental tone |
| `cab` | `#6B2231` | Cabernet accent for primary CTAs and active indicators |
| `slate` | `#6E7169` | Secondary text, captions, metadata |

- **Display Typography**: Self-hosted `Archivo` (600/800, tight negative tracking).
- **Body Typography**: Self-hosted `Source Serif 4` (400/600, max measure 68ch).

---

## 4. Architecture & VPS Deployment (Zero-Build-Overhead)

To avoid high CPU and RAM usage spikes on shared servers hosting other applications:
- **Build Off-Server**: Build Docker images locally or via GitHub Actions CI and push to Docker Hub (`muteebu007/construction-app:latest`).
- **Server Only Pulls**: The production server only runs:
  ```bash
  docker compose -f docker-compose.prod.yml pull
  docker compose -f docker-compose.prod.yml up -d
  ```
- **Hard Resource Limits**: Container memory is capped at 300MB (`mem_limit: 300M`) so existing containers on the VPS never experience OOM crashes.
