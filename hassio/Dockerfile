# Home Assistant Add-on Dockerfile for AquaBle
# This Dockerfile is optimized for Home Assistant Supervisor

ARG BUILD_FROM
FROM ${BUILD_FROM}

# Set shell
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Install system dependencies for Bluetooth and Python
RUN apk add --no-cache \
    bluez \
    bluez-deprecated \
    dbus \
    python3 \
    py3-pip \
    nodejs \
    npm \
    build-base \
    python3-dev \
    linux-headers \
    eudev-dev \
    libffi-dev \
    openssl-dev \
    cargo \
    rust

# Set working directory
WORKDIR /app

# Copy project files
COPY ../pyproject.toml ../setup.cfg ../MANIFEST.in ./
COPY ../src/ src/
COPY ../frontend/ frontend/

# Build frontend
WORKDIR /app/frontend
RUN npm ci && npm run build

# Install Python package
WORKDIR /app
RUN pip3 install --no-cache-dir --upgrade pip setuptools wheel && \
    pip3 install --no-cache-dir -e .

# Environment variables
ENV PYTHONPATH=/app/src
ENV AQUA_BLE_CONFIG_DIR=/data
ENV AQUA_BLE_FRONTEND_DIST=/app/frontend/dist
ENV AQUA_BLE_SERVICE_HOST=0.0.0.0
ENV AQUA_BLE_SERVICE_PORT=8000

# Copy run script
COPY run.sh /
RUN chmod a+x /run.sh

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8000/api/health || exit 1

# Run script
CMD ["/run.sh"]
