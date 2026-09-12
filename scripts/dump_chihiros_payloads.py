"""Standalone utility to scan, connect to nearby Chihiros devices, and dump raw BLE status payloads.

Usage:
    uv run scripts/dump_chihiros_payloads.py
    uv run scripts/dump_chihiros_payloads.py --address <MAC_OR_UUID>
    uv run scripts/dump_chihiros_payloads.py --handshake-only
"""

from __future__ import annotations

import argparse
import asyncio
import datetime
import json
import logging
import sys
from pathlib import Path

from bleak import BleakClient, BleakScanner
from bleak.backends.device import BLEDevice

# Nordic UART Service (NUS) UUIDs
UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
UART_RX_CHAR_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e"  # We write to RX on device
UART_TX_CHAR_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e"  # We read from TX on device

# Chihiros device name prefixes
CHIHIROS_PREFIXES = (
    "DYDOS",
    "DYWPR",
    "DYNA",
    "DYSIL",
    "DYSSD",
    "DYZSD",
    "DYNCRGP",
    "DYNC2",
    "DYDD",
    "DYNWRGB",
    "DYNW",
    "DYU",
    "DYLED",
    "DYCOM",
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
_LOGGER = logging.getLogger("dump_payloads")


def _calculate_checksum(input_bytes: bytes | bytearray) -> int:
    """Calculate XOR checksum starting from length byte at index 1."""
    checksum = input_bytes[1]
    for byte in input_bytes[2:]:
        checksum ^= byte
    return checksum


def _create_handshake_command(msg_id: tuple[int, int] = (0, 1)) -> bytearray:
    """Encode standard Chihiros handshake command (0x5A, mode 0x04)."""
    msg_hi, msg_lo = msg_id
    params = [0x01]
    command = bytearray([0x5A, 0x01, len(params) + 5, msg_hi, msg_lo, 0x04])
    command.extend(params)
    checksum = _calculate_checksum(command)
    command.append(checksum)
    return command


def _create_set_time_command(msg_id: tuple[int, int]) -> bytearray:
    """Encode Chihiros time sync command (0x5A, mode 0x09)."""
    now = datetime.datetime.now()
    params = [
        now.year - 2000,
        now.month,
        now.isoweekday(),
        now.hour,
        now.minute,
        now.second,
    ]
    msg_hi, msg_lo = msg_id
    command = bytearray([0x5A, 0x01, len(params) + 5, msg_hi, msg_lo, 0x09])
    command.extend(params)
    command.append(_calculate_checksum(command))
    return command


def _create_prepare_command(msg_id: tuple[int, int], stage: int = 0x04) -> bytearray:
    """Encode Chihiros prepare command (0xA5, mode 0x04)."""
    msg_hi, msg_lo = msg_id
    params = [stage]
    command = bytearray([0xA5, 0x01, len(params) + 5, msg_hi, msg_lo, 0x04])
    command.extend(params)
    command.append(_calculate_checksum(command))
    return command


async def discover_chihiros_devices(timeout: float = 5.0) -> list[BLEDevice]:
    """Scan for nearby Chihiros BLE devices matching known prefixes."""
    _LOGGER.info("Scanning for Chihiros BLE devices (%0.1fs)...", timeout)
    discovered = await BleakScanner.discover(timeout=timeout, return_adv=True)
    matched: list[BLEDevice] = []
    for _address, (device, adv_data) in discovered.items():
        name = device.name or adv_data.local_name or ""
        if any(name.upper().startswith(prefix) for prefix in CHIHIROS_PREFIXES):
            matched.append(device)
            _LOGGER.info(
                "Found Chihiros device: %s (%s, RSSI: %s)",
                name,
                device.address,
                adv_data.rssi,
            )
    return matched


def _create_channel_query_command(msg_id: tuple[int, int], channel: int) -> bytearray:
    """Encode channel curve query (0x5A, mode 0x04, param=[channel])."""
    msg_hi, msg_lo = msg_id
    params = [channel]
    command = bytearray([0x5A, 0x01, len(params) + 5, msg_hi, msg_lo, 0x04])
    command.extend(params)
    command.append(_calculate_checksum(command))
    return command


def _create_query_mode_command(msg_id: tuple[int, int], query_type: int = 0x01) -> bytearray:
    """Encode query mode command (0x5A, mode 0x05, param=[query_type])."""
    msg_hi, msg_lo = msg_id
    params = [query_type]
    command = bytearray([0x5A, 0x01, len(params) + 5, msg_hi, msg_lo, 0x05])
    command.extend(params)
    command.append(_calculate_checksum(command))
    return command


async def capture_device_payloads(
    device: BLEDevice | str,
    collect_seconds: float = 4.0,
    full_sequence: bool = True,
    probe_channels: bool = False,
) -> dict:
    """Connect to a device, send handshake and probe sequence, and capture notifications."""
    address = device.address if isinstance(device, BLEDevice) else device
    name = device.name if isinstance(device, BLEDevice) else "Unknown"
    normalized_name = (name or "").upper()
    is_light = any(normalized_name.startswith(p) for p in ("DYWPR", "DYNA", "DYSIL", "DYNW", "DYU"))

    _LOGGER.info("Connecting to %s (%s)...", name, address)
    captured_packets: list[dict] = []

    def notification_handler(_sender, data: bytearray) -> None:
        raw_bytes = bytes(data)
        int_list = list(raw_bytes)
        hex_str = raw_bytes.hex()
        mode = int_list[5] if len(int_list) > 5 else None
        mode_hex = f"0x{mode:02X}" if mode is not None else "N/A"

        _LOGGER.info(
            "[%s] Received notification (%d bytes, mode %s): %s",
            name,
            len(raw_bytes),
            mode_hex,
            hex_str,
        )

        captured_packets.append(
            {
                "timestamp": datetime.datetime.now().isoformat(),
                "length": len(raw_bytes),
                "mode": mode_hex,
                "hex": hex_str,
                "integers": int_list,
            }
        )

    client = BleakClient(address)
    try:
        await client.connect(timeout=15.0)
        _LOGGER.info("[%s] Connected successfully.", name)

        # Start notifications
        await client.start_notify(UART_TX_CHAR_UUID, notification_handler)

        commands_to_send: list[tuple[str, bytearray]] = [
            ("Handshake (0x5A, 0x04, [0x01])", _create_handshake_command((0, 1))),
            ("Time Sync (0x5A, 0x09)", _create_set_time_command((0, 2))),
            ("Prepare 0x04 (0xA5 0x04)",_create_prepare_command((0, 3), stage=0x04),),
        ]

        for cmd_name, cmd_bytes in commands_to_send:
            _LOGGER.info("[%s] Sending %s: %s", name, cmd_name, cmd_bytes.hex())
            await client.write_gatt_char(UART_RX_CHAR_UUID, cmd_bytes, response=False)
            await asyncio.sleep(0.5)

        # Collect all remaining responses
        _LOGGER.info("[%s] Waiting %0.1fs to collect all notifications...", name, collect_seconds)
        await asyncio.sleep(collect_seconds)

        try:
            await client.stop_notify(UART_TX_CHAR_UUID)
        except Exception:
            pass

    except Exception as err:
        _LOGGER.error("[%s] Error communicating with device: %s", name, err)
        return {
            "device_name": name,
            "address": address,
            "error": str(err),
            "packets": captured_packets,
        }
    finally:
        if client.is_connected:
            await client.disconnect()
            _LOGGER.info("[%s] Disconnected.", name)

    return {
        "device_name": name,
        "address": address,
        "captured_at": datetime.datetime.now().isoformat(),
        "packet_count": len(captured_packets),
        "packets": captured_packets,
    }


async def main() -> None:
    parser = argparse.ArgumentParser(description="Dump raw status payloads from Chihiros devices.")
    parser.add_argument(
        "--address",
        "-a",
        type=str,
        help="Specific device address/UUID to query (bypasses discovery filter).",
    )
    parser.add_argument(
        "--output",
        "-o",
        type=str,
        default="captured_payloads.json",
        help="Output JSON file path (default: captured_payloads.json).",
    )
    parser.add_argument(
        "--timeout",
        "-t",
        type=float,
        default=5.0,
        help="Scan timeout in seconds (default: 5.0).",
    )
    parser.add_argument(
        "--wait",
        "-w",
        type=float,
        default=4.0,
        help="Notification wait window in seconds (default: 4.0).",
    )
    parser.add_argument(
        "--handshake-only",
        action="store_true",
        help="Send only the handshake command without time sync or prepare commands.",
    )
    args = parser.parse_args()

    devices_to_query: list[BLEDevice | str] = []

    if args.address:
        devices_to_query.append(args.address)
    else:
        discovered = await discover_chihiros_devices(timeout=args.timeout)
        if not discovered:
            _LOGGER.warning("No Chihiros devices discovered nearby.")
            sys.exit(0)
        devices_to_query.extend(discovered)

    results = []
    for dev in devices_to_query:
        dump = await capture_device_payloads(
            dev,
            collect_seconds=args.wait,
            full_sequence=not args.handshake_only,
        )
        results.append(dump)

    # Save results
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    _LOGGER.info("Payload dump successfully written to %s", output_path.resolve())

    # Print summary
    print("\n" + "=" * 60)
    print("PAYLOAD DUMP SUMMARY")
    print("=" * 60)
    for res in results:
        print(f"Device: {res.get('device_name')} ({res.get('address')})")
        if "error" in res:
            print(f"  Error: {res['error']}")
        for idx, pkt in enumerate(res.get("packets", []), start=1):
            print(f"  Packet {idx} [{pkt['mode']} - {pkt['length']} bytes]:")
            print(f"    Hex:  {pkt['hex']}")
            print(f"    Ints: {pkt['integers']}")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
