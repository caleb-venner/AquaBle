"""The AquaBle integration."""
from __future__ import annotations

import logging

from homeassistant.components import bluetooth
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_ADDRESS, CONF_NAME, Platform
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryNotReady

from .const import CONF_DEVICE_TYPE, DEVICE_TYPE_DOSER, DEVICE_TYPE_LIGHT, DOMAIN
from .coordinator import AquaBleCoordinator
from .device_control.device import get_model_class_from_name

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [
    Platform.SENSOR,
]


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up AquaBle from a config entry."""
    address = entry.data[CONF_ADDRESS]
    device_type = entry.data[CONF_DEVICE_TYPE]
    device_name = entry.data.get(CONF_NAME, address)

    _LOGGER.debug("Setting up AquaBle device: %s (%s)", address, device_type)

    # Get BLE device from Home Assistant's bluetooth integration
    ble_device = bluetooth.async_ble_device_from_address(hass, address, connectable=True)
    if not ble_device:
        raise ConfigEntryNotReady(f"Could not find device {address}")

    # Get the correct model class based on device name
    try:
        model_class = get_model_class_from_name(device_name)
        device = model_class(ble_device)
    except RuntimeError as err:
        _LOGGER.error("Failed to find model for device %s: %s", device_name, err)
        return False

    # Create coordinator
    coordinator = AquaBleCoordinator(hass, device, device_type, entry)

    # Fetch initial data
    await coordinator.async_config_entry_first_refresh()

    # Store coordinator
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = coordinator

    # Forward to platforms
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # Register services
    await _async_register_services(hass)

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    _LOGGER.debug("Unloading AquaBle device: %s", entry.data[CONF_ADDRESS])

    # Unload platforms
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    if unload_ok:
        # Disconnect device and remove coordinator
        coordinator: AquaBleCoordinator = hass.data[DOMAIN].pop(entry.entry_id)
        if coordinator.device.is_connected:
            await coordinator.device.disconnect()

    return unload_ok


async def _async_register_services(hass: HomeAssistant) -> None:
    """Register integration services."""
    
    async def handle_doser_set_head_schedule(call):
        """Handle doser_set_head_schedule service call."""
        device_id = call.data["device_id"]
        head_index = call.data["head_index"]
        volume_ml = call.data["volume_ml"]
        hour = call.data["hour"]
        minute = call.data["minute"]
        weekdays = call.data.get("weekdays")
        
        # Get coordinator from device_id
        coordinator = _get_coordinator_from_device_id(hass, device_id)
        if not coordinator or coordinator.device_type != DEVICE_TYPE_DOSER:
            _LOGGER.error("Invalid doser device: %s", device_id)
            return
        
        device: Doser = coordinator.device
        
        # Convert weekdays from service format to device format
        weekday_list = None
        if weekdays:
            # Map abbreviated days to full names for encoder
            day_map = {
                "mon": "monday", "tue": "tuesday", "wed": "wednesday",
                "thu": "thursday", "fri": "friday", "sat": "saturday", "sun": "sunday"
            }
            weekday_list = [day_map.get(d, d) for d in weekdays]
        
        # Send command to device
        await device.set_daily_dose(
            head_index=head_index + 1,  # Convert to 1-based for device
            volume_tenths_ml=int(volume_ml * 10),  # Convert to tenths
            hour=hour,
            minute=minute,
            weekdays=weekday_list,
            confirm=True,
        )
        
        # Refresh coordinator
        await coordinator.async_request_refresh()
        _LOGGER.info(
            "Doser head %d schedule set: %.1f mL at %02d:%02d",
            head_index, volume_ml, hour, minute
        )
    
    async def handle_light_set_manual_mode(call):
        """Handle light_set_manual_mode service call."""
        device_id = call.data["device_id"]
        
        # Get coordinator from device_id
        coordinator = _get_coordinator_from_device_id(hass, device_id)
        if not coordinator or coordinator.device_type != DEVICE_TYPE_LIGHT:
            _LOGGER.error("Invalid light device: %s", device_id)
            return
        
        device: LightDevice = coordinator.device
        
        # Build brightness tuple from provided channels in the correct ID order
        brightness_values = []
        for _, channel_id in sorted(device._colors.items(), key=lambda x: x[1]):
            # Get color name for this channel ID
            color_name = next(name for name, cid in device._colors.items() if cid == channel_id)
            value = call.data.get(color_name, 0)
            brightness_values.append(int(value))
        
        # Send brightness command
        await device.set_brightness(tuple(brightness_values))
        
        # Refresh coordinator
        await coordinator.async_request_refresh()
        _LOGGER.info("Light manual mode set: %s", brightness_values)
    
    async def handle_light_set_auto_schedule(call):
        """Handle light_set_auto_schedule service call."""
        import datetime
        device_id = call.data["device_id"]
        name = call.data.get("name", "Unnamed Schedule")
        sunrise_hour = call.data["sunrise_hour"]
        sunrise_minute = call.data["sunrise_minute"]
        sunset_hour = call.data["sunset_hour"]
        sunset_minute = call.data["sunset_minute"]
        
        # Extract channel brightness values
        channels = {}
        for color in ["white", "red", "green", "blue"]:
            if color in call.data:
                channels[color] = call.data[color]
        
        # Get coordinator from device_id
        coordinator = _get_coordinator_from_device_id(hass, device_id)
        if not coordinator or coordinator.device_type != DEVICE_TYPE_LIGHT:
            _LOGGER.error("Invalid light device: %s", device_id)
            return
        
        device: LightDevice = coordinator.device
        
        # Check schedule limit (max 24)
        if len(coordinator.active_schedules) >= 24:
            _LOGGER.warning("Maximum of 24 schedules reached, cannot add more")
            return
        
        # Map color names to channel IDs for the device
        brightness_dict = {}
        for color_name, channel_id in device._colors.items():
            if color_name in channels:
                brightness_dict[channel_id] = channels[color_name]
        
        # Send BLE command to device with schedule
        await device.add_auto_setting(
            datetime.time(sunrise_hour, sunrise_minute),
            datetime.time(sunset_hour, sunset_minute),
            brightness=brightness_dict
        )
        
        # Track the schedule
        schedule = {
            "name": name,
            "sunrise_hour": sunrise_hour,
            "sunrise_minute": sunrise_minute,
            "sunset_hour": sunset_hour,
            "sunset_minute": sunset_minute,
            "channels": channels,
        }
        coordinator.active_schedules.append(schedule)
        
        # Persist schedules to config entry
        hass.config_entries.async_update_entry(
            coordinator.config_entry,
            options={**coordinator.config_entry.options, "active_schedules": coordinator.active_schedules}
        )
        
        # Refresh coordinator
        await coordinator.async_request_refresh()
        _LOGGER.info(
            "Light auto schedule added: %s (%02d:%02d - %02d:%02d), Total: %d/24",
            name, sunrise_hour, sunrise_minute, sunset_hour, sunset_minute,
            len(coordinator.active_schedules)
        )
    
    async def handle_light_set_mode(call):
        """Handle light_set_mode service call."""
        device_id = call.data["device_id"]
        mode = call.data["mode"]
        
        # Get coordinator from device_id
        coordinator = _get_coordinator_from_device_id(hass, device_id)
        if not coordinator or coordinator.device_type != DEVICE_TYPE_LIGHT:
            _LOGGER.error("Invalid light device: %s", device_id)
            return
        
        device: LightDevice = coordinator.device
        
        if mode == "manual":
            await device.set_manual_mode()
        elif mode == "auto":
            await device.enable_auto_mode()
        elif mode == "off":
            await device.turn_off()
        
        # Refresh coordinator
        await coordinator.async_request_refresh()
        _LOGGER.info("Light mode set to: %s", mode)
    
    async def handle_light_clear_schedules(call):
        """Handle light_clear_schedules service call."""
        device_id = call.data["device_id"]
        
        # Get coordinator from device_id
        coordinator = _get_coordinator_from_device_id(hass, device_id)
        if not coordinator or coordinator.device_type != DEVICE_TYPE_LIGHT:
            _LOGGER.error("Invalid light device: %s", device_id)
            return
        
        # Send BLE command to clear settings on device
        await coordinator.device.reset_settings()
        
        # Clear tracked schedules
        coordinator.active_schedules = []
        
        # Persist to config entry
        hass.config_entries.async_update_entry(
            coordinator.config_entry,
            options={**coordinator.config_entry.options, "active_schedules": []}
        )
        
        # Refresh coordinator
        await coordinator.async_request_refresh()
        _LOGGER.info("All light schedules cleared")
    
    # Register services
    hass.services.async_register(DOMAIN, "doser_set_head_schedule", handle_doser_set_head_schedule)
    hass.services.async_register(DOMAIN, "light_set_manual_mode", handle_light_set_manual_mode)
    hass.services.async_register(DOMAIN, "light_set_auto_schedule", handle_light_set_auto_schedule)
    hass.services.async_register(DOMAIN, "light_set_mode", handle_light_set_mode)
    hass.services.async_register(DOMAIN, "light_clear_schedules", handle_light_clear_schedules)


def _get_coordinator_from_device_id(hass: HomeAssistant, device_id: str) -> AquaBleCoordinator | None:
    """Get coordinator from device_id."""
    from homeassistant.helpers import device_registry as dr
    
    device_registry = dr.async_get(hass)
    device_entry = device_registry.async_get(device_id)
    
    if not device_entry:
        return None
    
    # Find config entry from device identifiers
    for entry_id, coordinator in hass.data.get(DOMAIN, {}).items():
        if not isinstance(coordinator, AquaBleCoordinator):
            continue
        
        # Match by checking if device identifier matches coordinator device address
        for identifier in device_entry.identifiers:
            if identifier[0] == DOMAIN and identifier[1] == coordinator.device.address:
                return coordinator
    
    return None
