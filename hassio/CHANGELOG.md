# Changelog - AquaBle Home Assistant Add-on

All notable changes to this add-on will be documented in this file.

## [2.0.0] - 2025-10-17

### Added
- Initial Home Assistant add-on release
- Automatic device discovery over Bluetooth LE
- Web dashboard for device management
- REST API for device control
- Support for Chihiros lights and dosing pumps
- Persistent configuration storage
- Timezone configuration (auto or manual)
- Configurable auto-reconnect behavior
- Health check endpoint

### Features
- Multi-architecture support (armhf, armv7, aarch64, amd64, i386)
- Bluetooth integration with host D-Bus
- Network access for web interface
- Configurable status wait times

### Configuration Options
- `auto_reconnect`: Enable/disable automatic device reconnection
- `auto_discover`: Enable/disable automatic device discovery
- `status_wait_seconds`: Configure response wait time (0.5-5.0s)
- `timezone`: Set display timezone (auto or specific timezone)
