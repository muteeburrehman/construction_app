# ==============================================================================
# Multi-stage Dockerfile — Eric Sherwood Construction
# Stage 1: Build Frontend SPA
# Stage 2: Python 3.12 Slim Runtime
# ==============================================================================

# STAGE 1: Frontend Build
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# STAGE 2: Python Backend Runtime
FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_SYSTEM_PYTHON=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install uv for fast dependency resolution
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Install Python dependencies
COPY backend/pyproject.toml backend/uv.lock* ./
RUN uv pip install --system -r pyproject.toml

# Copy backend code
COPY backend/ /app/backend/

# Copy built frontend assets to static root
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

WORKDIR /app/backend

# Create non-root user
RUN useradd -m -u 1000 appuser && \
    mkdir -p /app/backend/media /app/backend/staticfiles && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

CMD ["python", "-m", "gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2", "--timeout", "60"]
