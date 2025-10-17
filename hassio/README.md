# AquaBle Home Assistant Add-on

Control Chihiros aquarium lights and dosing pumps over Bluetooth Low Energy directly from Home Assistant.

## About

AquaBle is a lightweight network service that provides:

- **Device Discovery**: Automatically find nearby Chihiros devices
- **REST API**: Full control over lights, dosers, and schedules
- **Web Dashboard**: Modern interface for device management
- **Persistent Storage**: Configurations saved in Home Assistant data directory
- **Bluetooth Integration**: Direct BLE communication with aquarium devices

## Installation

1. Add this repository to your Home Assistant Supervisor:
   - Go to **Supervisor** → **Add-on Store** → **⋮** (top right) → **Repositories**
   - Add: `https://github.com/caleb-venner/aquable`

2. Install the **AquaBle** add-on from the store

3. Start the add-on and check the logs for any errors

4. Access the web interface at `http://homeassistant.local:8000` (or your HA IP address)

## Configuration

```yaml
auto_reconnect: true
auto_discover: true
status_wait_seconds: 1.5
timezone: "auto"
```

### Options

- **auto_reconnect** (boolean, default: `true`): Automatically reconnect to devices when they become available
- **auto_discover** (boolean, default: `true`): Automatically discover nearby Chihiros devices on startup
- **status_wait_seconds** (float, 0.5-5.0, default: `1.5`): Time to wait for device status responses after commands
- **timezone** (string, default: `"auto"`): Display timezone for schedules. Use "auto" to inherit from Home Assistant, or specify a timezone like "America/New_York"

## Supported Devices

- Chihiros 4 Head Dosing Pump
- Chihiros WRGB II / WRGB II Pro
- Chihiros LED A2
- Chihiros Tiny Terrarium Egg
- Chihiros C II (RGB, White)
- Chihiros Universal WRGB
- Chihiros Z Light TINY

Other Chihiros devices may also work but are untested.

## Usage

### Web Dashboard

Access the web interface at:
```
http://homeassistant.local:8000
```

The dashboard provides:
- Device discovery and pairing
- Manual control of lights and dosers
- Schedule configuration
- Device status monitoring

### REST API

The add-on exposes a REST API for integration with other services:

```bash
# Discover devices
curl http://homeassistant.local:8000/api/devices/discover

# Get device list
curl http://homeassistant.local:8000/api/devices

# Control a light (example)
curl -X POST http://homeassistant.local:8000/api/devices/{address}/command \
  -H "Content-Type: application/json" \
  -d '{"command": "manual_brightness", "channel": 1, "brightness": 50}'
```

See the full API documentation at `http://homeassistant.local:8000/docs`

## Troubleshooting

### Bluetooth Not Working

If devices are not discovered:
1. Ensure your Home Assistant host has Bluetooth support
2. Check that no other service is using the Bluetooth adapter
3. Verify devices are powered on and in range
4. Check add-on logs for connection errors

### Devices Not Persisting

Device configurations are stored in `/data` within the add-on. This is persisted by Home Assistant Supervisor. If devices disappear after restart:
1. Check add-on logs for storage errors
2. Verify the add-on has write permissions to `/data`

### Performance Issues

If the add-on is slow or unresponsive:
1. Reduce `status_wait_seconds` to 1.0 or lower
2. Disable `auto_discover` if you have many Bluetooth devices nearby
3. Check system resources (CPU/memory) in Home Assistant

## Support

- [GitHub Issues](https://github.com/caleb-venner/aquable/issues)
- [Documentation](https://github.com/caleb-venner/aquable)

## License

MIT License - See [LICENSE](https://github.com/caleb-venner/aquable/blob/main/LICENSE)

## Disclaimer

This project is not affiliated with, endorsed by, or approved by Chihiros Aquatic Studio. Use at your own risk.
