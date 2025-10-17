# Home Assistant Add-on Dockerfile
# Builds AquaBle from source for Home Assistant

ARG BUILD_FROM
FROM ${BUILD_FROM}

# Install system dependencies for Bluetooth LE support
RUN apk add --no-cache \
    bluez \
    bluez-deprecated \
    dbus \
    libglib \
    gcc \
    musl-dev \
    linux-headers

# Set working directory
WORKDIR /app

# Copy project files (from repository root context)
COPY pyproject.toml setup.cfg MANIFEST.in README.md ./
COPY src/ ./src/
COPY frontend/dist/ ./frontend/dist/

# Install Python package in development mode
RUN pip3 install --no-cache-dir -e .

# Set Home Assistant add-on environment defaults
ENV HASSIO=true \
    AQUA_BLE_CONFIG_DIR=/data \
    AQUA_BLE_FRONTEND_DIST=/app/frontend/dist \
    PYTHONPATH=/app/src

# Copy add-on startup script
COPY hassio/run.sh /
RUN chmod a+x /run.sh

# Expose the web interface port
EXPOSE 8000

# Health check for HA supervisor
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Labels for Home Assistant add-on system
LABEL \
    io.hass.name="AquaBle" \
    io.hass.description="Manage Chihiros aquarium devices via Bluetooth LE" \
    io.hass.arch="armhf|aarch64|amd64|armv7" \
    io.hass.type="addon" \
    io.hass.version="1.0.0"

# Default command
CMD ["/run.sh"]
