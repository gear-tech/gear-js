#!/bin/bash

if [ -f ".env" ]; then
    source .env
fi

test_case="$1"

MACOS_NODE="https://gear-builds.s3.amazonaws.com/gear-nightly-aarch64-apple-darwin.tar.xz"
WIN_NODE="https://gear-builds.s3.amazonaws.com/gear-nightly-x86_64-pc-windows-msvc.zip"
LINUX_NODE="https://gear-builds.s3.amazonaws.com/gear-nightly-x86_64-unknown-linux-gnu.tar.xz"
TMP_DIR="/tmp/gear-js"

mkdir -p "$TMP_DIR"

os_name=$(uname)
node_bin="$GEAR_NODE_BIN"
node_download=

case "$os_name" in
    Linux*)   node_download="$LINUX_NODE" ;;
    Darwin*)  node_download="$MACOS_NODE" ;;
    CYGWIN*|MINGW*|MSYS*) node_download="$WIN_NODE" ;;
    *)
        echo "Unknown OS"
        exit 1
        ;;
esac

set -e

GEAR_PID=""

cleanup() {
    echo "Performing cleanup..."
    if [[ -n "$GEAR_PID" ]]; then
        echo "Stopping Gear node (PID: $GEAR_PID)..."
        kill "$GEAR_PID" 2>/dev/null || true
    fi
    echo "Removing temporary files..."
    rm -rf "$TMP_DIR"
}
trap cleanup EXIT

# Step 1: Build programs
if [ -z "$SKIP_BUILD" ]; then
    echo "Building programs..."
    cargo build --release
fi

# Step 2: Download Gear node
if [ -z "$GEAR_NODE_BIN" ]; then
    node_bin="$TMP_DIR/gear"
    echo "Downloading Gear node..."
    curl -o "$TMP_DIR"/gear.tar "$node_download"
    tar -xvf "$TMP_DIR"/gear.tar -C "$TMP_DIR"
    chmod +x "$node_bin"
fi

# Step 3: Run Gear node
if [ -z "$SKIP_RUN_NODE" ]; then
    echo "Running Gear node..."
    nohup "$node_bin" --dev --execution=wasm --tmp --unsafe-rpc-external --rpc-methods Unsafe --rpc-cors all > "$TMP_DIR"/gear.log 2>&1 &
    GEAR_PID=$!
    # Wait for Gear node to start
    sleep 30
fi

# Step 4: Run tests
if [ -z "$test_case" ]; then
    echo "Running all tests..."
    npx jest --runInBand
else
    echo "Running test case: $test_case"
    npx jest --runInBand "$test_case"
fi
