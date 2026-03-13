# AquaBle Project Assessment - March 2026

## Project Summary
**AquaBle** is a specialized Home Assistant add-on designed to control Chihiros aquarium devices (specifically LED lights and dosing pumps) via Bluetooth Low Energy (BLE). It acts as a bridge between the Home Assistant ecosystem and these BLE-enabled devices.

- **Backend:** A Python-based service using **FastAPI** for the web interface and REST API. It utilizes the **Bleak** library for BLE communication and **Uvicorn** as the ASGI server.
- **Frontend:** A modern Single Page Application (SPA) built with **React and TypeScript**, served directly by the backend and optimized for **Home Assistant Ingress**.
- **Persistence:** A unified storage system that saves device configurations, schedules, and last-known statuses as individual JSON files in the `/data` directory.

## Program Flow
1.  **Initialization:** Upon startup, the FastAPI application initializes the `BLEService` singleton. This service loads all known device configurations from disk and initiates background workers.
2.  **Background Tasks:** 
    - **Auto-Discovery:** Periodically scans for supported Chihiros devices that haven't been configured yet.
    - **Auto-Reconnect:** Attempts to re-establish connections with previously known devices to maintain a "live" state.
    - **Health Checks:** Periodically pings connected devices to ensure the BLE connection remains active.
3.  **API & UI Interaction:** The frontend communicates with the backend via a REST API. When a user changes a setting (like brightness or a dosing schedule), the request is routed through the `BLEService`, which encodes the command into the specific BLE protocol for that device and sends it.
4.  **Status Updates:** The service listens for BLE notifications from devices. These raw payloads are parsed into structured models (e.g., `LightStatus`, `DoserStatus`) and then persisted to disk and cached for immediate UI updates.

## Strengths
- **Clean Architecture:** There is a clear separation of concerns between the BLE orchestration (`ble_service.py`), the device-specific protocols (`src/aquable/device/`), and the API layer.
- **Robust Connection Management:** The use of `bleak_retry_connector` and dedicated background workers for reconnection and health checks suggests a focus on stability in a potentially "noisy" BLE environment.
- **Seamless Integration:** The project is deeply integrated with Home Assistant, specifically handling Ingress requirements like IP restriction and dynamic base path injection for assets.
- **Extensible Design:** The use of abstract base classes for devices and storage makes it straightforward to add support for new Chihiros models as they are reverse-engineered.

## Weaknesses & Observations
- **Hardcoded Ingress Assumptions:** The security middleware relies on a hardcoded Ingress gateway IP (`172.30.32.2`). While standard for Home Assistant, it might limit flexibility in custom networking environments.
- **JSON Storage Scaling:** While perfectly adequate for typical aquarium setups (a few lights and pumps), the per-device JSON file approach might become cumbersome if the project ever expands to manage dozens of devices or very long command histories.
- **BLE Hardware Sensitivity:** Like all BLE projects, its performance is heavily dependent on the host's Bluetooth hardware and the quality of the virtualization/containerization layer in Home Assistant.
