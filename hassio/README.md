# Home Assistant Add-on: AquaBle

Manage your Chihiros aquarium devices (dosers, lights) directly from Home Assistant via Bluetooth LE.

## About

AquaBle is a Home Assistant add-on that provides comprehensive control of Chihiros aquarium devices over Bluetooth LE:

- **Doser Pumps**: Monitor and control dosing schedules, track lifetime totals
- **LED Lights**: Control color channels, brightness, and lighting schedules
- **Status Monitoring**: Real-time device status, battery levels, error reporting
- **Device Management**: Scan, connect, and manage multiple devices

## Features

✅ **Multi-device support** - Control multiple dosers and lights simultaneously
✅ **Persistent configurations** - Device settings saved locally
✅ **Web interface** - Built-in dashboard at `http://homeassistant.local:8000`
✅ **REST API** - Full API for automation and integrations
✅ **Auto-reconnect** - Automatically reconnect to cached devices on startup
✅ **Status caching** - Real-time device status updates

## Installation

### Prerequisites

- Home Assistant 2024.1 or later
- Bluetooth adapter (supported by Home Assistant)
- Chihiros device with Bluetooth

### Method 1: Official Add-on Store (Coming Soon)

Once available, install directly from **Settings** → **Add-ons & Backups** → **Add-on Store**

### Method 2: Custom Repository

1. Go to **Settings** → **Add-ons & Backups** → **Add-on Store** → **⋮**
2. Select **Repositories**
3. Add: `https://github.com/caleb-venner/aquable-addons`
4. Search for **AquaBle** in the Add-on Store
5. Click **Install**

### Method 3: Manual Installation (Development)

```bash
ssh root@homeassistant.local
cd /usr/share/hassio/addons/local
git clone https://github.com/caleb-venner/aquable.git
cp -r aquable/hassio/ ./aquable-addon/
```

Then in Home Assistant UI: **Settings** → **Add-ons & Backups** → **⋮** → **Reload**

## Configuration

### Basic Configuration

```yaml
log_level: INFO
auto_discover: false
auto_reconnect: true
service_host: "0.0.0.0"
service_port: 8000
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `log_level` | string | `INFO` | Logging level (TRACE/DEBUG/INFO/WARNING/ERROR/CRITICAL) |
| `auto_discover` | boolean | `false` | Auto-scan for devices on startup |
| `auto_reconnect` | boolean | `true` | Reconnect to cached devices |
| `service_host` | string | `0.0.0.0` | HTTP server bind address |
| `service_port` | integer | `8000` | Web interface port (8000-65535) |

## Usage

1. **Start the add-on:**
   - Go to **Settings** → **Add-ons & Backups** → **AquaBle**
   - Click **Start**

2. **Access web interface:**
   - Click **Open Web UI**, or
   - Visit `http://homeassistant.local:8000`

3. **Scan for devices:**
   - Click **Scan for Devices** button
   - Wait for scan to complete
   - Select devices to connect

## API Reference

**Base URL:** `http://homeassistant.local:8000`

### Device Operations

- `GET /api/devices` - List all devices
- `GET /api/devices/{address}` - Get device details
- `POST /api/devices/{address}/command` - Send command to device
- `GET /api/scan?timeout=5` - Scan for new devices

### Configuration Management

- `GET /api/configurations/dosers` - List doser configurations
- `GET /api/configurations/lights` - List light configurations
- `POST /api/configurations/dosers` - Create doser configuration
- `POST /api/configurations/lights` - Create light configuration

### Status

- `GET /api/status` - System status
- `GET /api/health` - Health check
- `GET /api/configurations/summary` - Configuration summary

## Supported Devices

- Chihiros 4 Head Dosing Pump
- Chihiros LED A2
- Chihiros WRGB II (all variants)
- Chihiros Tiny Terrarium Egg
- Chihiros C II (RGB, White)
- Chihiros Universal WRGB
- Chihiros Z Light TINY
- Other Chihiros Bluetooth-enabled devices (likely compatible)

## Troubleshooting

### Add-on won't start

- Check logs: **Settings** → **Add-ons & Backups** → **AquaBle** → **Logs**
- Verify Bluetooth is available in **Settings** → **Devices & Services** → **Bluetooth**
- Check disk space availability

### Devices not scanning

- Ensure Bluetooth adapter is working: `hciconfig` in HA terminal
- Move device closer to adapter
- Verify device Bluetooth is enabled

### Connection timeout

- Reduce environmental interference (other 2.4GHz devices)
- Move closer to Bluetooth adapter
- Increase scan timeout value

### Permission denied errors

- Add-on requires Bluetooth capability (automatic)
- Restart add-on if permissions changed

## Data Persistence

Device configurations, metadata, and status are automatically saved to `/data`, which persists across restarts and updates.

## Performance

- **Memory:** ~150-250MB with multiple devices
- **CPU:** Low usage, spikes during scanning
- **Network:** Minimal, local Bluetooth only

## Support

- **Documentation:** [GitHub Project](https://github.com/caleb-venner/aquable)
- **Issues:** [GitHub Issues](https://github.com/caleb-venner/aquable/issues)
- **Discussions:** [GitHub Discussions](https://github.com/caleb-venner/aquable/discussions)

## Legal

This add-on is not affiliated with Chihiros or its parent company. It is an independent, open-source project created through reverse engineering.

See [LICENSE](../LICENSE) for full license information.
