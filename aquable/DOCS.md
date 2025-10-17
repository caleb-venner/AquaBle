# Home Assistant Add-on: AquaBle

## How to use

This add-on provides control over Chihiros aquarium lights and dosing pumps using Bluetooth Low Energy. Once started, it will:

1. Automatically discover nearby Chihiros devices (if auto-discover is enabled)
2. Provide a web interface for device management at port 8000
3. Expose a REST API for automation and scripting

## Configuration

```yaml
auto_reconnect: true
auto_discover: true
status_wait_seconds: 1.5
timezone: "auto"
```

### Option: `auto_reconnect`

Automatically reconnect to previously known devices when they become available. This is useful when devices lose power or go out of range temporarily.

**Default**: `true`

### Option: `auto_discover`

Automatically scan for and connect to nearby Chihiros devices on startup when no devices are cached. This only runs once on first startup to avoid interrupting existing connections.

**Default**: `true`

### Option: `status_wait_seconds`

Time in seconds to wait for device status responses after sending commands. Adjust this based on your Bluetooth adapter speed and RF conditions.

- Lower values (0.5-1.0) provide faster responses but may miss status updates
- Higher values (2.0-5.0) ensure status capture but slow down operations

**Default**: `1.5`

### Option: `timezone`

Display timezone for device schedules and time-based operations.

- Set to `"auto"` to use Home Assistant's timezone
- Or specify a timezone like `"America/New_York"`, `"Europe/London"`, etc.

**Default**: `"auto"`

## Supported Devices

The add-on currently supports the following Chihiros devices:

### Lights
- Chihiros WRGB II / WRGB II Pro
- Chihiros LED A2
- Chihiros Tiny Terrarium Egg
- Chihiros C II (RGB, White)
- Chihiros Universal WRGB
- Chihiros Z Light TINY

### Dosers
- Chihiros 4 Head Dosing Pump

Other Chihiros models using the same BLE protocol may also work but are untested.

## Web Interface

Access the web dashboard at `http://homeassistant.local:8000` (or your Home Assistant IP address with port 8000).

The dashboard provides:
- Device discovery and connection management
- Manual brightness control for lights
- Schedule management for automated lighting
- Dosing pump control and scheduling
- Real-time device status monitoring

## REST API

The add-on exposes a REST API for automation and integration with other systems:

### Device Management
- `GET /api/devices` - List all known devices
- `GET /api/scan` - Scan for nearby devices
- `POST /api/devices/{address}/connect` - Connect to a device
- `DELETE /api/devices/{address}` - Remove a device
- `GET /api/devices/{address}/status` - Get device status

### Light Control
- `POST /api/devices/{address}/brightness` - Set manual brightness
- `POST /api/devices/{address}/mode` - Switch between manual/auto mode
- `GET /api/devices/{address}/configurations` - Get schedules
- `POST /api/devices/{address}/configurations` - Create/update schedules

### Doser Control
- `POST /api/devices/{address}/dose` - Trigger manual dosing
- `GET /api/devices/{address}/configurations` - Get dosing schedules
- `POST /api/devices/{address}/configurations` - Create/update schedules

See the OpenAPI documentation at `http://homeassistant.local:8000/docs` for complete API details.

## Bluetooth Requirements

This add-on requires:
- A Bluetooth adapter with BLE support in your Home Assistant host
- Chihiros devices within Bluetooth range (typically 10-30 feet / 3-10 meters)
- No other applications actively connected to the same devices

The add-on will automatically handle Bluetooth permissions when run through Home Assistant Supervisor.

## Data Storage

Device configurations, schedules, and status information are stored in the add-on's data directory (`/data` inside the container, mapped to Home Assistant's add-on data storage). This ensures your settings persist across add-on restarts and updates.

## Troubleshooting

### Devices not discovered

- Ensure devices are powered on and within Bluetooth range
- Check that no other app (like the Chihiros mobile app) is connected to the devices
- Try restarting the Bluetooth adapter on your Home Assistant host
- Enable debug logging by setting `AQUA_BLE_LOG_LEVEL=DEBUG` in the add-on configuration

### Connection drops

- Increase `status_wait_seconds` to 2.0 or higher
- Ensure devices have stable power supply
- Reduce physical obstacles between Bluetooth adapter and devices
- Consider using a Bluetooth USB adapter with better antenna

### Status not updating

- Increase `status_wait_seconds` configuration value
- Check add-on logs for BLE communication errors
- Verify device firmware is up to date (via official Chihiros app)

### Web interface not accessible

- Confirm port 8000 is not blocked by firewall
- Check add-on logs for startup errors
- Verify the add-on is in "Started" state in Home Assistant

## Support

For issues, feature requests, or questions:

- Check the [GitHub repository](https://github.com/caleb-venner/aquable)
- Open an issue on [GitHub Issues](https://github.com/caleb-venner/aquable/issues)
- Visit the [Home Assistant Community Forums](https://community.home-assistant.io/)

## Legal Notice

This add-on is not affiliated with, endorsed by, or approved by Chihiros Aquatic Studio or Shanghai Ogino Biotechnology Co.,Ltd. This is an independent, open-source project developed through reverse engineering. Use at your own risk.
