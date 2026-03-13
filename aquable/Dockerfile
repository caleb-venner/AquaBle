# Multi-stage build for Home Assistant add-on
ARG BUILD_FROM=ghcr.io/home-assistant/amd64-base-python:3.13-alpine3.21

# Frontend is pre-built locally and copied directly

# Main add-on image
FROM ${BUILD_FROM}

# Set working directory
WORKDIR /app

ARG AQUA_BLE_VERSION

# Copy pre-built frontend artifacts
COPY frontend/dist /app/frontend/dist

# Copy Python source code
COPY src /app/src
COPY pyproject.toml /app/

# Install system dependencies for Bluetooth support and healthcheck
RUN apk add --no-cache \
    bluez \
    dbus \
    py3-pip \
    curl

RUN if [ -n "${AQUA_BLE_VERSION}" ]; then \
    python3 - <<'PY'
import os
import re
from pathlib import Path

version = os.environ.get("AQUA_BLE_VERSION", "").strip()
path = Path("/app/pyproject.toml")
text = path.read_text(encoding="utf-8")
updated, matches = re.subn(r'^version = ".*"$', f'version = "{version}"', text, flags=re.MULTILINE)
if matches == 0:
    raise SystemExit("Version field not found in /app/pyproject.toml")
path.write_text(updated, encoding="utf-8")
print(f"Updated pyproject.toml version to {version}")
PY
  ; else \
    echo "AQUA_BLE_VERSION not set; using pyproject.toml version"; \
  fi
# Install Python dependencies
RUN python3 -m pip install --no-cache-dir --break-system-packages -e .

# Copy S6 service configuration
COPY rootfs/ /

# Ensure s6 scripts are executable
RUN chmod +x /etc/services.d/aquable/run /etc/services.d/aquable/finish

# Set environment variables
ENV PYTHONPATH=/app/src
ENV AQUA_BLE_FRONTEND_DIST=/app/frontend/dist

# Expose Ingress port only
EXPOSE 8099

# Health check on Ingress port
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8099/api/health || exit 1
