"""Chihiros dosing pump device model."""

from __future__ import annotations

from typing import Any, ClassVar, Sequence

from .. import encoder as doser_commands
from ..models import DoserStatus
from ..status_parser import parse_doser_payload
from .base_device import BaseDevice


class Doser(BaseDevice):
    """Chihiros four-head dosing pump."""

    device_kind: ClassVar[str] = "doser"
    status_serializer: ClassVar[str | None] = "serialize_doser_status"
    _model_name = "Dosing Pump"
    _model_codes = ["DYDOSE"]

    def __init__(self, *args, **kwargs) -> None:
        """Initialize the doser."""
        super().__init__(*args, **kwargs)
        # Initialize with empty status to ensure update_from works
        self.last_status = DoserStatus(
            message_id=None,
            response_mode=None,
            weekday=None,
            hour=None,
            minute=None,
            heads=[],
            tail_targets=[],
            tail_flag=None,
            tail_raw=b"",
            lifetime_totals_tenths_ml=[],
        )

    def _notification_handler(self, _sender: Any, data: bytearray) -> None:
        """Handle an incoming UART notification from the pump with status merging."""
        self._logger.debug("%s: Notification received: %s", self.name, data.hex())
        try:
            status = self._parse_status(data)
            if status:
                if isinstance(self.last_status, DoserStatus) and isinstance(
                    status, DoserStatus
                ):
                    self.last_status.update_from(status)
                else:
                    self.last_status = status
                self._status_event.set()
        except Exception:
            self._logger.exception("Failed to parse doser status notification")

    async def request_status(self) -> None:
        """Send a handshake to ask the pump for its latest status."""
        cmd = doser_commands.create_handshake_command(self.get_next_msg_id())
        await self._send_command(cmd, 3)

    def _parse_status(self, data: bytearray) -> Any:
        """Handle an incoming UART notification from the pump."""
        if not data:
            return None

        # Validate basic structure: must start with 0x5B and be long enough
        if data[0] != 0x5B or len(data) < 6:
            self._logger.debug("%s: Invalid payload structure: %s", self.name, data.hex())
            return None

        # Discriminate by response mode
        mode = data[5]

        # Parse modes 0xFE (schedule/current data) and 0x1E (lifetime totals)
        if mode not in (0xFE, 0x1E):
            self._logger.debug(
                "%s: Received non-status payload (mode 0x%02X): %s",
                self.name,
                mode,
                data.hex(),
            )
            return None

        try:
            return parse_doser_payload(data)
        except Exception:
            self._logger.exception("Failed to parse doser status payload (mode 0x%02X)", mode)
            return None

    async def set_daily_dose(
        self,
        head_index: int,
        volume_tenths_ml: int,
        hour: int,
        minute: int,
        *,
        weekdays: Sequence[str] | None = None,
        confirm: bool = False,
        wait_seconds: float = 1.5,
    ) -> DoserStatus | None:
        """Update daily schedule and optionally refresh status.

        Uses the complete 8-command sequence from ground truth analysis:

        Phase 1 - Prelude (setup and synchronization):
        1. Handshake command (0x5A, mode 0x04) - initial status request
        2. First time sync command (0x5A, mode 0x09) - initial clock sync
        3. Second time sync command (0x5A, mode 0x09) - confirmation sync
        4. Prepare command stage 0x04 (0xA5, mode 0x04) - prepare device
        5. Prepare command stage 0x05 (0xA5, mode 0x04) - confirm prepare
        6. Head select command (0xA5, mode 0x20) - select dosing head

        Phase 2 - Programming (dose configuration):
        7. Head dose command (0xA5, mode 0x1B) - set volume and weekdays
        8. Head schedule command (0xA5, mode 0x15) - set daily time

        This matches both the iPhone app logs and other working implementations.

        Args:
            head_index: 1-based head index (1-4) for 4-head doser devices
        """
        # Convert 1-based index to 0-based for BLE commands
        ble_head_index = head_index - 1

        weekday_mask = doser_commands.encode_weekdays(weekdays)

        # Phase 1: Prelude - Setup and synchronization (6 commands)
        prelude_commands = [
            # 1. Handshake - initial device communication
            doser_commands.create_handshake_command(self.get_next_msg_id()),
            # 2. First time sync - initial device clock synchronization
            doser_commands.create_set_time_command(self.get_next_msg_id()),
            # 3. Second time sync - confirmation sync (iPhone app pattern)
            doser_commands.create_set_time_command(self.get_next_msg_id()),
            # 4. Prepare stage 0x04 - prepare device for configuration
            doser_commands.create_prepare_command(self.get_next_msg_id(), 0x04),
            # 5. Prepare stage 0x05 - confirm device is ready
            doser_commands.create_prepare_command(self.get_next_msg_id(), 0x05),
            # 6. Head select - choose which dosing head to configure (0-based)
            doser_commands.create_head_select_command(self.get_next_msg_id(), ble_head_index),
        ]

        # Send prelude commands sequentially
        for cmd in prelude_commands:
            await self._send_command(bytes(cmd), 3)

        # Phase 2: Programming - Dose configuration (2 commands)
        programming_commands = [
            # 7. Head dose - set volume and weekday schedule (0-based)
            doser_commands.create_head_dose_command(
                self.get_next_msg_id(),
                ble_head_index,
                volume_tenths_ml,
                weekday_mask=weekday_mask,
            ),
            # 8. Head schedule - set daily dosing time (0-based)
            doser_commands.create_head_schedule_command(
                self.get_next_msg_id(), ble_head_index, hour, minute
            ),
        ]

        # Send programming commands sequentially
        for cmd in programming_commands:
            await self._send_command(bytes(cmd), 3)

        if not confirm:
            return None

        await self.request_status()
        await self.wait_for_status(timeout=wait_seconds)
        return self.last_status


# Need to implement further commands.
