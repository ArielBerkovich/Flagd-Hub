#!/bin/bash

# Script to run e2e tests with various configurations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "======================================"
echo "Flagd Hub E2E Test Runner"
echo "======================================"
echo ""

# Check if services are running
echo "Checking if Flagd Hub services are running..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ UI is running at http://localhost:3000${NC}"
else
    echo -e "${RED}✗ UI is not running at http://localhost:3000${NC}"
    echo -e "${YELLOW}Please start the services with: docker compose up -d${NC}"
    exit 1
fi

if curl -s http://localhost:8090/actuator/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ API is running at http://localhost:8090${NC}"
else
    echo -e "${RED}✗ API is not running at http://localhost:8090${NC}"
    echo -e "${YELLOW}Please start the services with: docker compose up -d${NC}"
    exit 1
fi

echo ""
echo "======================================"
echo "Running E2E Tests"
echo "======================================"
echo ""

# Parse command line arguments
MODE=${1:-"headless"}

case $MODE in
  headless)
    echo "Running tests in headless mode..."
    ./gradlew test --console=plain
    ;;
  headed)
    echo "Running tests in headed mode (visible browser)..."
    ./gradlew testHeaded --console=plain
    ;;
  debug)
    echo "Running tests in debug mode (slow motion)..."
    ./gradlew testDebug --console=plain
    ;;
  smoke)
    echo "Running smoke tests only..."
    ./gradlew test --tests "com.flagdhub.e2e.tests.SmokeTest" --console=plain
    ;;
  *)
    echo "Unknown mode: $MODE"
    echo "Usage: $0 [headless|headed|debug|smoke]"
    exit 1
    ;;
esac

# Check if tests passed
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}======================================"
    echo "All tests passed!"
    echo "======================================${NC}"
    echo ""
    echo "View HTML report: build/reports/tests/test/index.html"
else
    echo ""
    echo -e "${RED}======================================"
    echo "Some tests failed!"
    echo "======================================${NC}"
    echo ""
    echo "View HTML report: build/reports/tests/test/index.html"
    echo "View traces: build/traces/"
    exit 1
fi
