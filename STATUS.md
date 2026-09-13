# AquaBle Integration Status

## Issues

- [x] Manual setting on light device card should persist until altered. (last command sent)
- [x] Updating schedules seems partially broken; need to perform analysis of command pipeline and logic.

## TODO

- [ ] Implement 'saved'/'favourites' for various schedules and modes.
- [ ] Implement, or make note of not-supporting, 100+ brightness on supported models.
- [ ] Align Light and Doser device card styles:
    - Status indicators
    - Tighten 4 head doser 2x2 grid
    - Doser: Size change between card views too large.
    - Light: Size change between card views equalised.
- [ ] Give feedback / toast notification on push schedule to device
- [x] Prevent schedule collisions by checking for overlaps in the service handler.
- [x] Feature: Implement deletion / editing of individual schedule slots in the UI card
- [x] BUG: When pushing 0;0;0;7 to device (just 7% white light) the schedule saved shows 7;0;0;7 

## Open Requests

*None currently pending.*

## Planned Features

### Doser: Calibration

**Concept:** When silicone tubes wear out, a pump that is supposed to dose 10ml might only dose 9ml. Calibration involves telling the pump to run for a set time, measuring the actual liquid dispensed, and reporting that value back to the pump so it can adjust its flow-rate multiplier. This is currently a feature within the Chihiros app, BLE communications not yet captured or decoded.

### Encoding Details
* **Source:** **Currently Missing.** 
* Neither this codebase nor the upstream `TheMicDiet` repository currently contains the byte encoding for pump calibration.

**How we will get it:**
To implement this correctly, we will need to perform a BLE packet sniff from the official *My Chihiros App*:
1. Start a Bluetooth snoop log on a device.
2. Open the app and run the calibration sequence for a pump head.
3. Looking for commands sent right after the calibration completes (likely an `0xA5` command) containing the user-input volume.

**Logic Flow (Once reversed):**
- Expose an HA Service: `aquable.doser_calibrate_head`. 
- Call it with `head_index: 1` and `actual_volume_dispensed_ml: 9.5`. 
- The service will translate this into the calibration bytes, pushing the new multiplier directly to the device.

---

## Firmware Quirks

> [!WARNING]
> **Firmware Bug: Unreliable Length Byte**
> Different firmware versions append a different number of parameters to this ACK (e.g., v21 sends a 12-byte total frame, v24 sends a 14-byte frame by appending uptime). However, **both versions hardcode the length byte (Byte 2) as `0x0A`**. This means the length byte cannot be trusted for UART stream reassembly or framing. Parsers must rely on the checksum or known structural lengths rather than the declared length byte.

> [!NOTE]
> **WRGB II Pro Firmware v21: Missing 0xFE Schedule Telemetry**
> On firmware v21 (`0x15`), the WRGB II Pro does not respond with the expected `0xFE` schedule telemetry packet when sent the standard `0x5A / 0x04 / [0x01]` handshake (or even the doser's `0xA5` prepare command). It only ever returns a 12-byte `0x0A` ACK packet. Packet sniffing reveals that the official Chihiros app also does not receive the `0xFE` status on this firmware and instead blindly pushes schedule data.
> **Workaround:** AquaBle gracefully handles this by falling back to a synthesised empty (or locally cached) schedule if `0xFE` is not received during the notification window. This prevents `UpdateFailed` setup loops and allows one-way syncing of schedules to the device. (Note: Newer firmwares like v24 resolve this and correctly return `0xFE`).
