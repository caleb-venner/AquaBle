"""Config flow for AquaBle integration."""
from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.components.bluetooth import BluetoothServiceInfoBleak
from homeassistant.const import CONF_ADDRESS, CONF_NAME
from homeassistant.config_entries import ConfigFlowResult

from .const import CONF_DEVICE_TYPE, DEVICE_TYPE_DOSER, DEVICE_TYPE_LIGHT, DOMAIN

_LOGGER = logging.getLogger(__name__)

# Known device model codes for type detection
DOSER_MODEL_CODES = [
    "DYDOSE",  # Dosing Pump model codes
    "DYDOS",
    "PUMP",
]

LIGHT_MODEL_CODES = [
    "DYWPRO", "DYWPR",  # WRGB II Pro
    "DYU",  # Universal WRGB
    "DYSILN", "DYSL",  # WRGB II Slim
    "DYNC2", "DYNC",  # C II
    "DYSSD", "DYZSD",  # Z Light Tiny
    "DYLED",  # Commander 4
    "DYCOM",  # Commander 1
    "DYNA2",  # A II
    "DYNWRGB", "DYNW", # WRGB II
]


def _detect_device_type_from_name(device_name: str) -> str:
    """Detect device type from Bluetooth device name."""
    if not device_name:
        return DEVICE_TYPE_LIGHT  # Default to light
    
    name_upper = device_name.upper()
    
    # Check against known model codes (anywhere in name)
    if any(code in name_upper for code in DOSER_MODEL_CODES):
        return DEVICE_TYPE_DOSER
    if any(code in name_upper for code in LIGHT_MODEL_CODES):
        return DEVICE_TYPE_LIGHT
    
    # Fallback to keyword detection in full name
    name_lower = device_name.lower()
    if any(keyword in name_lower for keyword in ["doser", "dosing", "pump"]):
        return DEVICE_TYPE_DOSER
    if any(keyword in name_lower for keyword in ["wrgb", "light", "led", "commander"]):
        return DEVICE_TYPE_LIGHT
    
    return DEVICE_TYPE_LIGHT  # Default to light if unknown


class AquaBleConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for AquaBle."""

    VERSION = 1

    def __init__(self) -> None:
        """Initialize the config flow."""
        self._discovery_info: BluetoothServiceInfoBleak | None = None
        self._discovered_device_type: str | None = None

    async def async_step_bluetooth(
        self, discovery_info: BluetoothServiceInfoBleak
    ) -> ConfigFlowResult:
        """Handle bluetooth discovery."""
        await self.async_set_unique_id(discovery_info.address)
        self._abort_if_unique_id_configured()

        self._discovery_info = discovery_info

        # Detect device type using enhanced detection
        name = discovery_info.name or ""
        self._discovered_device_type = _detect_device_type_from_name(name)
        
        _LOGGER.info(
            "Discovered Chihiros device: %s (%s) - Type: %s",
            name,
            discovery_info.address,
            self._discovered_device_type,
        )

        self.context["title_placeholders"] = {"name": name}
        return await self.async_step_bluetooth_confirm()

    async def async_step_bluetooth_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Confirm bluetooth discovery."""
        assert self._discovery_info is not None

        if user_input is not None:
            return self.async_create_entry(
                title=self._discovery_info.name or self._discovery_info.address,
                data={
                    CONF_ADDRESS: self._discovery_info.address,
                    CONF_NAME: self._discovery_info.name or self._discovery_info.address,
                    CONF_DEVICE_TYPE: self._discovered_device_type,
                },
            )

        return self.async_show_form(
            step_id="bluetooth_confirm",
            description_placeholders={"name": self._discovery_info.name or self._discovery_info.address},
        )

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle manual device entry."""
        errors: dict[str, str] = {}

        if user_input is not None:
            await self.async_set_unique_id(user_input[CONF_ADDRESS])
            self._abort_if_unique_id_configured()

            return self.async_create_entry(
                title=user_input[CONF_NAME],
                data=user_input,
            )

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_ADDRESS): str,
                    vol.Required(CONF_NAME): str,
                    vol.Required(CONF_DEVICE_TYPE): vol.In(
                        {
                            DEVICE_TYPE_DOSER: "Doser",
                            DEVICE_TYPE_LIGHT: "Light",
                        }
                    ),
                }
            ),
            errors=errors,
        )
