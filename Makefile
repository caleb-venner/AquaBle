# Simple dev helpers

# Env flags (overridable). Export so recursive make and recipe shells inherit.
AQUA_BLE_AUTO_DISCOVER ?= 0
export AQUA_BLE_AUTO_DISCOVER

.PHONY: help dev dev-front dev-back build front-build lint test precommit clean hassio

help:
	@echo "make dev        # run frontend (vite) and backend (uvicorn)"
	@echo "make dev-front  # run frontend dev server"
	@echo "make dev-back   # run backend with uvicorn"
	@echo "make build      # build frontend and python wheel"
	@echo "make front-build# build frontend only"
	@echo "make lint       # run pre-commit on all files"
	@echo "make test       # run pytest"
	@echo "make precommit  # install and run pre-commit hooks"
	@echo "make clean      # delete all saved device state and configs"
	@echo "make clean-build# delete build artifacts (dist, node_modules, etc)"
	@echo "make clean-all  # clean + clean-build"
	@echo "make clean-dev  # clean then start dev servers"

VENV?=.venv
PY?=python3

$(VENV)/bin/activate:
	$(PY) -m venv $(VENV)
	. $(VENV)/bin/activate; pip install -U pip

hassio:
	@echo "Running local add-on build (override DOCKER_USER and ADDON_VERSION if needed)"
	@DOCKER_USER=${DOCKER_USER:-$(shell whoami)} \
		ADDON_VERSION=${ADDON_VERSION:-dev} \
		./scripts/build_addon_local.sh

# Frontend

dev-front:
	cd frontend && npm run dev

front-build:
	cd frontend && npm run build

# Backend

dev-back:
	PYTHONPATH=src AQUA_BLE_AUTO_RECONNECT=1 uvicorn aquable.service:app --reload --host 0.0.0.0 --port 8000

# Combined

dev:
	@echo "Starting dev servers (frontend + backend)"
	@echo "Opening http://localhost:5173 in browser..."
	@(sleep 1; open "http://localhost:5173") &
	@echo "Tip: In VS Code, run the 'dev: full stack' task to launch both in background."
	@$(MAKE) -j2 AQUA_BLE_AUTO_DISCOVER=0 dev-front dev-back

# Build & quality

build: front-build
	$(PY) -m build

lint:
	@if ! command -v pre-commit >/dev/null 2>&1; then \
		echo "Installing pre-commit (missing dependency)"; \
		$(PY) -m pip install pre-commit; \
	fi
	pre-commit run --all-files

precommit:
	pip install pre-commit
	pre-commit install
	pre-commit run --all-files

# Tests

test:
	pytest -q

# Cleanup

clean:
	@echo "🧹 Cleaning AquaBle state and configs..."
	@echo "📋 This will remove:"
	@echo "   • Device connection state and cache"
	@echo "   • Saved device configurations (dosers, lights)"
	@echo "   • Command history and runtime data"
	@if [ -d "$$HOME/.aquable" ]; then \
		echo "📁 Removing $$HOME/.aquable directory..."; \
		rm -rf "$$HOME/.aquable"; \
		echo "✅ Cleaned: All device state, configurations, and cache data removed"; \
	else \
		echo "✨ Already clean: No $$HOME/.aquable directory found"; \
	fi

clean-build:
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf frontend/dist/ frontend/node_modules/ dist/ build/ *.egg-info/
	@echo "✅ Build artifacts cleaned"

clean-all: clean clean-build

# Convenience target: clean then dev
clean-dev: clean dev
