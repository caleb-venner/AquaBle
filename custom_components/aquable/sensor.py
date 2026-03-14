"""Sensor platform for AquaBle devices."""
from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.const import UnitOfVolume
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DEVICE_TYPE_DOSER, DEVICE_TYPE_LIGHT, DOMAIN
from .device_control.status_parser import DoserStatus, LightStatus
from .entity import AquaBleEntity

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry

    from .coordinator import AquaBleCoordinator

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up AquaBle sensors."""
    coordinator: AquaBleCoordinator = hass.data[DOMAIN][entry.entry_id]
    
    entities: list[SensorEntity] = []
    
    if coordinator.device_type == DEVICE_TYPE_DOSER:
        # Device-level sensors
        entities.append(DoserModeSensor(coordinator))
        
        # Create sensors for each of 4 heads
        for head_idx in range(4):
            entities.extend([
                DoserHeadModeSensor(coordinator, head_idx),
                DoserDosedTodaySensor(coordinator, head_idx),
                DoserHeadTargetDoseSensor(coordinator, head_idx),
                DoserHeadScheduleTimeSensor(coordinator, head_idx),
                DoserLifetimeTotalSensor(coordinator, head_idx),
            ])
    elif coordinator.device_type == DEVICE_TYPE_LIGHT:
        entities.extend([
            LightModeSensor(coordinator),
            LightSchedulesSensor(coordinator),
        ])
    
    async_add_entities(entities)


class DoserModeSensor(AquaBleEntity, SensorEntity):
    """Sensor showing current doser device mode."""

    _attr_icon = "mdi:water-pump"

    def __init__(self, coordinator: AquaBleCoordinator) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator, "mode")
        self._attr_name = "Mode"
        self._attr_translation_key = "mode"

    @property
    def native_value(self) -> str | None:
        """Return the current mode."""
        if not isinstance(self.coordinator.data, DoserStatus):
            return None
        
        # Chihiros dosers are generally always in 'auto' mode if connected
        return "auto"


class DoserHeadModeSensor(AquaBleEntity, SensorEntity):
    """Sensor showing mode for a specific doser head."""

    _attr_icon = "mdi:cog"

    def __init__(self, coordinator: AquaBleCoordinator, head_idx: int) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator, f"head_{head_idx}_mode")
        self._head_idx = head_idx
        self._attr_name = f"Head {head_idx + 1} mode"
        self._attr_translation_key = "head_mode"

    @property
    def native_value(self) -> str | None:
        """Return the head mode."""
        if not isinstance(self.coordinator.data, DoserStatus):
            return None
        
        status: DoserStatus = self.coordinator.data
        if self._head_idx >= len(status.heads):
            return None
        
        return status.heads[self._head_idx].mode_label()


class DoserDosedTodaySensor(AquaBleEntity, SensorEntity):
    """Sensor showing mL dosed today for a doser head."""
    
    _attr_state_class = SensorStateClass.TOTAL_INCREASING
    _attr_native_unit_of_measurement = UnitOfVolume.MILLILITERS
    _attr_device_class = SensorDeviceClass.VOLUME
    _attr_icon = "mdi:water"
    
    def __init__(self, coordinator: AquaBleCoordinator, head_idx: int) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator, f"head_{head_idx}_dosed_today")
        self._head_idx = head_idx
        self._attr_name = f"Head {head_idx + 1} dosed today"
        self._attr_translation_key = "dosed_today"
    
    @property
    def native_value(self) -> float | None:
        """Return the amount dosed today in mL."""
        if not isinstance(self.coordinator.data, DoserStatus):
            return None
        
        status: DoserStatus = self.coordinator.data
        if self._head_idx >= len(status.heads):
            return None
        
        return status.heads[self._head_idx].dosed_ml()


class DoserHeadTargetDoseSensor(AquaBleEntity, SensorEntity):
    """Sensor showing daily target dose for a doser head."""

    _attr_native_unit_of_measurement = UnitOfVolume.MILLILITERS
    _attr_device_class = SensorDeviceClass.VOLUME
    _attr_icon = "mdi:water-check"

    def __init__(self, coordinator: AquaBleCoordinator, head_idx: int) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator, f"head_{head_idx}_target_dose")
        self._head_idx = head_idx
        self._attr_name = f"Head {head_idx + 1} target dose"
        self._attr_translation_key = "target_dose"

    @property
    def native_value(self) -> float | None:
        """Return the target dose in mL."""
        if not isinstance(self.coordinator.data, DoserStatus):
            return None
        
        status: DoserStatus = self.coordinator.data
        if self._head_idx >= len(status.tail_targets):
            return None
        
        # tail_targets values are in mL
        return float(status.tail_targets[self._head_idx])


class DoserHeadScheduleTimeSensor(AquaBleEntity, SensorEntity):
    """Sensor showing scheduled dose time for a doser head."""

    _attr_icon = "mdi:clock-outline"

    def __init__(self, coordinator: AquaBleCoordinator, head_idx: int) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator, f"head_{head_idx}_schedule_time")
        self._head_idx = head_idx
        self._attr_name = f"Head {head_idx + 1} schedule time"
        self._attr_translation_key = "schedule_time"

    @property
    def native_value(self) -> str | None:
        """Return the scheduled time."""
        if not isinstance(self.coordinator.data, DoserStatus):
            return None
        
        status: DoserStatus = self.coordinator.data
        if self._head_idx >= len(status.heads):
            return None
        
        head = status.heads[self._head_idx]
        return f"{head.hour:02d}:{head.minute:02d}"


class DoserLifetimeTotalSensor(AquaBleEntity, SensorEntity):
    """Sensor showing lifetime total mL dispensed for a doser head."""
    
    _attr_state_class = SensorStateClass.TOTAL_INCREASING
    _attr_native_unit_of_measurement = UnitOfVolume.MILLILITERS
    _attr_device_class = SensorDeviceClass.VOLUME
    _attr_icon = "mdi:counter"
    
    def __init__(self, coordinator: AquaBleCoordinator, head_idx: int) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator, f"head_{head_idx}_lifetime_total")
        self._head_idx = head_idx
        self._attr_name = f"Head {head_idx + 1} lifetime total"
        self._attr_translation_key = "lifetime_total"
    
    @property
    def native_value(self) -> float | None:
        """Return the lifetime total in mL."""
        if not isinstance(self.coordinator.data, DoserStatus):
            return None
        
        status: DoserStatus = self.coordinator.data
        lifetime_totals = status.lifetime_totals_ml()
        
        if self._head_idx >= len(lifetime_totals):
            return None
        
        return lifetime_totals[self._head_idx]


class LightModeSensor(AquaBleEntity, SensorEntity):
    """Sensor showing current light mode."""
    
    _attr_icon = "mdi:lightbulb-cog"
    
    def __init__(self, coordinator: AquaBleCoordinator) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator, "mode")
        self._attr_name = "Mode"
        self._attr_translation_key = "mode"
    
    @property
    def native_value(self) -> str | None:
        """Return the current mode."""
        if not isinstance(self.coordinator.data, LightStatus):
            return None
        
        # Mode determination logic - could be enhanced based on actual status data
        status: LightStatus = self.coordinator.data
        
        # Check if we have keyframes (indicates auto mode scheduled)
        if status.keyframes:
            return "auto"
        
        return "manual"
    
    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return additional state attributes."""
        if not isinstance(self.coordinator.data, LightStatus):
            return {}
        
        status: LightStatus = self.coordinator.data
        attrs = {}
        
        if status.weekday is not None:
            attrs["weekday"] = status.weekday
        if status.hour is not None and status.minute is not None:
            attrs["time"] = f"{status.hour:02d}:{status.minute:02d}"
        if status.keyframes:
            attrs["keyframe_count"] = len(status.keyframes)
        
        return attrs


class LightSchedulesSensor(AquaBleEntity, SensorEntity):
    """Sensor showing active auto mode schedules."""
    
    _attr_icon = "mdi:calendar-clock"
    
    def __init__(self, coordinator: AquaBleCoordinator) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator, "schedules")
        self._attr_name = "Active Schedules"
        self._attr_translation_key = "schedules"
    
    @property
    def native_value(self) -> int:
        """Return the number of active schedules."""
        return len(self.coordinator.active_schedules)
    
    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return schedules as attributes."""
        return {
            "schedules": self.coordinator.active_schedules,
            "schedule_count": len(self.coordinator.active_schedules),
            "max_schedules": 24,
            "remaining_slots": 24 - len(self.coordinator.active_schedules),
        }
