#!/bin/bash
# Development script to build and test all deployment options

set -e

echo "🚀 Building AquaBle - All Deployments"
echo "=================================================="

# Build frontend first (shared by all deployments)
echo "📦 Building frontend..."
cd frontend
npm ci
npm run build
cd ..

# 1. Docker standalone build
echo "🐳 Building Docker image..."
docker build -t aquable:latest -f docker/Dockerfile .

# 2. Home Assistant add-on build (local)
echo "🏠 Building HA add-on (local test)..."
# Note: For full HA add-on testing, use the HA CLI or supervisor
docker build -t aquable:addon -f aquable/Dockerfile .

# 3. Python package build
echo "🐍 Building Python package..."
python -m build

echo "✅ All builds completed successfully!"
echo ""
echo "🧪 Testing options:"
echo "  Docker:     docker-compose -f docker/docker-compose.yml up"
echo "  Local:      python -m src.aquable.service"
echo "  Package:    pip install dist/*.whl"
echo ""
echo "📋 Next steps for HA add-on:"
echo "  1. Copy aquable/ folder to your HA add-ons directory"
echo "  2. Reload HA add-ons"
echo "  3. Install and configure the add-on"
