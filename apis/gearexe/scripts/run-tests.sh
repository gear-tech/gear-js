#!/bin/bash
set -e

RETH_VERSION="1.3.12"
RETH_BIN_DIR=/tmp/gearexe-js/reth/bin
ETH_DIR=/tmp/gearexe-js/eth
GEAREXE_DIR=/tmp/gearexe-js/gearexe
GEAR_REPO_DIR=/tmp/gearexe-js/gear
LOGS_DIR=/tmp/gearexe-js/logs
PROJECT_DIR=$(pwd)
cd ../../
ROOT_DIR=$(pwd)

mkdir -p $ETH_DIR
mkdir -p $GEAREXE_DIR
mkdir -p $LOGS_DIR
mkdir -p $RETH_BIN_DIR

# Clean old logs
echo "[*] Cleaning previous log files..."
rm -rf $LOGS_DIR/*

cleanup() {
    exit_code="$?"
    echo "[*] Script exited with code $exit_code"
    echo "[*] Performing cleanup..."

    if [[ -n "$ENV_PID" ]]; then
        echo "[*] Stopping Gear.Exe environment (PID: $ENV_PID)..."
        kill $ENV_PID 2>/dev/null || true
        echo "[*] Gear.Exe environment stopped"
    fi

    # Print logs if exit code is not 0
    if [ $exit_code -ne 0 ]; then
        echo "[*] Test execution failed. Log files preserved for debugging:"
        echo "    - Router deployment logs: $LOGS_DIR/deploy_contracts.log"
        echo "    - Reth node logs: $LOGS_DIR/reth.log"
        echo "    - Gearexe node logs: $LOGS_DIR/gearexe.log"

        # Print the last few lines of error logs to help with debugging
        echo "[*] Last 10 lines of gearexe logs:"
        tail -n 10 $LOGS_DIR/gearexe.log
    else
        echo "[*] Tests completed successfully. Removing logs..."
        rm -rf $LOGS_DIR
    fi

    # Clean up ready signal file
    rm -f /tmp/gearexe-js/environment-ready

    echo "[*] Cleanup completed"
}
trap cleanup EXIT

if [ -f .env ]; then
    source .env
fi

# Set up environment
echo "[*] Setting up Gear.Exe environment..."
cd $PROJECT_DIR

# Remove any existing ready signal
rm -f /tmp/gearexe-js/environment-ready

# Start environment setup in background
./scripts/setup-env.sh &
ENV_PID=$!

# Wait for environment to be ready
echo "[*] Waiting for environment to be ready..."
while [ ! -f /tmp/gearexe-js/environment-ready ]; do
    # Check if setup process is still running
    if ! kill -0 $ENV_PID 2>/dev/null; then
        echo "[!] Environment setup process terminated unexpectedly"
        exit 1
    fi
    sleep 1
done

echo "[*] Environment is ready, proceeding with tests..."

source "$PROJECT_DIR/scripts/test.env"

# Run tests
echo "[*] Running test suite..."
cd $ROOT_DIR
echo "[*] Locating Jest binary..."
jest_bin=$(yarn bin jest)
if [ $? -ne 0 ]; then
    echo "[!] Failed to locate Jest binary"
    exit 1
fi
echo "[*] Jest binary found at: $jest_bin"

cd $PROJECT_DIR
echo "[*] Starting test execution in sequential mode (--runInBand)..."
echo "[*] Test output follows:"
echo "--------------------------------------------------------"
yarn node --no-warnings --experimental-vm-modules $jest_bin --runInBand
test_result=$?
echo "--------------------------------------------------------"

if [ $test_result -ne 0 ]; then
    echo "[!] Tests failed with exit code: $test_result"
    exit $test_result
else
    echo "[*] All tests passed successfully"
fi
