"""Tests for BLE name resolution in discovery and connection flows."""

from __future__ import annotations

from types import SimpleNamespace
from typing import cast

import pytest
from bleak.backends.device import BLEDevice
from bleak.backends.scanner import AdvertisementData

from aquable.ble_service import filter_supported_devices
from aquable.device import get_ble_device_name, get_device_from_address, get_model_class_from_name


class _FakeBLEDevice(SimpleNamespace):
    """Simple BLEDevice-like object for unit tests."""


def test_get_ble_device_name_prefers_metadata_local_name() -> None:
    """Resolve names from metadata when BLEDevice.name is unavailable."""
    device = _FakeBLEDevice(
        address="E4:3A:D5:3A:D8:02",
        name=None,
        metadata={"local_name": "DYDOSEE43AD53AD802"},
    )

    assert get_ble_device_name(cast(BLEDevice, device)) == "DYDOSEE43AD53AD802"


def test_filter_supported_devices_uses_local_name() -> None:
    """Discovery should keep supported devices when name is only in metadata."""
    supported = _FakeBLEDevice(
        address="E4:3A:D5:3A:D8:02",
        name=None,
        metadata={"local_name": "DYDOSEE43AD53AD802"},
    )
    unsupported = _FakeBLEDevice(
        address="11:22:33:44:55:66",
        name=None,
        metadata={"local_name": "UnknownDevice123"},
    )

    result = filter_supported_devices(
        [cast(BLEDevice, supported), cast(BLEDevice, unsupported)]
    )

    assert len(result) == 1
    assert result[0][0].address == "E4:3A:D5:3A:D8:02"
    assert result[0][1].__name__ == "Doser"


def test_filter_supported_devices_uses_advertisement_local_name() -> None:
    """Discovery should support names available only in AdvertisementData."""
    supported = _FakeBLEDevice(
        address="E4:99:45:71:65:14",
        name=None,
        metadata={},
    )
    adv = cast(AdvertisementData, SimpleNamespace(local_name="DYWPR120E49945716514"))

    result = filter_supported_devices([(cast(BLEDevice, supported), adv)])

    assert len(result) == 1
    assert result[0][0].address == "E4:99:45:71:65:14"
    assert result[0][1].__name__ == "WRGBIIPro"


def test_get_model_class_from_name_matches_full_broadcast_name() -> None:
    """Model detection should use code prefix from complete broadcast names."""
    model = get_model_class_from_name("DYWPR120E49945716514")
    assert model.__name__ == "WRGBIIPro"


@pytest.mark.asyncio
async def test_get_device_from_address_uses_resolved_name(monkeypatch: pytest.MonkeyPatch) -> None:
    """Connection lookup should also use metadata.local_name fallback."""
    fake_device = _FakeBLEDevice(
        address="E4:3A:D5:3A:D8:02",
        name=None,
        metadata={"local_name": "DYDOSEE43AD53AD802"},
    )

    async def _fake_find_device_by_address(_address: str):
        return fake_device

    from aquable import device as device_module

    monkeypatch.setattr(
        device_module.BleakScanner,
        "find_device_by_address",
        _fake_find_device_by_address,
    )

    resolved = await get_device_from_address("E4:3A:D5:3A:D8:02")
    assert resolved.__class__.__name__ == "Doser"
