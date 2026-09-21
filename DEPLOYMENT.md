# Deployment Guide — Apex Construction Group (Platform)
## Multi-App Shared VPS Co-existence & Production Deployment

This guide explains how **Apex Construction Group** (`construction_app`) co-exists cleanly on your shared Hetzner VPS alongside **Muteeb Portfolio** (`muteeb-portfolio`) and **Victory Acres** (`victory_acres`), with zero port collisions and minimal server load.

---

## 1. VPS Port & Resource Allocation Matrix

| Application | Domain(s) | Host Port(s) | Compose Project Name | Docker Network | Memory Limit |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Muteeb Portfolio** | `muteeblabs.com`<br>`n8n.muteeblabs.uk`<br>`breed.muteeblabs.com` | `80:80`<br>`443:443`<br>`5678:5678` (n8n) | `muteeb-portfolio` | `edge`<br>`muteeb-edge` | Dynamic |
| **Victory Acres** | `victoryacres.muteeblabs.com`<br>`api.victoryacres.muteeblabs.com` | `9080:80`<br>`9443:443` | `victory_acres` | `victory_acres_net` | Hard-isolated |
| **Apex Construction Group** | `construction.muteeblabs.com` | **`8085:8000`** | `construction_app` | `construction_net` | **350MB (web) + 150MB (db)** |

> [!NOTE]
> By assigning **`8085`** to Construction App and giving it the project name `construction_app`, its containers, network, volumes, and ports are 100% isolated. It will never collide with Muteeb Portfolio, Victory Acres, or n8n.

---

## 2. Master Edge Proxy Setup (One-Time)

Because `muteeb-caddy` owns ports `80` and `443` on your VPS, you simply route `construction.muteeblabs.com` to `127.0.0.1:8085`.

### In your VPS Caddyfile (either `/etc/caddy/Caddyfile` on host or `muteeb_portfolio/deploy/Caddyfile`):
Add this block:

```caddy
# ── Apex Construction Group ──────────────────────────────────────────────
construction.muteeblabs.com {
	encode gzip zstd

	reverse_proxy 127.0.0.1:8085 {
		header_up Host {host}
		header_up X-Real-IP {remote_host}
		header_up X-Forwarded-For {remote_host}
		header_up X-Forwarded-Proto {scheme}
	}
}
```

Then reload Caddy:
```bash
sudo systemctl reload caddy
# Or if running muteeb-caddy container:
# docker exec muteeb-caddy caddy reload --config /etc/caddy/Caddyfile
```

---

## 3. Initial VPS Deployment (5 Minutes)

You **do not** need to clone the repository or install Node.js/Python on the VPS. You only need 2 files.

### Step 1: Create application folder on VPS
```bash
mkdir -p ~/construction-app && cd ~/construction-app
```

### Step 2: Create `docker-compose.prod.yml`
```bash
nano docker-compose.prod.yml
```
Paste:
```yaml
name: construction_app

services:
  web:
    image: ${DOCKER_IMAGE:-muteebu007/construction-app:latest}
    container_name: construction_web_prod
    restart: unless-stopped
    env_file: .env
    environment:
      - DJANGO_SETTINGS_MODULE=config.settings.prod
      - DATABASE_URL=postgres://${POSTGRES_USER:-eric_user}:${POSTGRES_PASSWORD:-eric_secret_napa_2026}@db:5432/${POSTGRES_DB:-eric_sherwood_db}
      - ALLOWED_HOSTS=${ALLOWED_HOSTS:-construction.muteeblabs.com,localhost,127.0.0.1}
    ports:
      - "${HOST_PORT:-8085}:8000"
    volumes:
      - media_volume:/app/backend/media
    depends_on:
      - db
    networks:
      - construction_net
    deploy:
      resources:
        limits:
          memory: 350M
          cpus: "0.75"

  db:
    image: postgres:16-alpine
    container_name: construction_db_prod
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-eric_sherwood_db}
      POSTGRES_USER: ${POSTGRES_USER:-eric_user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-eric_secret_napa_2026}
    volumes:
      - pgdata_prod:/var/lib/postgresql/data
    networks:
      - construction_net
    deploy:
      resources:
        limits:
          memory: 150M

volumes:
  media_volume:
    name: construction_media_volume
  pgdata_prod:
    name: construction_pgdata_prod

networks:
  construction_net:
    name: construction_net
```

### Step 3: Create `.env`
```bash
nano .env
```
Paste:
```env
DJANGO_SECRET_KEY=napa-valley-secret-key-prod-2026-secure-random
ALLOWED_HOSTS=construction.muteeblabs.com,localhost,127.0.0.1
HOST_PORT=8085
```

### Step 4: Pull and Start
```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

### Step 5: Seed Demo Content & Admin User (One-Time)
```bash
docker compose -f docker-compose.prod.yml exec web python manage.py seed_demo
docker compose -f docker-compose.prod.yml exec web python manage.py seed_admin_and_faq
```
* **Admin URL**: `https://construction.muteeblabs.com/admin`
* **Username**: `admin`
* **Password**: `admin123`

---

## 4. Daily Workflow (Whenever You Make Code Changes)

Whenever you make improvements to the code (frontend, backend, or styles):

### Step A: Push code to GitHub (Laptop)
```bash
git add .
git commit -m "Describe your changes"
git push origin main
```

### Step B: Build & Push Docker Image (Laptop)
```bash
docker build -t muteebu007/construction-app:latest .
docker push muteebu007/construction-app:latest
```
*(All heavy compiling happens on your laptop, keeping VPS CPU at 0%)*

### Step C: Update on VPS (1 Command)
```bash
cd ~/construction-app && docker compose -f docker-compose.prod.yml pull && docker compose -f docker-compose.prod.yml up -d
```
* Database migrations run automatically on startup.
* The frontend SPA and backend API update atomically with zero downtime.

---

## 5. Maintenance & Diagnostics

### View Live Logs
```bash
# Web application logs
docker compose -f docker-compose.prod.yml logs -f web

# Database logs
docker compose -f docker-compose.prod.yml logs -f db
```

### Check Container Status & Memory Usage
```bash
docker stats construction_web_prod construction_db_prod
```

### Database Backup
```bash
docker compose -f docker-compose.prod.yml exec db pg_dump -U eric_user eric_sherwood_db > backup_$(date +%Y%m%d).sql
```
