#!/usr/bin/env bash
# Prepare Home Assistant add-on build context by copying project sources into hassio/build
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="${ROOT_DIR}/hassio/build"

rm -rf "${BUILD_DIR}"
mkdir -p "${BUILD_DIR}"

# Copy Python packaging metadata
cp "${ROOT_DIR}/pyproject.toml" "${ROOT_DIR}/setup.cfg" "${ROOT_DIR}/MANIFEST.in" "${BUILD_DIR}/"

# Copy backend source
rsync -a --delete "${ROOT_DIR}/src/" "${BUILD_DIR}/src/"

# Copy frontend source
rsync -a --delete "${ROOT_DIR}/frontend/" "${BUILD_DIR}/frontend/"
