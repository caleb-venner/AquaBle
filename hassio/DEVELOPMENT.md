# Home Assistant Add-on Development

This directory contains the Home Assistant add-on configuration for AquaBle.

## Local Testing

To test the add-on locally:

### 1. Install Home Assistant (if not already installed)

Use Home Assistant OS, Supervised, or Container installation.

### 2. Copy add-on to local add-ons directory

```bash
# For Home Assistant OS/Supervised
sudo mkdir -p /usr/share/hassio/addons/local/aquable
sudo cp -r hassio/* /usr/share/hassio/addons/local/aquable/

# Or create a symlink for easier development
sudo ln -s /path/to/aquable/hassio /usr/share/hassio/addons/local/aquable
```

### 3. Reload add-ons

1. Go to **Supervisor** → **Add-on Store**
2. Click the refresh icon (⟳) in the top right
3. Scroll to **Local Add-ons** section
4. You should see **AquaBle** listed

### 4. Install and test

1. Click on the AquaBle add-on
2. Click **Install**
3. Configure options if needed
4. Start the add-on
5. Check the **Log** tab for any errors
6. Access the web interface at `http://homeassistant.local:8000`

## Building Multi-Architecture Images

Home Assistant supports multiple architectures. To build for all platforms:

```bash
# Install Home Assistant Builder
docker pull homeassistant/amd64-builder

# Build all architectures
docker run --rm --privileged \
  -v /path/to/aquable:/data \
  homeassistant/amd64-builder \
  --all -t hassio
```

Or use the GitHub Actions workflow (`.github/workflows/build-addon.yml`) which builds automatically on push.

## Publishing to Repository

### Option 1: Add to existing Home Assistant add-ons repository

If you have a Home Assistant add-ons repository:

1. Copy the `hassio/` directory to your repository
2. Update the repository's configuration
3. Push changes

### Option 2: Create a standalone repository

1. Create a new GitHub repository (e.g., `hassio-addons`)
2. Create `repository.json`:

```json
{
  "name": "AquaBle Add-ons",
  "url": "https://github.com/caleb-venner/hassio-addons",
  "maintainer": "Caleb Venner"
}
```

3. Add the `hassio/` contents as `aquable/` directory
4. Users can add your repository URL in Home Assistant

### Option 3: Submit to official Home Assistant add-ons

Follow the [Home Assistant Add-on Tutorial](https://developers.home-assistant.io/docs/add-ons) for submission guidelines.

## File Structure

```
hassio/
├── config.json          # Add-on metadata and configuration schema
├── build.json           # Multi-architecture build configuration
├── Dockerfile           # Container build instructions
├── run.sh               # Add-on startup script
├── README.md            # User-facing documentation
├── CHANGELOG.md         # Version history
├── icon.png             # Add-on icon (256x256)
└── logo.png             # Add-on logo (128x128)
```

## Configuration Options

The add-on supports these configuration options (defined in `config.json`):

- `auto_reconnect` (bool): Auto-reconnect to devices
- `auto_discover` (bool): Auto-discover devices on startup
- `status_wait_seconds` (float): Wait time for status responses
- `timezone` (string): Display timezone for schedules

These map to environment variables:
- `AQUA_BLE_AUTO_RECONNECT`
- `AQUA_BLE_AUTO_DISCOVER`
- `AQUA_BLE_STATUS_WAIT`
- `AQUA_BLE_DISPLAY_TIMEZONE`

## Debugging

View add-on logs in Home Assistant:
1. Go to **Supervisor** → **AquaBle**
2. Click the **Log** tab

Or use CLI:
```bash
ha addons logs aquable
```

Connect to add-on container:
```bash
docker exec -it addon_local_aquable /bin/bash
```

## Resources

- [Home Assistant Add-on Documentation](https://developers.home-assistant.io/docs/add-ons)
- [Add-on Configuration Reference](https://developers.home-assistant.io/docs/add-ons/configuration)
- [Bashio Add-on Library](https://github.com/hassio-addons/bashio)
