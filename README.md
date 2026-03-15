# AquaBle

**Home Assistant integration for Chihiros aquarium devices (LED lights and dosing pumps) via Bluetooth Low Energy.**

Control your Chihiros equipment directly from Home Assistant with automatic discovery and native UI support.

## Features

- **Bluetooth Discovery**: Automatically discovers Chihiros devices in range.
- **Doser Control**: Monitor dosing volumes, set schedules, and track lifetime usage.
- **Light Control**: Adjust brightness per color channel, switch between manual/auto modes.
- **Native Integration**: Built as a Home Assistant custom component with full UI support.

## Supported Devices

### Dosing Pumps
- Chihiros Doser series

### LED Lights
- **WRGB Series**: WRGB, WRGB II, WRGB II Pro, WRGB II Slim
- **Commander Series**: Commander 1, Commander 4
- **Other Models**: A2, C2, C2 RGB, Z-Light Tiny, Universal WRGB, Tiny Terrarium Egg

## Installation

### Via HACS (Recommended)

1. Open **HACS** in your Home Assistant instance.
2. Go to **Integrations**.
3. Click the **⋮** menu in the top-right corner and select **Custom repositories**.
4. Add this repository URL: `https://github.com/caleb-venner/AquaBle`
5. Select category: **Integration** and click **Add**.
6. Find **AquaBle** in the integration list and click **Download**.
7. Restart Home Assistant.

### Manual Installation

1. Download the latest release.
2. Copy the `custom_components/aquable` folder to your Home Assistant `config/custom_components/` directory.
3. Restart Home Assistant.

## Configuration

1. Go to **Settings** → **Devices & Services**.
2. Click **+ Add Integration** and search for **AquaBle**.
3. Select your device from the discovered Bluetooth devices (or enter the MAC address manually).
4. Complete the setup wizard.

## Entities & Services

### Doser Entities (per pump head)
- **Sensors**: Today's volume, daily target, schedule time, lifetime total.
- **Services**: `aquable.doser_set_head_schedule` (Configure dosing schedules).

### Light Entities (per device)
- **Sensors**: Current mode, connection status, active schedule count.
- **Services**: 
  - `aquable.light_set_manual_mode`: Set specific channel brightness.
  - `aquable.light_set_auto_schedule` (Experimental): Add automation keyframes (local tracking only).
  - `aquable.light_set_mode`: Switch between manual, auto, and off.
  - `aquable.light_clear_schedules`: Remove all tracked schedules.

## Support

For issues, questions, or feature requests, please visit:
- [GitHub Issues](https://github.com/caleb-venner/AquaBle/issues)
- [Discussion/Wiki](https://github.com/caleb-venner/AquaBle)

## Legal Notice

This project is not affiliated with, endorsed by, or approved by Chihiros Aquatic Studio or Shanghai Ogino Biotechnology Co., Ltd. This is an independent, open-source software project developed through reverse engineering and community contributions.

## License

MIT License - see [LICENSE](LICENSE) file for details.

*Based on [Chihiros LED Control](https://github.com/TheMicDiet/chihiros-led-control) by Michael Dietrich.*
