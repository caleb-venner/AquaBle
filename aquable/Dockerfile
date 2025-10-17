# Home Assistant Add-on Dockerfile for AquaBle
# https://developers.home-assistant.io/docs/add-ons/configuration#add-on-dockerfile

ARG BUILD_FROM
FROM ${BUILD_FROM}

# Set version for setuptools-scm
ARG SETUPTOOLS_SCM_PRETEND_VERSION_FOR_AQUABLE
ENV SETUPTOOLS_SCM_PRETEND_VERSION_FOR_AQUABLE=${SETUPTOOLS_SCM_PRETEND_VERSION_FOR_AQUABLE}

# Set shell
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Install system dependencies for Bluetooth and Node.js
# Python is already included in the base image
RUN apk add --no-cache \
    bluez \
    bluez-deprecated \
    dbus \
    nodejs \
    npm \
    gcc \
    musl-dev \
    linux-headers \
    wget

# Set working directory
WORKDIR /app

# Copy project files prepared in build context
COPY build/pyproject.toml build/setup.cfg build/MANIFEST.in ./
COPY build/src/ src/
COPY build/frontend/ frontend/

# Build frontend
WORKDIR /app/frontend
# Use npm ci when a lockfile exists for reproducible installs; fall back to npm install otherwise.
# This avoids build failures inside the add-on builder when package-lock.json is not present.
RUN if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then \
            npm ci; \
        else \
            npm install; \
        fi && npm run build

# Install Python package
WORKDIR /app
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -e .

# Environment variables
ENV PYTHONPATH=/app/src
ENV AQUA_BLE_CONFIG_DIR=/data
ENV AQUA_BLE_FRONTEND_DIST=/app/frontend/dist
ENV AQUA_BLE_SERVICE_HOST=0.0.0.0
ENV AQUA_BLE_SERVICE_PORT=8000

# Copy root filesystem
COPY rootfs /

# Ensure service scripts are executable
RUN chmod +x /etc/services.d/aquable/run /etc/services.d/aquable/finish

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8000/api/health || exit 1

# Labels
LABEL \
    io.hass.name="AquaBle" \
    io.hass.description="Control Chihiros aquarium lights and dosing pumps over Bluetooth Low Energy" \
    io.hass.type="addon" \
    io.hass.version="${SETUPTOOLS_SCM_PRETEND_VERSION_FOR_AQUABLE}"
