"""Module defining Chihiros devices."""

import inspect
import re
import sys
from typing import Type

from bleak import BleakScanner
from bleak.backends.device import BLEDevice

from ..errors import DeviceNotFoundError
from .base_device import BaseDevice
from .doser import Doser
from .light import LightDevice
from .models import (
    AII,
    CII,
    CIIRGB,
    WRGBII,
    Commander1,
    Commander4,
    TinyTerrariumEgg,
    UniversalWRGB,
    WRGBIIPro,
    WRGBIISlim,
    ZLightTiny,
)

CODE2MODEL = {}
for name, obj in inspect.getmembers(sys.modules[__name__]):
    if inspect.isclass(obj) and issubclass(obj, BaseDevice):
        for model_code in obj._model_codes:
            CODE2MODEL[model_code] = obj

# Common aliases/abbreviations seen in discovery payloads.
MODEL_CODE_ALIASES = {
    "DYDOS": "DYDOSE",
}


def get_ble_device_name(ble_device: BLEDevice) -> str | None:
    """Return the best-available device name from Bleak BLEDevice fields.

    Home Assistant / BlueZ frequently exposes advertisement names via
    ``metadata.local_name`` while ``BLEDevice.name`` can be empty.
    """
    candidates: list[str | None] = [getattr(ble_device, "name", None)]

    metadata = getattr(ble_device, "metadata", None)
    if isinstance(metadata, dict):
        candidates.extend(
            [
                metadata.get("local_name"),
                metadata.get("name"),
                metadata.get("alias"),
                metadata.get("device_name"),
            ]
        )

    details = getattr(ble_device, "details", None)
    if isinstance(details, dict):
        candidates.extend(
            [
                details.get("Name"),
                details.get("Alias"),
                details.get("local_name"),
            ]
        )
        props = details.get("props")
        if isinstance(props, dict):
            candidates.extend(
                [
                    props.get("Name"),
                    props.get("Alias"),
                    props.get("LocalName"),
                ]
            )

    for candidate in candidates:
        if isinstance(candidate, str):
            normalized = candidate.strip()
            if normalized:
                return normalized
    return None


def get_model_class_from_name(
    device_name: str,
) -> Type[BaseDevice]:
    """Get device class name from device name."""
    normalized_name = device_name.strip().upper()
    compact_name = re.sub(r"[^A-Z0-9]", "", normalized_name)

    # Prefer longest model codes first so prefixes do not collide.
    for model_code in sorted(CODE2MODEL.keys(), key=len, reverse=True):
        if normalized_name.startswith(model_code) or model_code in normalized_name:
            return CODE2MODEL[model_code]
        if compact_name.startswith(model_code) or model_code in compact_name:
            return CODE2MODEL[model_code]

    for alias_code, canonical_code in MODEL_CODE_ALIASES.items():
        if alias_code in normalized_name or alias_code in compact_name:
            model_class = CODE2MODEL.get(canonical_code)
            if model_class is not None:
                return model_class

    raise DeviceNotFoundError(device_name, details={"reason": "Device model code not found"})


async def get_device_from_address(device_address: str) -> BaseDevice:
    """Get BLEDevice object from mac address."""
    ble_dev = await BleakScanner.find_device_by_address(device_address)
    if ble_dev:
        resolved_name = get_ble_device_name(ble_dev)
        if resolved_name is None:
            raise DeviceNotFoundError(
                device_address,
                details={"reason": "BLE device has no resolvable name"},
            )
        model_class = get_model_class_from_name(resolved_name)
        dev: BaseDevice = model_class(ble_dev)
        return dev

    raise DeviceNotFoundError(device_address)


__all__ = [
    "ZLightTiny",
    "TinyTerrariumEgg",
    "AII",
    "Commander1",
    "Commander4",
    "Doser",
    "WRGBII",
    "WRGBIIPro",
    "WRGBIISlim",
    "CII",
    "CIIRGB",
    "UniversalWRGB",
    "BaseDevice",
    "LightDevice",
    "CODE2MODEL",
    "get_ble_device_name",
    "get_device_from_address",
    "get_model_class_from_name",
]
