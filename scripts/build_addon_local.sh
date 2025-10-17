#!/usr/bin/env bash
# Convenience script to reproduce the GitHub Actions Home Assistant add-on build locally
# 1. Installs frontend dependencies and builds the SPA (npm ci && npm run build)
# 2. Prepares the aquable/build/ directory via scripts/prepare_addon_context.sh
# 3. Invokes the Home Assistant builder container to build multi-arch images

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="${ROOT_DIR}/frontend"
PREPARE_SCRIPT="${ROOT_DIR}/scripts/prepare_addon_context.sh"

DOCKER_USER="${DOCKER_USER:-${USER:-aquable}}"
ADDON_VERSION="${ADDON_VERSION:-dev}"
BUILDER_IMAGE="${BUILDER_IMAGE:-ghcr.io/home-assistant/amd64-builder:latest}"
# If set, docker will pass --platform to the builder container (useful on Apple Silicon)
DOCKER_RUN_PLATFORM="${DOCKER_RUN_PLATFORM:-}"

# If true, the builder will push images to the registry. Defaults to false for local testing.
PUSH_IMAGES="${PUSH_IMAGES:-false}"

check_binary() {
    if ! command -v "$1" >/dev/null 2>&1; then
        echo "Error: required command '$1' not found in PATH" >&2
        exit 1
    fi
}

check_binary docker
check_binary npm

if [ ! -f "${PREPARE_SCRIPT}" ]; then
    echo "Error: prepare script not found at ${PREPARE_SCRIPT}" >&2
    exit 1
fi

echo "[1/4] Installing frontend dependencies and building dist/"
(
    cd "${FRONTEND_DIR}"
    npm ci
    npm run build
)

echo "[2/4] Preparing Home Assistant add-on build context"
"${PREPARE_SCRIPT}"

if [ "${ADDON_VERSION}" = "dev" ]; then
    VERSION_ARGS="--version dev --no-latest"
else
    VERSION_ARGS="--version ${ADDON_VERSION}"
fi

echo "[3/4] Running Home Assistant builder container"
DOCKER_RUN_OPTS=(--rm --privileged -v /var/run/docker.sock:/var/run/docker.sock -v "${ROOT_DIR}":/data)
if [ -n "${DOCKER_RUN_PLATFORM}" ]; then
    # pass platform if requested (e.g. linux/amd64)
    DOCKER_RUN_OPTS=("--platform" "${DOCKER_RUN_PLATFORM}" "${DOCKER_RUN_OPTS[@]}")
fi

docker run ${DOCKER_RUN_OPTS[@]} \
    "${BUILDER_IMAGE}" \
    --target aquable \
    --docker-hub "ghcr.io/${DOCKER_USER}" \
    --image "aquable" \
    --all \
    ${VERSION_ARGS}

printf "\n[4/4] Build complete. Artifacts cached under aquable/build/.\n"
