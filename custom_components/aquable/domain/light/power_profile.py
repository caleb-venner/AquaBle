"""Power estimation for Chihiros LED light devices.

Implements the formula derived from the Chihiros cloud API payload:

    P_actual  = Σ[ V(ch, setpoint) × I(ch, setpoint) ] + power_loss
    P_display = P_actual × (max_show_power / max_power)

where V and I are piecewise-linearly interpolated from the ``voltage_use``
and ``electric_current`` anchor points supplied per-channel by the device's
cloud payload JSON.

The ``PowerProfile`` dataclass holds all device-specific constants and
performs interpolation. The formula supports setpoints in the full hardware
range (0–max_level, typically 0–140), even though the integration's command
interface is currently capped at setpoint 100.

Accuracy: validated at ~0.6% mean absolute error against 16 iOS app
observations spanning a range of single-channel and multi-channel setpoint
combinations on the WRGB II Pro 120.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field

_LOGGER = logging.getLogger(__name__)


def _lerp(x: float, x0: float, y0: float, x1: float, y1: float) -> float:
    """Linear interpolation between two anchor points."""
    if x1 == x0:
        return y0
    return y0 + (y1 - y0) * (x - x0) / (x1 - x0)


def _interpolate(anchors: dict[int, float], setpoint: float) -> float:
    """Piecewise-linear interpolation over a set of (setpoint → value) anchors.

    - Below the lowest anchor: linearly extrapolated from (0, 0.0).
    - Above the highest anchor: clamped to the highest anchor value.
    """
    if not anchors:
        return 0.0
    if setpoint <= 0.0:
        return 0.0

    pts = sorted(anchors.items())  # [(setpoint, value), ...]

    if setpoint < pts[0][0]:
        return _lerp(setpoint, 0, 0.0, pts[0][0], pts[0][1])

    if setpoint >= pts[-1][0]:
        return pts[-1][1]

    for i in range(len(pts) - 1):
        x0, y0 = pts[i]
        x1, y1 = pts[i + 1]
        if x0 <= setpoint <= x1:
            return _lerp(setpoint, x0, y0, x1, y1)

    return pts[-1][1]


@dataclass
class ChannelPowerData:
    """Voltage and current anchor points for one LED channel.

    ``voltage_anchors`` and ``current_anchors`` map integer setpoints
    (e.g. 1, 100, 140) to measured values in V and A respectively.

    Note: ``current_anchors`` typically only has anchors at setpoints 100
    and 140; current at setpoint 0 is assumed to be 0 A.
    """

    voltage_anchors: dict[int, float]
    current_anchors: dict[int, float]

    def power_at(self, setpoint: float) -> float:
        """Return estimated channel power (W) at the given setpoint."""
        v = _interpolate(self.voltage_anchors, setpoint)
        i = _interpolate(self.current_anchors, setpoint)
        return v * i


@dataclass
class PowerProfile:
    """Device-level power model built from a Chihiros cloud API payload entry.

    Fields map directly to the JSON payload fields:

    - ``channels``:        per-channel voltage/current data (ordered by channel index)
    - ``power_loss``:      fixed quiescent overhead in W (PSU, fans, etc.)
    - ``max_power``:       actual power (W) when all channels are at setpoint 100
    - ``max_show_power``:  wattage displayed by the app at that same state
    - ``max_level``:       per-channel hardware setpoint ceiling (commonly 140)

    The display scaling factor is: ``max_show_power / max_power``.
    """

    channels: list[ChannelPowerData]
    power_loss: float
    max_power: float
    max_show_power: float
    max_level: list[int] = field(default_factory=list)

    @property
    def display_scale(self) -> float:
        """Scaling factor that converts actual W to app-displayed W."""
        if self.max_power <= 0:
            return 1.0
        return self.max_show_power / self.max_power

    @property
    def num_channels(self) -> int:
        """Number of channels described by this profile."""
        return len(self.channels)

    def channel_max_level(self, ch_idx: int) -> int:
        """Return the hardware setpoint ceiling for a channel (default 100)."""
        if self.max_level and ch_idx < len(self.max_level):
            return self.max_level[ch_idx]
        return 100

    def estimated_watts(self, setpoints: list[float]) -> float:
        """Return the estimated displayed wattage for the given channel setpoints.

        Args:
            setpoints: Ordered list of setpoint values (0–max_level) for each
                channel. Values are clamped to [0, channel_max_level].

        Returns:
            Estimated wattage as it would appear in the Chihiros app (W).
        """
        actual = self.power_loss
        for ch_idx, sp in enumerate(setpoints):
            if ch_idx >= len(self.channels):
                break
            clamped = max(0.0, min(float(sp), float(self.channel_max_level(ch_idx))))
            actual += self.channels[ch_idx].power_at(clamped)

        return round(actual * self.display_scale, 1)

    @classmethod
    def from_payload(cls, device_data: dict) -> PowerProfile | None:
        """Construct a ``PowerProfile`` from a single device entry in the
        Chihiros cloud API payload JSON.

        Returns ``None`` if the required power fields are absent from the
        payload (e.g. the payload is for a device that does not report
        voltage/current data, such as the Doser).

        Expected payload keys:
        - ``voltage_use``:       list of {setpoint_str: V} dicts, one per channel
        - ``electric_current``:  list of {setpoint_str: A} dicts, one per channel
        - ``power_loss``:        float (W)
        - ``max_power``:         int/float (W)
        - ``max_show_power``:    int/float (W)
        - ``max_level``:         list[int] (optional; per-channel setpoint ceiling)
        """
        voltage_list: list | None = device_data.get("voltage_use")
        current_list: list | None = device_data.get("electric_current")
        power_loss = device_data.get("power_loss")
        max_power = device_data.get("max_power")
        max_show_power = device_data.get("max_show_power")

        if (
            voltage_list is None
            or current_list is None
            or power_loss is None
            or max_power is None
            or max_show_power is None
        ):
            _LOGGER.debug(
                "PowerProfile.from_payload: missing required fields in payload "
                "(device_id=%s); power estimation unavailable.",
                device_data.get("device_id", "unknown"),
            )
            return None

        try:
            if len(voltage_list) != len(current_list):
                _LOGGER.warning(
                    "PowerProfile.from_payload: voltage and current list lengths mismatch "
                    "for device_id=%s. Power estimation unavailable.",
                    device_data.get("device_id", "unknown"),
                )
                return None

            channels: list[ChannelPowerData] = []
            for v_entry, i_entry in zip(voltage_list, current_list):  # type: ignore[arg-type]
                channels.append(
                    ChannelPowerData(
                        voltage_anchors={int(k): float(v) for k, v in v_entry.items()},
                        current_anchors={int(k): float(v) for k, v in i_entry.items()},
                    )
                )

            return cls(
                channels=channels,
                power_loss=float(power_loss),  # type: ignore[arg-type]
                max_power=float(max_power),    # type: ignore[arg-type]
                max_show_power=float(max_show_power), # type: ignore[arg-type]
                max_level=[int(v) for v in device_data.get("max_level", [])],
            )

        except (TypeError, ValueError, KeyError) as exc:
            _LOGGER.warning(
                "PowerProfile.from_payload: could not parse power data for "
                "device_id=%s: %s",
                device_data.get("device_id", "unknown"),
                exc,
            )
            return None

    def to_dict(self) -> dict:
        """Serialise to a JSON-safe dict for ConfigEntry options storage."""
        return {
            "channels": [
                {
                    "voltage_anchors": {str(k): v for k, v in ch.voltage_anchors.items()},
                    "current_anchors": {str(k): v for k, v in ch.current_anchors.items()},
                }
                for ch in self.channels
            ],
            "power_loss": self.power_loss,
            "max_power": self.max_power,
            "max_show_power": self.max_show_power,
            "max_level": self.max_level,
        }

    @classmethod
    def from_dict(cls, data: dict) -> PowerProfile:
        """Deserialise from a dict stored in ConfigEntry options."""
        channels = [
            ChannelPowerData(
                voltage_anchors={int(k): float(v) for k, v in ch["voltage_anchors"].items()},
                current_anchors={int(k): float(v) for k, v in ch["current_anchors"].items()},
            )
            for ch in data["channels"]
        ]
        return cls(
            channels=channels,
            power_loss=float(data["power_loss"]),
            max_power=float(data["max_power"]),
            max_show_power=float(data["max_show_power"]),
            max_level=[int(v) for v in data.get("max_level", [])],
        )
