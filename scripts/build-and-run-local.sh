#!/bin/bash
# Build and run AquaBle Docker image locally for testing on Apple Silicon (ARM64)
# Usage: ./scripts/build-and-run-local.sh

set -e  # Exit on any error

echo "🚀 AquaBle Local Build & Run Script (Apple Silicon)"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="aquable-local"
IMAGE_TAG="latest"
CONTAINER_NAME="aquable-test"
PORT=8000
CONFIG_DIR="$HOME/.aquable-test"

# Cleanup function
cleanup() {
    echo -e "${YELLOW}Cleaning up...${NC}"
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        echo "  Stopping existing container: $CONTAINER_NAME"
        docker stop "$CONTAINER_NAME" 2>/dev/null || true
        docker rm "$CONTAINER_NAME" 2>/dev/null || true
    fi
}

# Step 1: Clean up any existing container
echo -e "\n${YELLOW}Step 1: Cleaning up...${NC}"
cleanup

# Step 2: Build the image
echo -e "\n${YELLOW}Step 2: Building Docker image for ARM64 (Apple Silicon)...${NC}"
echo "  Image: $IMAGE_NAME:$IMAGE_TAG"
echo "  Platform: linux/arm64"

docker build \
    --platform linux/arm64 \
    -t "$IMAGE_NAME:$IMAGE_TAG" \
    -f Dockerfile \
    . || {
    echo -e "${RED}❌ Docker build failed!${NC}"
    exit 1
}

echo -e "${GREEN}✅ Docker image built successfully${NC}"

# Step 3: Verify image contents
echo -e "\n${YELLOW}Step 3: Verifying image contents...${NC}"
echo "  Checking for uvicorn..."
docker run --rm "$IMAGE_NAME:$IMAGE_TAG" pip list | grep -i uvicorn && echo "  ✅ uvicorn installed" || {
    echo -e "${RED}❌ uvicorn not found!${NC}"
    exit 1
}

echo "  Checking for frontend assets..."
docker run --rm "$IMAGE_NAME:$IMAGE_TAG" ls -la /app/frontend/dist/index.html > /dev/null 2>&1 && echo "  ✅ frontend assets present" || {
    echo -e "${RED}❌ frontend assets not found!${NC}"
    exit 1
}

# Step 4: Create config directory
echo -e "\n${YELLOW}Step 4: Setting up local storage...${NC}"
mkdir -p "$CONFIG_DIR"
echo "  Config directory: $CONFIG_DIR"

# Step 5: Start the container
echo -e "\n${YELLOW}Step 5: Starting AquaBle container...${NC}"
echo "  Container: $CONTAINER_NAME"
echo "  Port: $PORT"
echo "  Config: $CONFIG_DIR"

docker run -d \
    --name "$CONTAINER_NAME" \
    --restart unless-stopped \
    -p "$PORT:8000" \
    -v "$CONFIG_DIR:/data" \
    -e AQUA_BLE_CONFIG_DIR=/data \
    -e AQUA_BLE_AUTO_RECONNECT=1 \
    "$IMAGE_NAME:$IMAGE_TAG"

# Step 6: Wait for service to start and show logs
echo -e "\n${YELLOW}Step 6: Waiting for service to start...${NC}"
sleep 3

# Check if container is running
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${GREEN}✅ Container is running!${NC}"
else
    echo -e "${RED}❌ Container failed to start${NC}"
    echo -e "\n${YELLOW}Container logs:${NC}"
    docker logs "$CONTAINER_NAME"
    exit 1
fi

# Step 7: Display connection info
echo -e "\n${GREEN}════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ AquaBle is Ready!${NC}"
echo -e "${GREEN}════════════════════════════════════════════${NC}"
echo ""
echo -e "📱 ${YELLOW}Web Dashboard:${NC}"
echo -e "   ${GREEN}http://localhost:$PORT${NC}"
echo ""
echo -e "📊 ${YELLOW}API Documentation:${NC}"
echo -e "   ${GREEN}http://localhost:$PORT/docs${NC}"
echo ""
echo -e "💾 ${YELLOW}Config Directory:${NC}"
echo -e "   ${GREEN}$CONFIG_DIR${NC}"
echo ""
echo -e "📝 ${YELLOW}Useful Commands:${NC}"
echo "   View logs:        docker logs -f $CONTAINER_NAME"
echo "   Stop container:   docker stop $CONTAINER_NAME"
echo "   Remove container: docker rm $CONTAINER_NAME"
echo "   Remove image:     docker rmi $IMAGE_NAME:$IMAGE_TAG"
echo ""
echo -e "${YELLOW}Waiting for logs (press Ctrl+C to exit)...${NC}"
echo ""

# Show live logs
docker logs -f "$CONTAINER_NAME"
