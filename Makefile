# Simple dev helpers

# Env flags (overridable). Export so recursive make and recipe shells inherit.
AQUA_BLE_AUTO_DISCOVER ?= 0
export AQUA_BLE_AUTO_DISCOVER

.PHONY: help dev dev-front dev-back build front-build install lint test precommit clean local bump-version

help:
	@echo "make dev        # run frontend (vite) and backend (uvicorn)"
	@echo "make dev-front  # run frontend dev server"
	@echo "make dev-back   # run backend with uvicorn"
	@echo "make install    # install backend deps into .venv with uv"
	@echo "make build      # build frontend and python wheel"
	@echo "make front-build# build frontend only"
	@echo "make lint       # run pre-commit on all files"
	@echo "make test       # run pytest"
	@echo "make precommit  # install and run pre-commit hooks"
	@echo "make local      # test HA add-on build locally"
	@echo "make clean      # delete all saved device state and configs"
	@echo "make clean-dev  # clean then start dev servers"
	@echo "make bump-version VERSION=x.y.z # bump version across all files"

VENV?=.venv
UV?=uv
PY?=python3
UV_PYTHON?=3.12
UV_PYTHON_INSTALL?=1
VENV_BIN?=$(VENV)/bin
VENV_PY?=$(VENV_BIN)/python
VENV_STAMP?=$(VENV)/.uv-venv-$(UV_PYTHON)

$(VENV_STAMP):
	@if [ "$(UV_PYTHON_INSTALL)" = "1" ]; then \
		$(UV) python install $(UV_PYTHON); \
	fi
	UV_VENV_CLEAR=1 $(UV) venv --python $(UV_PYTHON) $(VENV)
	@touch $(VENV_STAMP)

install: $(VENV_STAMP)
	$(UV) pip install --python $(VENV_PY) 'setuptools<81'
	$(UV) pip install --no-build-isolation --python $(VENV_PY) -e .

# Frontend

dev-front:
	cd frontend && npm run dev

front-build:
	cd frontend && npm run build

# Backend

dev-back: install
	PYTHONPATH=src AQUA_BLE_AUTO_RECONNECT=1 $(VENV_BIN)/uvicorn aquable.service:app --reload --host 0.0.0.0 --port 8000

# Combined

dev:
	@echo "Starting dev servers (frontend + backend)"
	@$(MAKE) -j2 AQUA_BLE_AUTO_DISCOVER=0 dev-front dev-back

# Build & quality

build: front-build install
	@if ! $(VENV_PY) -c "import build" >/dev/null 2>&1; then \
		$(UV) pip install --python $(VENV_PY) build; \
	fi
	$(VENV_PY) -m build

lint: install
	@if [ ! -x "$(VENV_BIN)/doc8" ]; then \
		echo "Installing linting tools (black, flake8, isort, doc8)"; \
		$(UV) pip install --python $(VENV_PY) black flake8 isort doc8 flake8-pyprojecttoml; \
	fi
	@echo "Running code quality checks..."
	$(VENV_BIN)/black src/ tests/ frontend/
	$(VENV_BIN)/isort --profile black src/ tests/ frontend/
	$(VENV_BIN)/flake8 src/ tests/ frontend/
	$(VENV_BIN)/doc8 README.md aquable/DOCS.md

precommit:
	@echo "Pre-commit hooks removed - use 'make lint' for code quality checks"

# Tests

test: install
	@if [ ! -x "$(VENV_BIN)/pytest" ]; then \
		$(UV) pip install --python $(VENV_PY) pytest pytest-asyncio; \
	fi
	@if ! $(VENV_PY) -c "import pytest_asyncio" >/dev/null 2>&1; then \
		$(UV) pip install --python $(VENV_PY) pytest-asyncio; \
	fi
	$(VENV_BIN)/pytest -q

# Local add-on testing

local:
	@bash scripts/test_addon_local.sh

# Cleanup

clean:
	@echo "🧹 Cleaning AquaBle state and configs..."
	@echo "📋 This will remove:"
	@echo "   • Device connection state and cache"
	@echo "   • Saved device configurations (dosers, lights)"
	@echo "   • Command history and runtime data"
	@if [ -d "$$HOME/.aqua-ble" ]; then \
		echo "📁 Removing $$HOME/.aqua-ble directory..."; \
		rm -rf "$$HOME/.aqua-ble"; \
		rm -rf "$$HOME/.aquable-test"; \
		echo "✅ Cleaned: All device state, configurations, and cache data removed"; \
	else \
		echo "✨ Already clean: No $$HOME/.aqua-ble directory found"; \
		rm -rf "$$HOME/.aquable-test"; \
	fi

# Convenience target: clean then dev
clean-dev: clean dev

# Release management

bump-version:
	@if [ -z "$(VERSION)" ]; then \
		echo "Error: VERSION not specified"; \
		echo "Usage: make bump-version VERSION=x.y.z"; \
		exit 1; \
	fi
	@bash scripts/bump_version.sh $(VERSION)
