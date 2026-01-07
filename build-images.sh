#!/bin/bash

set -e  # Exit on any error

echo "======================================"
echo "Building Flagd Hub Docker Images"
echo "======================================"
echo ""

# Delete existing images
echo "Cleaning up existing images..."
docker rmi flagd-hub:latest 2>/dev/null && echo "✓ Deleted flagd-hub:latest" || echo "ℹ flagd-hub:latest not found, skipping..."
docker rmi flagd-hub-ui:latest 2>/dev/null && echo "✓ Deleted flagd-hub-ui:latest" || echo "ℹ flagd-hub-ui:latest not found, skipping..."
echo ""

# Build backend using Docker
echo "[1/2] Building flagd-hub backend image using Docker..."
cd flagd-hub-server
docker build -t flagd-hub:latest .
cd ..
echo "✓ Backend image built successfully"
echo ""

# Build UI using docker build
echo "[2/2] Building flagd-hub-ui frontend image using Docker..."
cd flagd-hub-ui
docker build -t flagd-hub-ui:latest .
cd ..
echo "✓ Frontend image built successfully"
echo ""

echo "======================================"
echo "Build Complete!"
echo "======================================"
echo ""
echo "Available images:"
docker images | grep -E "REPOSITORY|flagd-hub"
echo ""
echo "To start the services, run:"
echo "  docker compose up -d"
