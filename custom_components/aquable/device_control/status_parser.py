"""BLE status payload parser for Chihiros devices.

Parses raw BLE notification bytes into structured dataclasses:
- DoserStatus: Pump status with head data and lifetime totals
- LightStatus: Light status with schedule keyframes

Used by device classes to decode notifications from the BLE UART service.
"""

from __future__ import annotations

from typing import Optional, Tuple
from .models import (
    DoserStatus,
    HeadSnapshot,
    LightKeyframe,
    LightStatus,
    MODE_NAMES,
)

# ============================================================================
# Doser Status Parsers
# ============================================================================

def _parse_status_payload(payload: bytes) -> DoserStatus:
    """Parse response mode 0xFE: Head data with schedule info and daily dosed amounts.

    The payload structure is:
    - Bytes 0-8: Standard header (0x5B, msg_id_hi, msg_id_lo, msg_id_hi,
                 msg_id_lo, 0xFE, weekday, hour, minute)
    - Bytes 09-17: Head 1 (9 bytes)
    - Bytes 18-26: Head 2 (9 bytes)
    - Bytes 27-35: Head 3 (9 bytes)
    - Bytes 36-44: Head 4 (9 bytes)
    - Last 5 bytes: Tail (contains daily set dose amounts for each head)
    """
    if not payload or len(payload) < 9 or payload[0] != 0x5B:
        raise ValueError("Invalid payload structure")

    message_id = (payload[3], payload[4])
    response_mode = payload[5]
    weekday = payload[6]
    hour = payload[7]
    minute = payload[8]

    body = payload[9:]
    heads: list[HeadSnapshot] = []
    tail_targets: list[int] = []
    tail_flag: int | None = None
    tail_raw = b""

    # Extract tail from last 5 bytes
    if len(body) >= 5:
        tail_raw = body[-5:]
        head_bytes = body[:-5]
    else:
        head_bytes = body

    # Parse head blocks (9 bytes each, up to 4 heads)
    for idx in range(0, min(len(head_bytes), 9 * 4), 9):
        end_index = idx + 9
        chunk = head_bytes[idx:end_index]
        if len(chunk) < 9:
            break
        heads.append(
            HeadSnapshot(
                mode=chunk[0],
                hour=chunk[1],
                minute=chunk[2],
                extra=chunk[3:7],
                dosed_tenths_ml=(chunk[7] << 8) | chunk[8],
            )
        )

    if tail_raw:
        tail_targets = list(tail_raw[:4])
        if len(tail_raw) > 4:
            tail_flag = tail_raw[4]

    return DoserStatus(
        message_id=message_id,
        response_mode=response_mode,
        weekday=weekday,
        hour=hour,
        minute=minute,
        heads=heads,
        tail_targets=tail_targets,
        tail_flag=tail_flag,
        tail_raw=tail_raw,
        lifetime_totals_tenths_ml=[],
        raw_payload=payload,
    )


def _parse_lifetime_payload(payload: bytes) -> DoserStatus:
    """Parse response mode 0x1E: Lifetime dose totals (4 heads x 2 bytes each).

    For mode 0x1E, the structure is:
    - Bytes 0-5: Standard header (0x5B, msg_id_hi, msg_id_lo, msg_id_hi, msg_id_lo, 0x1E)
    - Bytes 6+: Lifetime totals (2 bytes per head)
    """
    if not payload or len(payload) < 6 or payload[0] != 0x5B:
        raise ValueError("Invalid payload structure")

    message_id = (payload[3], payload[4])
    response_mode = payload[5]

    # For 0x1E payloads, time fields are not present
    weekday = None
    hour = None
    minute = None

    lifetime_totals_tenths_ml: list[int] = []

    # Lifetime data starts at byte 6
    lifetime_data = payload[6:]

    num_heads = min(4, len(lifetime_data) // 2)
    for i in range(num_heads):
        high_byte = lifetime_data[i * 2]
        low_byte = lifetime_data[i * 2 + 1]
        total_tenths_ml = (high_byte << 8) | low_byte
        lifetime_totals_tenths_ml.append(total_tenths_ml)

    return DoserStatus(
        message_id=message_id,
        response_mode=response_mode,
        weekday=weekday,
        hour=hour,
        minute=minute,
        heads=[],
        tail_targets=[],
        tail_flag=None,
        tail_raw=b"",
        lifetime_totals_tenths_ml=lifetime_totals_tenths_ml,
        raw_payload=payload,
    )


def parse_doser_payload(payload: bytes) -> DoserStatus:
    """Parse a doser status notification from the pump.

    Dispatches to appropriate parser based on response mode:
    - 0xFE: Head data with schedule info and daily dosed amounts (includes time fields)
    - 0x1E: Lifetime dose totals (no time fields)
    """
    if not payload or len(payload) < 6:
        raise ValueError("payload too short")

    # Extract response_mode (byte 5) to determine which parser to use
    response_mode = payload[5]

    if response_mode == 0xFE:
        return _parse_status_payload(payload)
    elif response_mode == 0x1E:
        return _parse_lifetime_payload(payload)
    else:
        # Default behavior: treat as status payload if response_mode is unknown
        return _parse_status_payload(payload)


# ============================================================================
# Light Status Parsers
# ============================================================================

def _plausible_time(wd: int, hr: int, minute: int) -> bool:
    return 0 <= wd <= 7 and 0 <= hr <= 23 and 0 <= minute <= 59


def _minutes_distance(h1: int, m1: int, h2: int, m2: int) -> int:
    """Return minimal absolute distance in minutes between two HH:MM values.

    Computed modulo 24h so wrap-around at midnight is handled.
    """
    a = (h1 * 60 + m1) % (24 * 60)
    b = (h2 * 60 + m2) % (24 * 60)
    diff = abs(a - b)
    return min(diff, (24 * 60) - diff)


def _split_body(
    payload: bytes,
) -> Tuple[
    Optional[Tuple[int, int]],
    Optional[int],
    Optional[int],
    Optional[int],
    Optional[int],
    bytes,
]:
    """Return header fields and body bytes."""
    message_id = response_mode = weekday = hour = minute = None
    body = payload
    if payload and payload[0] == 0x5B and len(payload) >= 9:
        message_id = (payload[3], payload[4])
        response_mode = payload[5]
        weekday = payload[6]
        hour = payload[7]
        minute = payload[8]
        body = payload[9:]
    return message_id, response_mode, weekday, hour, minute, body


def parse_light_payload(payload: bytes) -> LightStatus:
    """Decode a WRGB status payload into keyframes and markers."""
    (
        message_id,
        response_mode,
        weekday,
        hour,
        minute,
        body,
    ) = _split_body(payload)

    tail = body[-5:] if len(body) >= 5 else b""
    body_bytes = body[:-5] if len(body) >= 5 else body

    if weekday is not None and hour is not None and minute is not None and len(body_bytes) >= 3:
        pattern = bytes((weekday, hour, minute))
        idx = body_bytes.find(pattern)
        if idx != -1 and idx <= 16:
            body_bytes = body_bytes[idx + 3 :]

    keyframes: list[LightKeyframe] = []
    time_markers: list[tuple[int, int]] = []

    i = 0
    last_time: Optional[int] = None
    length = len(body_bytes)
    while i < length:
        remaining = length - i
        if remaining >= 4 and body_bytes[i] == 0x00 and body_bytes[i + 1] == 0x02:
            time_markers.append((body_bytes[i + 2], body_bytes[i + 3]))
            i += 4
            continue

        if remaining < 3:
            break

        hour = body_bytes[i]
        minute = body_bytes[i + 1]
        value = body_bytes[i + 2]
        triple = (hour, minute, value)

        if triple == (0, 0, 0):
            i += 3
            continue

        total_minutes = hour * 60 + minute
        if last_time is not None and total_minutes < last_time:
            break

        keyframes.append(LightKeyframe(hour=hour, minute=minute, value=value))
        last_time = total_minutes
        i += 3

    return LightStatus(
        message_id=message_id,
        response_mode=response_mode,
        weekday=weekday,
        hour=hour,
        minute=minute,
        keyframes=keyframes,
        time_markers=time_markers,
        tail=tail,
        raw_payload=payload,
    )


__all__ = [
    "DoserStatus",
    "HeadSnapshot",
    "LightKeyframe",
    "LightStatus",
    "MODE_NAMES",
    "parse_doser_payload",
    "parse_light_payload",
]
