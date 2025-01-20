#!/bin/bash

MACOS_NODE="https://gear-builds.s3.amazonaws.com/gear-nightly-aarch64-apple-darwin.tar.xz"
WIN_NODE="https://gear-builds.s3.amazonaws.com/gear-nightly-x86_64-pc-windows-msvc.zip"
LINUX_NODE="https://gear-builds.s3.amazonaws.com/gear-nightly-x86_64-unknown-linux-gnu.tar.xz"

os_name=$(uname)
node_download=
case "$os_name" in
    Linux*)   node_download=$LINUX_NODE ;;
    Darwin*)  node_download=$MACOS_NODE ;;
    CYGWIN*|MINGW*|MSYS*) node_download=$WIN_NODE ;;
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
        kill $GEAR_PID 2>/dev/null || true
    fi
    echo "Removing temporary files..."
    rm -rf ./tmp
}
trap cleanup EXIT

# Step 1: Build programs
echo "Building programs..."
cargo build --release

# Step 2: Download Gear node
echo "Downloading Gear node..."
mkdir -p ./tmp
curl -o ./tmp/gear.tar $node_download
tar -xvf ./tmp/gear.tar -C ./tmp
chmod +x ./tmp/gear

# Step 3: Run Gear node
echo "Running Gear node..."
nohup ./tmp/gear --dev --execution=wasm --tmp --unsafe-rpc-external --rpc-methods Unsafe --rpc-cors all > ./tmp/gear.log 2>&1 &
GEAR_PID=$!
# Wait for Gear node to start
sleep 30

# Step 4: Run tests
echo "Running tests..."
npx jest --runInBand

echo "Tests completed successfully."
