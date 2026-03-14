# Configuration Guide

This guide explains how to configure schedules and send commands to your Chihiros devices via Home Assistant using the AquaBle integration.

## Ways to Send Commands

Commands can be sent to AquaBle devices in two primary ways within Home Assistant:

1.  **Developer Tools:** Use the "Services" tab in Developer Tools to test commands manually.
2.  **Automations & Scripts:** Include service calls in your `automations.yaml` or `scripts.yaml` to automate your aquarium equipment.

All commands require a `device_id`. You can find this in the Home Assistant UI by going to **Settings > Devices & Services > AquaBle**, selecting your device, and looking at the "Device Info" or checking the URL.

---

## Doser Configuration

Dosing pumps are configured using the `aquable.doser_set_head_schedule` service.

### Service: `aquable.doser_set_head_schedule`

Sets a daily dosing schedule for a specific head.

| Field | Type | Description |
|-------|------|-------------|
| `device_id` | string | **Required**. Target doser device. |
| `head_index` | integer | **Required**. Head number (0-3). |
| `volume_ml` | float | **Required**. Daily dose volume in mL. |
| `hour` | integer | **Required**. Schedule hour (0-23). |
| `minute` | integer | **Required**. Schedule minute (0-59). |
| `weekdays` | list | (Optional) Days of week: `mon`, `tue`, `wed`, `thu`, `fri`, `sat`, `sun`. |
| `mode` | string | **Required**. Operating mode: `daily`, `24h`, `custom`, `timer`, `disabled`. |

#### YAML Example: Daily Dosing
```yaml
service: aquable.doser_set_head_schedule
data:
  device_id: 1234567890abcdef1234567890abcdef
  head_index: 0
  volume_ml: 5.0
  hour: 10
  minute: 0
  weekdays: [mon, wed, fri]
  mode: daily
```

---

## Light Configuration

Lights support manual control and multi-point automatic schedules.

### Mode Selection: `aquable.light_set_mode`

Switch between manual, automatic, or off modes.

| Field | Type | Description |
|-------|------|-------------|
| `device_id` | string | **Required**. Target light device. |
| `mode` | string | **Required**. `manual`, `auto`, or `off`. |

### Manual Mode: `aquable.light_set_manual_mode`

Set specific brightness levels for each channel.

| Field | Type | Description |
|-------|------|-------------|
| `device_id` | string | **Required**. Target light device. |
| `white` | integer | White brightness (0-100%). |
| `red` | integer | Red brightness (0-100%). |
| `green` | integer | Green brightness (0-100%). |
| `blue` | integer | Blue brightness (0-100%). |

#### YAML Example: Set Fixed Colors
```yaml
service: aquable.light_set_manual_mode
data:
  device_id: 1234567890abcdef1234567890abcdef
  red: 100
  green: 50
  blue: 80
```

### Automatic Schedules: `aquable.light_set_auto_schedule`

Define a transition point for automatic mode. You can add up to 24 points to create a complex lighting curve.

| Field | Type | Description |
|-------|------|-------------|
| `device_id` | string | **Required**. Target light device. |
| `name` | string | (Optional) Name for this schedule point. |
| `sunrise_hour` | integer | **Required**. Start hour (0-23). |
| `sunrise_minute` | integer | **Required**. Start minute (0-59). |
| `sunset_hour` | integer | **Required**. End hour (0-23). |
| `sunset_minute` | integer | **Required**. End minute (0-59). |
| `white/red/green/blue`| integer| Brightness for each channel (0-100%). |

#### YAML Example: Morning Ramp
```yaml
service: aquable.light_set_auto_schedule
data:
  device_id: 1234567890abcdef1234567890abcdef
  name: "Sunrise"
  sunrise_hour: 8
  sunrise_minute: 0
  sunset_hour: 9
  sunset_minute: 0
  white: 100
  red: 50
```

### Clearing Schedules: `aquable.light_clear_schedules`

Removes all automatic schedules from the device and Home Assistant tracking.

```yaml
service: aquable.light_clear_schedules
data:
  device_id: 1234567890abcdef1234567890abcdef
```

---

## Technical Considerations

- **Bluetooth Range:** Ensure your Home Assistant instance (or Bluetooth proxy) is within range of the devices.
- **Verification:** The integration requests a status update immediately after sending commands to verify they were accepted by the device.
