# Changelog

All notable changes to AquaBle are documented here.

---

## [v4.1.0] — Unreleased

**Light master/slave sync, decimal doser targets, and schedule fixes.**

**Feat:**
- **Light sync (master/slave):** a light can now mirror its commands to other lights of the same model. Set it up under **Configure** on the master light's AquaBle entry. Schedules, manual brightness, mode changes and schedule deletes/clears sent to the master are repeated on each selected light, and the master's stored schedules are copied to them. Lights only; dosers are not synced. See [Light Sync](README.md#light-sync-optional).
- Pushing a light schedule now also syncs the light's clock and switches it to auto mode, so a new schedule runs straight away.
- Added translations (`translations/en.json`), so the config flow, the light sync options screen and the "refresh your browser" repair issue show proper text instead of raw keys.

**Fix:**
- **Doser decimal targets (#9):** a daily target such as 0.5 mL read back as 0, and the doser card then fell back to 5 mL. The pump only reports targets in whole mL, so AquaBle now stores the exact target it sends and the Target Dose sensor shows it while it still agrees with the pump. If the target is changed in the Chihiros app, the sensor falls back to the pump's value.
  - Targets set before this update show the whole-mL value until they are saved again from Home Assistant.
- **Doser card:** no longer replaces a 0 reading with a 5 mL default when editing or re-enabling a head, and refuses to save a blank or negative target.
- **Doser card:** the manual dose input now accepts 0.1 mL steps (e.g. 0.3 mL was previously rejected).
- Doser volumes are rounded rather than truncated when converted to tenths of a mL.
- Lights that never send the `0xFE` status packet (e.g. WRGB II Pro firmware v21) no longer fail setup on a fresh install (#5).
- Deleting a light schedule now sends the schedule's stored ramp time, so the delete matches the slot on the light.

**Changed:**
- Light schedule ramp time now has a **minimum of 1 minute** (was 0) in `aquable.light_set_auto_schedule`. Existing schedules with a 0-minute ramp can still be deleted, and get 1 minute when edited.
- The light card's ramp slider now starts at 5 minutes.

**Docs:**
- `BLE_Protocol.md`: the `0xFE` tail target is whole mL (truncated), not tenths; `0x22` is the scheduled dosed-today totals, not a target ACK; added notes on how manual doses are counted.

---

## [v4.0.3] — 2026-08-31

**Improve light device command & control logic.**

**Fix:**
- Resolve bug in update schedule feature (variable name mismatch)

**Feat:**
- Prevent schedule collisions by checking for overlaps in the service handler.
- Manual setting on light device card should persist until altered. (last command sent)

---

## [v4.0.2] — 2026-08-28

**Fix:** 
- Resolve bug in **Light Device**->*Add Schedule*: If a schedule command was sent with Red = 0 and White > 0 on a 4 channel device, Red would inherit White brightness value; Red = White > 0.

**Feat:** 
- *Expand supported devices:*
  - Update prefix mappings for supported devices. 
  - Implement dynamic sensor labelling in sensor.py

---

## [v4.0.1] — 2026-08-27

**docs**: fix README rendering issue when view in HACS 
- remove inline html 
- replace with table formatting

---

## [v4.0.0] — 2026-08-27

> ⚠️ **Breaking change**: Configuration will need to be re-entered after upgrading. See [README](README.md) for setup instructions.

### Dashboard Cards (New)

Two purpose-built Lovelace cards are now automatically registered on installation — no manual resource setup needed.

**Light Card** (`aquable-light-card`):
- Interactive 24-hour SVG ramp curve visualiser across all active schedules with a live time-of-day marker.
- Add, edit, and delete individual schedule slots directly from the card.
- Per-channel peak brightness sliders (Red, Green, Blue, White), ramp duration, and active weekday selection.
- Instant manual brightness override and mode switcher (Auto, Manual, Off).

**Doser Card** (`aquable-doser-card`):
- 4-head monitoring grid with live progress bars (dosed today vs daily target).
- Per-head active/disabled toggle and quick manual dose buttons.
- Per-head schedule configuration (target volume, run time, weekday filter).

### Architecture
- Stateless functional architecture — Home Assistant is the source of truth for all schedule configuration.
- Real-time channel brightness sensors interpolated locally every second with zero BLE polling overhead.

### Sensors
- **Dosing Pump**: Dosed Today, Target Dose, Schedule Time, Mode, and Lifetime Total per head (1–4).
- **LED Light**: Active Schedules (with full definitions in attributes), Hardware Sync status, and Live Channel Brightness per channel.

### Services / Actions
- `aquable.light_set_auto_schedule` — add or update a schedule slot.
- `aquable.light_delete_auto_schedule` — delete an individual schedule slot from hardware.
- `aquable.light_clear_schedules` — wipe all schedules from device memory.
- `aquable.light_set_manual_mode` — set static channel brightness levels.
- `aquable.light_set_mode` — switch between Auto, Manual, and Off.
- `aquable.doser_set_daily_dose_sequence` — configure a full daily dosing schedule per head.
- `aquable.doser_manual_dose` — trigger an immediate one-shot dose.

### Device Support
- Added `DYNT90` support (Chihiros WRGB II) — thanks to [@dmitry-puchkov](https://github.com/dmitry-puchkov).

---

## [v2.2.6] — Prior Release

See [GitHub Releases](https://github.com/caleb-venner/AquaBle/releases) for earlier version history.
