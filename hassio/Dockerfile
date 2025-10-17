# Home Assistant Add-on Dockerfile
# Uses official Home Assistant base image

ARG BUILD_FROM=ghcr.io/hassio-addons/base:14.1.1
FROM ${BUILD_FROM}

# Install system dependencies for Bluetooth LE support
RUN apk add --no-cache \
    bluez \
    libglib \
    dbus

# Install Python dependencies and the aquable package
RUN pip install --no-cache-dir \
    "aquable>=2.0.0"

# Set Home Assistant add-on environment
ENV HASSIO=true
ENV AQUA_BLE_CONFIG_DIR=/data

# Copy add-on startup script
COPY run.sh /
RUN chmod a+x /run.sh

# Health check for HA supervisor
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
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
