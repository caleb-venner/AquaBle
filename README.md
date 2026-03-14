# AquaBle

**Development build for AquaBle**
Home Assistant integration for Chihiros aquarium devices (LED lights and dosing pumps) via Bluetooth Low Energy.

## Installation

### HACS (Recommended)

1. Add custom repository: `https://github.com/caleb-venner/AquaBle-dev`
2. Category: Integration
3. Download and restart Home Assistant
4. Add integration via UI: Settings → Devices & Services → Add Integration → AquaBle

### Manual

Copy `custom_components/aquable` to your Home Assistant `config/custom_components/` directory and restart.

## Supported Devices

- **Dosers**: Chihiros Doser series
- **Lights**: WRGB series, Commander series, A2, C2, Z-Light Tiny, and more

## Services

Control devices via Home Assistant services:

- `aquable.doser_set_head_schedule` - Configure pump schedules
- `aquable.light_set_manual_mode` - Set manual brightness
- `aquable.light_set_auto_schedule` - Add auto schedules
- `aquable.light_set_mode` - Switch modes (manual/auto/off)

## Legal
