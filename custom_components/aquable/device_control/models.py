"""Data models for Chihiros devices."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional, Tuple

MODE_NAMES = {
    0x00: "daily",
    0x01: "24h",
    0x02: "custom",
    0x03: "timer",
    0x04: "disabled",
}

@dataclass(slots=True)
class HeadSnapshot:
    """Decoded information for a single head in the status frame."""

    mode: int
    hour: int
    minute: int
    dosed_tenths_ml: int
    extra: bytes

    def mode_label(self) -> str:
        """Return a human friendly mode name if known."""
        return MODE_NAMES.get(self.mode, f"0x{self.mode:02X}")

    def dosed_ml(self) -> float:
        """Return the ml already dispensed today."""
        return self.dosed_tenths_ml / 10


@dataclass(slots=True)
class DoserStatus:
    """High level representation of a status notification."""

    message_id: tuple[int, int] | None
    response_mode: int | None
    weekday: int | None
    hour: int | None
    minute: int | None
    heads: list[HeadSnapshot]
    tail_targets: list[int]
    tail_flag: int | None
    tail_raw: bytes
    lifetime_totals_tenths_ml: list[int]
    raw_payload: bytes = b""

    def lifetime_totals_ml(self) -> list[float]:
        """Return lifetime totals in mL for all heads."""
        return [total / 10.0 for total in self.lifetime_totals_tenths_ml]

    def update_from(self, other: DoserStatus) -> None:
        """Merge data from another status object, keeping existing data if other is empty."""
        if other.heads:
            self.heads = other.heads
        if other.tail_targets:
            self.tail_targets = other.tail_targets
        if other.lifetime_totals_tenths_ml:
            self.lifetime_totals_tenths_ml = other.lifetime_totals_tenths_ml
        
        # Update other fields if they are not None
        if other.message_id is not None:
            self.message_id = other.message_id
        if other.response_mode is not None:
            self.response_mode = other.response_mode
        if other.weekday is not None:
            self.weekday = other.weekday
        if other.hour is not None:
            self.hour = other.hour
        if other.minute is not None:
            self.minute = other.minute
        if other.tail_flag is not None:
            self.tail_flag = other.tail_flag
        if other.tail_raw:
            self.tail_raw = other.tail_raw
        if other.raw_payload:
            self.raw_payload = other.raw_payload


@dataclass(slots=True)
class LightKeyframe:
    """Single scheduled point (hour, minute, intensity)."""

    hour: int
    minute: int
    value: int

    def as_time(self) -> str:
        """Return the keyframe timestamp formatted as HH:MM."""
        return f"{self.hour:02d}:{self.minute:02d}"


@dataclass(slots=True)
class LightStatus:
    """Decoded view of a WRGB status notification."""

    message_id: Optional[Tuple[int, int]]
    response_mode: Optional[int]
    weekday: Optional[int]
    hour: Optional[int]
    minute: Optional[int]
    keyframes: list[LightKeyframe]
    time_markers: list[Tuple[int, int]]
    tail: bytes
    raw_payload: bytes
