# AquaBle Technical Assessment - March 2026

## Concurrency & BLE Communication

### 1. Operation Locking Strategy
The system employs multiple layers of locking:
- **`CommandExecutor._device_locks`:** Prevents concurrent commands from being sent to the same device at the API level.
- **`BLEService._lock`:** Protects the internal `_devices` map during discovery and connection.
- **`BaseDevice._operation_lock`:** Ensures only one BLE operation (write/read) happens at a time per device.
- **`BaseDevice._connect_lock`:** Prevents multiple concurrent connection attempts to the same device.

**Observation:** While robust, this many layers of locking could potentially lead to deadlocks if not carefully managed, especially during complex multi-step operations like the Doser configuration.

### 2. Status Event & Message Correlation
- **Issue:** `BaseDevice.wait_for_status` uses a simple `asyncio.Event`. If two tasks are waiting for status, they both wake up when *any* status notification arrives.
- **Risk:** There is no correlation between the `message_id` sent in a command and the `message_id` received in a notification. A task might receive a "success" status meant for a different command.
- **Recommendation:** Implement a response-tracking mechanism that uses the `message_id` to route notifications to the specific task that requested them.

### 3. Doser Command Efficiency
- **Issue:** The `set_daily_dose` method in `Doser` sends 8 separate BLE commands. Each command involves acquiring the `_operation_lock`, ensuring connectivity, and performing a GATT write.
- **Efficiency:** This is relatively slow and increases the window for communication failure.
- **Recommendation:** Investigate if the device supports batching multiple commands into a single UART frame (though protocol limitations may prevent this). At minimum, the `_send_command` logic could be optimized to send a list of commands while holding the lock once.

## Architecture & Logic

### 1. Redundant Connectivity Checks
- `_ensure_connected` is called at the start of every `_send_command`. For the 8-command Doser sequence, this results in 8 calls to a method that acquires a lock and checks client state. While the overhead is small, it's redundant when the connection state is already known to the caller.

### 2. "Manual Mode" Implementation
- **Issue:** `LightDevice.set_manual_mode` is implemented as `await self.set_brightness(0)`.
- **Observation:** In many Chihiros devices, "Manual Mode" and "Auto Mode" are distinct states. Simply setting brightness to 0 may not actually disable the internal schedule timer on the device hardware.

### 3. Pydantic Model Usage in `LightDevice`
- **Issue:** `LightDevice._parse_status` contains a comment about Pydantic models being immutable and the process being "a bit inefficient".
- **Observation:** The code converts Pydantic models to dicts, modifies them, and then suggests the frontend handles the dicts. This breaks the type safety provided by the models.

## Persistence & Storage

### 1. Storage Atomicity
- **Strength:** The storage layer uses temporary files and `replace()` for atomic writes, which is excellent for preventing data corruption during power failures.
- **Scaling:** Storing each device as a separate JSON file is efficient for small numbers of devices but may lead to many small file I/O operations as the device list grows.

### 2. Configuration Syncing
- **Observation:** `CommandExecutor` manually calls helper functions to update the persistent config after a command succeeds.
- **Risk:** If the BLE command succeeds but the storage write fails, the UI will show the old state until the next manual status refresh.

## Security & Best Practices

### 1. Hardcoded Network Assumptions
- **Issue:** `IngressIPRestrictionMiddleware` hardcodes the Ingress gateway IP as `172.30.32.2`.
- **Constraint:** While this is the default for Home Assistant OS, users in custom Docker or networking environments might find their access blocked without an easy way to configure this IP.

### 2. Type Hinting
- **Observation:** `ops.py` uses `service: Any` in many function signatures.
- **Improvement:** Using a Protocol or a base class for the service would provide better IDE support and catch potential errors earlier.

## Potential Bugs

### 1. Message ID Exhaustion
- **Check:** The system tracks `_session_command_count` and resets the message ID after 1000 commands or 24 hours.
- **Edge Case:** If a device is extremely active (e.g., rapid brightness adjustments), it could hit the 1000-command limit quickly. The reset logic is good, but the wrap-around logic in `encoder.py` must be perfectly aligned with the device's expectations to avoid "ghost" commands.

### 2. Timezone Management
- **Observation:** `BLEService` initializes `_display_timezone` using `get_system_timezone()`.
- **Risk:** If the Home Assistant system timezone changes while the add-on is running, the service might continue using the old timezone for schedule calculations until restarted.
