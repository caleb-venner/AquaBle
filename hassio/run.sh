#!/usr/bin/with-contenv bashio
# shellcheck shell=bash
set -e

# Get configuration options from Home Assistant
AUTO_RECONNECT=$(bashio::config 'auto_reconnect')
AUTO_DISCOVER=$(bashio::config 'auto_discover')
STATUS_WAIT=$(bashio::config 'status_wait_seconds')
TIMEZONE=$(bashio::config 'timezone')

# Set environment variables based on options
export AQUA_BLE_AUTO_RECONNECT="${AUTO_RECONNECT}"
export AQUA_BLE_AUTO_DISCOVER="${AUTO_DISCOVER}"

if bashio::config.has_value 'status_wait_seconds'; then
    export AQUA_BLE_STATUS_WAIT="${STATUS_WAIT}"
fi

# Handle timezone setting
if [ "${TIMEZONE}" = "auto" ] || [ -z "${TIMEZONE}" ]; then
    # Try to get timezone from Home Assistant
    if bashio::config.exists 'timezone'; then
        HA_TIMEZONE=$(bashio::info.timezone)
        if [ -n "${HA_TIMEZONE}" ]; then
            export AQUA_BLE_DISPLAY_TIMEZONE="${HA_TIMEZONE}"
            bashio::log.info "Using Home Assistant timezone: ${HA_TIMEZONE}"
        fi
    fi
else
    export AQUA_BLE_DISPLAY_TIMEZONE="${TIMEZONE}"
    bashio::log.info "Using configured timezone: ${TIMEZONE}"
fi

# Ensure Bluetooth is available
if ! command -v hciconfig &> /dev/null; then
    bashio::log.warning "Bluetooth tools not found, some functionality may be limited"
else
    bashio::log.info "Bluetooth available"
fi

# Log startup information
bashio::log.info "Starting AquaBle service..."
bashio::log.info "Auto-reconnect: ${AUTO_RECONNECT}"
bashio::log.info "Auto-discover: ${AUTO_DISCOVER}"
bashio::log.info "Status wait: ${STATUS_WAIT}s"
bashio::log.info "Config directory: ${AQUA_BLE_CONFIG_DIR}"

# Start the service
bashio::log.info "Launching uvicorn on port 8000..."
exec python3 -m uvicorn aquable.service:app \
    --host "${AQUA_BLE_SERVICE_HOST}" \
    --port "${AQUA_BLE_SERVICE_PORT}" \
    --no-access-log
