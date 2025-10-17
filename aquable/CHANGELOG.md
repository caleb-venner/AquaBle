<!-- https://developers.home-assistant.io/docs/add-ons/presentation#keeping-a-changelog -->

## 2.0.0

- Restructured repository to follow Home Assistant add-on standards
- Renamed from Chihiros to AquaBle branding
- Migrated configuration paths from `~/.chihiros/` to `~/.aquable/`
- Added unified device storage with per-device JSON files
- Implemented global settings management (timezone, etc.)
- Added automatic migration from legacy state.json format
- Improved BLE command encoding with message ID management
- Enhanced error handling and connection stability
- Updated to Python 3.13 and Alpine 3.21 base images
- Added comprehensive REST API documentation
- Improved frontend with Zustand state management
- Added command queue with retry logic and optimistic updates

## 1.0.0

- Initial release
- Basic device discovery and control
- Web dashboard for device management
- REST API for automation
- Support for Chihiros lights and dosing pumps
