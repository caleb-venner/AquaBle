"""Config flow for AquaBle integration."""

from __future__ import annotations

import json
import logging
import re
from typing import Any

import voluptuous as vol
from homeassistant.components.bluetooth import (
    BluetoothServiceInfoBleak,
    async_discovered_service_info,
)
from homeassistant.config_entries import ConfigFlow, OptionsFlow

try:
    from homeassistant.config_entries import ConfigFlowResult
except ImportError:
    from homeassistant.data_entry_flow import FlowResult as ConfigFlowResult
from homeassistant.const import CONF_ADDRESS, CONF_NAME

from .const import CONF_DEVICE_TYPE, CONF_POWER_PROFILE, DEVICE_REGISTRY, DOMAIN, DeviceModelInfo
from .domain.light.power_profile import PowerProfile

_LOGGER = logging.getLogger(__name__)


def match_device_model(device_name: str | None) -> tuple[str, DeviceModelInfo] | None:
    """Find the best matching model from the registry for a given device name."""
    if not device_name:
        return None
    normalized_name = device_name.strip().upper()
    compact_name = re.sub(r"[^A-Z0-9]", "", normalized_name)

    # Prefer longest model codes first so prefixes do not collide.
    for model_code in sorted(DEVICE_REGISTRY.keys(), key=len, reverse=True):
        if normalized_name.startswith(model_code) or model_code in normalized_name:
            return model_code, DEVICE_REGISTRY[model_code]
        if compact_name.startswith(model_code) or model_code in compact_name:
            return model_code, DEVICE_REGISTRY[model_code]

    return None


class AquaBleConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for AquaBle."""

    VERSION = 1

    @staticmethod
    def async_get_options_flow(config_entry: Any) -> AquaBleOptionsFlowHandler:
        """Return the options flow handler."""
        return AquaBleOptionsFlowHandler(config_entry)

    def __init__(self) -> None:
        """Initialize the config flow."""
        self._discovery_info: BluetoothServiceInfoBleak | None = None
        self._discovered_device_name: str | None = None
        self._discovered_model_info: DeviceModelInfo | None = None
        self._discovered_devices: dict[str, BluetoothServiceInfoBleak] = {}

    async def async_step_bluetooth(
        self, discovery_info: BluetoothServiceInfoBleak
    ) -> ConfigFlowResult:
        """Handle the bluetooth discovery step."""
        await self.async_set_unique_id(discovery_info.address)
        self._abort_if_unique_id_configured()

        match = match_device_model(discovery_info.name)
        if not match:
            return self.async_abort(reason="not_supported")

        _, model_info = match

        self._discovery_info = discovery_info
        self._discovered_device_name = discovery_info.name
        self._discovered_model_info = model_info

        self.context["title_placeholders"] = {"name": self._discovered_device_name}

        return await self.async_step_bluetooth_confirm()

    async def async_step_bluetooth_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Confirm discovery."""
        if self._discovery_info is None or self._discovered_model_info is None:
            return self.async_abort(reason="not_supported")

        if user_input is not None:
            return self.async_create_entry(
                title=self._discovered_device_name or self._discovery_info.address,
                data={
                    CONF_ADDRESS: self._discovery_info.address,
                    CONF_NAME: self._discovered_device_name,
                    CONF_DEVICE_TYPE: self._discovered_model_info.type,
                },
            )

        self._set_confirm_only()
        return self.async_show_form(
            step_id="bluetooth_confirm",
            description_placeholders={
                "name": self._discovered_device_name or self._discovery_info.address
            },
        )

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Handle the user step to manually pick a discovered device."""
        if user_input is not None:
            address = user_input[CONF_ADDRESS]
            discovery_info = self._discovered_devices[address]

            match = match_device_model(discovery_info.name)
            model_info = match[1] if match else None
            device_type = model_info.type if model_info else "light"

            await self.async_set_unique_id(address, raise_on_progress=False)
            self._abort_if_unique_id_configured()

            return self.async_create_entry(
                title=discovery_info.name or address,
                data={
                    CONF_ADDRESS: address,
                    CONF_NAME: discovery_info.name,
                    CONF_DEVICE_TYPE: device_type,
                },
            )

        current_addresses = self._async_current_ids()
        for discovery_info in async_discovered_service_info(self.hass, False):
            address = discovery_info.address
            if address in current_addresses or address in self._discovered_devices:
                continue

            if match_device_model(discovery_info.name):
                self._discovered_devices[address] = discovery_info

        if not self._discovered_devices:
            return self.async_abort(reason="no_devices_found")

        # Create a dictionary of address -> friendly name for the dropdown
        device_options = {
            address: f"{info.name} ({address})"
            for address, info in self._discovered_devices.items()
        }

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_ADDRESS): vol.In(device_options),
                }
            ),
        )


_CONF_PAYLOAD_JSON = "payload_json"


class AquaBleOptionsFlowHandler(OptionsFlow):
    """Options flow for AquaBle — allows uploading a Chihiros cloud payload
    to enable per-device power estimation.

    To obtain the payload JSON:
    1. Log in to the My Chihiros app.
    2. Use a proxy (e.g. mitmproxy) or the Chihiros cloud API to export your
       device list payload.
    3. Paste the full JSON here. AquaBle will extract the entry matching this
       device and store only the relevant power calibration fields.
    """

    def __init__(self, config_entry: Any) -> None:
        """Initialise."""
        self._config_entry = config_entry

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Show the options form."""
        errors: dict[str, str] = {}

        if user_input is not None:
            raw = user_input.get(_CONF_PAYLOAD_JSON, "").strip()

            if not raw:
                # User submitted empty — clear the stored profile.
                new_options = {**self._config_entry.options}
                new_options.pop(CONF_POWER_PROFILE, None)
                return self.async_create_entry(title="", data=new_options)

            try:
                parsed = json.loads(raw)
            except json.JSONDecodeError:
                errors[_CONF_PAYLOAD_JSON] = "invalid_json"
                parsed = None

            if parsed is not None:
                # Support both the raw API envelope {"data": [...]} and a bare list.
                device_list: list = (
                    parsed.get("data", []) if isinstance(parsed, dict) else parsed
                )

                # Match by device_id prefix against the config entry address,
                # or accept the first light device entry if only one is present.
                address: str = self._config_entry.data.get(CONF_ADDRESS, "")
                profile: PowerProfile | None = None

                for device_entry in device_list:
                    if not isinstance(device_entry, dict):
                        continue
                    candidate = PowerProfile.from_payload(device_entry)
                    if candidate is not None:
                        profile = candidate
                        # Prefer an entry whose device_id contains our address.
                        dev_id: str = device_entry.get("device_id", "")
                        if address and address.replace(":", "").upper() in dev_id.upper():
                            break  # definitive match
                        # Otherwise keep iterating in case a better match exists.

                if profile is None:
                    errors[_CONF_PAYLOAD_JSON] = "no_power_data"
                else:
                    new_options = {
                        **self._config_entry.options,
                        CONF_POWER_PROFILE: profile.to_dict(),
                    }
                    return self.async_create_entry(title="", data=new_options)

        # Pre-fill with existing profile JSON if one is already stored.
        existing_json = ""
        if self._config_entry.options.get(CONF_POWER_PROFILE):
            try:
                existing_json = json.dumps(
                    self._config_entry.options[CONF_POWER_PROFILE], indent=2
                )
            except (TypeError, ValueError):
                pass

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Optional(_CONF_PAYLOAD_JSON, default=existing_json): str,
                }
            ),
            errors=errors,
            description_placeholders={
                "device_address": self._config_entry.data.get(CONF_ADDRESS, ""),
            },
        )

