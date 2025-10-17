# Home Assistant Add-on: AquaBle

_Control Chihiros aquarium lights and dosing pumps over Bluetooth Low Energy._

![Supports aarch64 Architecture][aarch64-shield]
![Supports amd64 Architecture][amd64-shield]
![Supports armhf Architecture][armhf-shield]
![Supports armv7 Architecture][armv7-shield]

[aarch64-shield]: https://img.shields.io/badge/aarch64-yes-green.svg
[amd64-shield]: https://img.shields.io/badge/amd64-yes-green.svg
[armhf-shield]: https://img.shields.io/badge/armhf-yes-green.svg
[armv7-shield]: https://img.shields.io/badge/armv7-yes-green.svg

## About

AquaBle is a Home Assistant add-on that provides direct Bluetooth Low Energy control for Chihiros aquarium devices. It offers:

- **Automatic Device Discovery**: Find and connect to Chihiros lights and dosing pumps
- **Web Dashboard**: Modern interface for device management and control
- **REST API**: Full programmatic control for automation and integration
- **Persistent Configuration**: Device settings, schedules, and profiles saved automatically
- **Timezone Support**: Automatic timezone synchronization with Home Assistant

## Installation

1. Add this repository to your Home Assistant Supervisor:
   - Navigate to **Supervisor** → **Add-on Store** → **⋮** (menu) → **Repositories**
   - Add: `https://github.com/caleb-venner/aquable`

2. Install the **AquaBle** add-on from the store

3. Configure the add-on options as needed

4. Start the add-on

5. Access the web interface through the "Open Web UI" button or at `http://homeassistant.local:8000`

## Configuration

Example configuration:

```yaml
auto_reconnect: true
auto_discover: true
status_wait_seconds: 1.5
timezone: "auto"
```

For detailed configuration options and usage instructions, see [DOCS.md](DOCS.md).

## Supported Devices

### Lights
- Chihiros WRGB II / WRGB II Pro
- Chihiros LED A2
- Chihiros Tiny Terrarium Egg
- Chihiros C II (RGB, White)
- Chihiros Universal WRGB
- Chihiros Z Light TINY

### Dosers
- Chihiros 4 Head Dosing Pump

Other Chihiros models using the same BLE protocol may also work.

## Support

For help and support:

- Read the [documentation](DOCS.md)
- Check the [changelog](CHANGELOG.md) for version information
- Report issues on [GitHub](https://github.com/caleb-venner/aquable/issues)

## Legal Notice

This add-on is not affiliated with, endorsed by, or approved by Chihiros Aquatic Studio or Shanghai Ogino Biotechnology Co.,Ltd. This is an independent, open-source project. Use at your own risk.

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
