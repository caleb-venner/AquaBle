# AquaBle Development

Guidelines and setup for contributing to the AquaBle Home Assistant integration.

## Setup Environment

This project uses [uv](https://github.com/astral-sh/uv) for dependency management.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/caleb-venner/AquaBle.git
    cd AquaBle
    ```

2.  **Create a virtual environment and install dependencies:**
    ```bash
    uv venv
    source .venv/bin/activate  # On Windows: .venv\Scripts\activate
    uv sync --group dev --group test
    ```

## Testing

The project uses `pytest` for testing.

### Run all tests
```bash
pytest
```

### Run unit tests only
```bash
pytest tests/unit/
```

### Run with coverage
```bash
pytest --cov=custom_components.aquable tests/
```

## Code Quality

Before submitting changes, please ensure your code follows the project's style:

- **Formatting:** The project uses `black` and `isort`.
- **Linting:** Use `flake8` to check for style issues.

```bash
# Format code
black custom_components/aquable/ tests/
isort custom_components/aquable/ tests/

# Run linter
flake8 custom_components/aquable/ tests/
```

## Structure

- `custom_components/aquable/`: Main integration code.
- `custom_components/aquable/device_control/`: Low-level BLE communication and protocol logic.
- `tests/unit/`: Unit tests for logic and parsing.
- `tests/integration/`: Integration tests for Home Assistant components.
