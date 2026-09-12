"""
Extract and anonymise Chihiros power profiles from raw API payloads.

Takes a raw JSON response from the My Chihiros cloud API (which contains
sensitive data like MAC addresses, user IDs, and Wi-Fi details) and extracts
only the device hardware and power calibration fields needed for AquaBle.

Usage:
    uv run _docs/scripts/extract_power_profiles.py <input.json> <output.json>
"""

import json
import sys
from pathlib import Path


def extract_profiles(input_path: Path, output_path: Path) -> None:
    try:
        with open(input_path, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
    except Exception as e:
        print(f"Error reading {input_path}: {e}")
        sys.exit(1)

    # Support both the API envelope {"data": [...]} and a bare list
    device_list = raw_data.get("data", []) if isinstance(raw_data, dict) else raw_data

    clean_devices = []

    for dev in device_list:
        if not isinstance(dev, dict):
            continue

        # Only extract devices that actually report power calibration data
        if "voltage_use" not in dev or "electric_current" not in dev:
            continue

        # Extract only the safe, hardware-specific fields
        clean_dev = {
            "device_label": dev.get("device_label", "Unknown"),
            "channel": dev.get("channel"),
            "max_level": dev.get("max_level"),
            "max_power": dev.get("max_power"),
            "max_show_power": dev.get("max_show_power"),
            "power_loss": dev.get("power_loss"),
            "voltage_use": dev.get("voltage_use"),
            "electric_current": dev.get("electric_current"),
        }
        clean_devices.append(clean_dev)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump({"data": clean_devices}, f, indent=2)

    print(f"Successfully extracted {len(clean_devices)} power profile(s) to {output_path.name}")
    print("This file is now stripped of personal data and safe to share.")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: uv run _docs/scripts/extract_power_profiles.py <input.json> <output.json>")
        sys.exit(1)

    extract_profiles(Path(sys.argv[1]), Path(sys.argv[2]))
