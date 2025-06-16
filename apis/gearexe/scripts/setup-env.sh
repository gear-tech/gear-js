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

    if [[ -n "$GEAREXE_PID" ]]; then
        echo "[*] Stopping Gear node (PID: $GEAREXE_PID)..."
        kill $GEAREXE_PID 2>/dev/null || true
        echo "[*] Gear node stopped"
    fi

    if [[ -n "$RETH_PID" ]]; then
        echo "[*] Stopping Reth node (PID: $RETH_PID)..."
        kill $RETH_PID 2>/dev/null || true
        echo "[*] Reth node stopped"
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

    echo "[*] Removing temporary files..."
    rm -rf $GEAREXE_DIR
    rm -rf $ETH_DIR
    echo "[*] Cleanup completed"
}
trap cleanup EXIT

if [ -f .env ]; then
    source .env
fi

export VALIDATOR_PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
export VALIDATOR_PUBLIC_KEY="038318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed75"
export VALIDATOR_PUBLIC_KEY_ETH="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
export SEQUENCER_PRIVATE_KEY="0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
export SEQUENCER_PUBLIC_KEY="02ba5734d8f7091719471e7f7ed6b9df170dc70cc661ca05e688601ad984f068b0"
export SEQUENCER_PUBLIC_KEY_ETH="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
export PRIVATE_KEY="0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
export SENDER_PUBLIC_KEY_ETH="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
export ROUTER_AGGREGATED_PUBLIC_KEY_X="0x0000000000000000000000000000000000000000000000000000000000000001"
export ROUTER_AGGREGATED_PUBLIC_KEY_Y="0x4218F20AE6C646B363DB68605822FB14264CA8D2587FDD6FBC750D587E76A7EE"
export ROUTER_VERIFIABLE_SECRET_SHARING_COMMITMENT="0x"
export RPC="http://127.0.0.1:8545"
export WS_RPC="ws://127.0.0.1:8546"
export ETHERSCAN_API_KEY=
export BLOCK_TIME=1
export ROUTER_VALIDATORS_LIST=$VALIDATOR_PUBLIC_KEY_ETH
export DEV_MODE=true

PROJECT_PATH=$(pwd)
cd ../../
ROOT_PATH=$(pwd)

path_to_gear_repo=

# Set path to gear repo
echo "[*] Checking if path to gear repo is provided..."
if [[ -n "$PATH_TO_GEAR_REPO" ]]; then
    path_to_gear_repo=$PATH_TO_GEAR_REPO
else
    if [[ -z $GEAR_BRANCH ]]; then
        GEAR_BRANCH=master
    fi
    echo "[*] Cloning gear repo (branch $GEAR_BRANCH)..."
    git clone --depth 1 -b $GEAR_BRANCH https://github.com/gear-tech/gear $GEAR_REPO_DIR
    path_to_gear_repo="$GEAR_REPO_DIR"
fi

path_to_contracts=$path_to_gear_repo/ethexe/contracts

# Check if foundryup is installed and install it if not
if ! command -v foundryup &> /dev/null; then
    echo "[*] Installing foundryup..."
    curl -L https://foundry.paradigm.xyz | bash
fi

if [[ -z "$SKIP_BUILD" ]]; then
    # Build gearexe
    echo "[*] Building gearexe..."
    cd $path_to_gear_repo
    echo "[*] Running cargo build for ethexe-cli..."
    cargo build -p ethexe-cli --release
    if [ $? -ne 0 ]; then
        echo "[!] Failed to build gearexe"
        exit 1
    fi
    echo "[*] Successfully built gearexe"

    # Build contracts
    echo "[*] Building contracts..."
    cd $PROJECT_DIR
    echo "[*] Running cargo build for WASM contracts..."
    cargo build --release
    if [ $? -ne 0 ]; then
        echo "[!] Failed to build contracts"
        exit 1
    fi
    echo "[*] WASM contracts built successfully:"
    ls -al target/wasm32-gear/release

    # Deploy necessary contracts
    echo "[*] Setting up Forge environment..."
    cd $path_to_contracts
    echo "[*] Installing Forge dependencies..."
    forge install
    if [ $? -ne 0 ]; then
        echo "[!] Failed to install Forge dependencies"
        exit 1
    fi

    echo "[*] Cleaning Forge build artifacts..."
    forge clean

    echo "[*] Compiling contracts with Forge..."
    forge compile
    if [ $? -ne 0 ]; then
        echo "[!] Failed to compile contracts"
        exit 1
    fi
    echo "[*] Successfully compiled contracts"
fi

if [[ ! -f "$RETH_BIN_DIR/reth" ]]; then
    echo "[*] Reth binary not found at $RETH_BIN_DIR/reth"
    echo "[*] Determining platform for Reth download..."
    platform=
    case "$(uname)" in
        Linux*)
            platform="x86_64-unknown-linux-gnu"
            echo "[*] Detected Linux platform" ;;
        Darwin*)
            platform="aarch64-apple-darwin"
            echo "[*] Detected macOS platform" ;;
        CYGWIN*|MINGW*|MSYS*)
            platform="x86_64-pc-windows-gnu"
            echo "[*] Detected Windows platform" ;;
        *)
            echo "[!] Unknown operating system. Cannot determine platform for Reth download."
            exit 1
            ;;
    esac

    RETH_LINK="https://github.com/paradigmxyz/reth/releases/download/v$RETH_VERSION/reth-v$RETH_VERSION-$platform.tar.gz"
    echo "[*] Downloading Reth v$RETH_VERSION for $platform..."
    echo "[*] Download URL: $RETH_LINK"

    echo "[*] Fetching archive..."
    curl -L $RETH_LINK -o "$RETH_BIN_DIR/reth.tar.gz"
    if [ $? -ne 0 ]; then
        echo "[!] Failed to download Reth"
        exit 1
    fi

    echo "[*] Extracting Reth binary..."
    tar -xvf "$RETH_BIN_DIR/reth.tar.gz" -C $RETH_BIN_DIR
    if [ $? -ne 0 ]; then
        echo "[!] Failed to extract Reth archive"
        exit 1
    fi

    echo "[*] Setting executable permissions..."
    chmod +x $RETH_BIN_DIR/reth
    echo "[*] Reth binary successfully installed at: $RETH_BIN_DIR/reth"
fi


echo "[*] Starting Reth Ethereum node..."
echo "[*] Running with parameters: --dev.block-time 5sec --dev --datadir $ETH_DIR --ws --ws.port 8546"
nohup $RETH_BIN_DIR/reth node --dev.block-time 5sec --dev \
    --datadir $ETH_DIR --ws --ws.port 8546 \
    > $LOGS_DIR/reth.log 2>&1 &
RETH_PID=$!

echo "[*] Reth node started with PID: $RETH_PID"
echo "[*] Waiting for Reth node to initialize (10 seconds)..."
sleep 5
# Check if the process is still running after 5 seconds
if ! kill -0 $RETH_PID 2>/dev/null; then
    echo "[!] Reth node failed to start. Check logs at: $LOGS_DIR/reth.log"
    echo "[!] Last 10 lines of Reth logs:"
    tail -n 10 $LOGS_DIR/reth.log
    exit 1
fi
echo "[*] Continuing initialization..."
sleep 5
echo "[*] Reth node is ready"

# Deploy contracts
echo "[*] Deploying Ethereum contracts..."
# cp $PROJECT_DIR/test/solidity/RouterDeployment.s.sol $path_to_contracts/script/RouterDeployment.s.sol
cd $path_to_contracts
echo "[*] Cleaning previous build artifacts..."
forge clean

echo "[*] Deploying contracts to Reth node at $RPC..."
echo "[*] Deployment logs will be saved to: $LOGS_DIR/deploy_contracts.log"
forge script script/Deployment.s.sol:DeploymentScript --rpc-url $RPC --broadcast --slow > $LOGS_DIR/deploy_contracts.log 2>&1
if [ $? -ne 0 ]; then
    echo "[!] Contract deployment failed. Check logs at: $LOGS_DIR/deploy_contracts.log"
    echo "[!] Last 10 lines of deployment logs:"
    tail -n 10 $LOGS_DIR/deploy_contracts.log
    exit 1
fi
echo "[*] Contracts deployed successfully"

# Cleanup deployment script if it exists
# if [ -f $path_to_contracts/script/Deployment.s.sol ]; then
    # echo "[*] Removing temporary deployment script..."
    # rm $path_to_contracts/script/Deployment.s.sol
# fi

# Get router address
echo "[*] Extracting router contract address from deployment artifacts..."
cd $path_to_gear_repo
BROADCAST_PATH="ethexe/contracts/broadcast/Deployment.s.sol/1337/run-latest.json"

if [ ! -f ${BROADCAST_PATH} ]; then
    echo "[!] Deployment artifact not found at: ${BROADCAST_PATH}"
    echo "[!] Contract deployment may have failed"
    exit 1
fi

echo "[*] Parsing deployment artifacts from ${BROADCAST_PATH}..."
ROUTER=`cat ${BROADCAST_PATH} | jq '.transactions[] | select(.contractName == "Router") | .contractAddress' | tr -d '"'`
if [ -z "$ROUTER" ]; then
    echo "[!] Failed to extract Router implementation address from deployment artifacts"
    exit 1
fi
echo "[*] Router implementation address: ${ROUTER}"

export ROUTER_ADDRESS=`cat ${BROADCAST_PATH} | jq ".transactions[] | \
  select(.contractName == \"TransparentUpgradeableProxy\") | \
  select(.transactionType == \"CREATE\") | \
  select(.arguments[] | ascii_downcase | contains(\"${ROUTER}\")) | \
  .contractAddress" |
  tr -d '"'`

if [ -z "$ROUTER_ADDRESS" ]; then
    echo "[!] Failed to extract Router proxy address from deployment artifacts"
    exit 1
fi
echo "[*] Router proxy address: ${ROUTER_ADDRESS}"

# Set keys
echo "[*] Setting up Gear node keys..."
cd $path_to_gear_repo
echo "[*] Inserting sequencer key..."
./target/release/ethexe key -k $GEAREXE_DIR/keys insert $SEQUENCER_PRIVATE_KEY
if [ $? -ne 0 ]; then
    echo "[!] Failed to insert sequencer key"
    exit 1
fi

echo "[*] Inserting validator key..."
./target/release/ethexe key -k $GEAREXE_DIR/keys insert $VALIDATOR_PRIVATE_KEY
if [ $? -ne 0 ]; then
    echo "[!] Failed to insert validator key"
    exit 1
fi
echo "[*] Keys successfully configured"

# Run gearexe
echo "[*] Starting Gear execution layer node (gearexe)..."
export RUST_LOG=debug
export RUST_BACKTRACE=1

echo "[*] Gearexe configuration:"
echo "    - Base directory: $GEAREXE_DIR"
echo "    - Validator key: $VALIDATOR_PUBLIC_KEY"
echo "    - Ethereum RPC: $WS_RPC"
echo "    - Router address: $ROUTER_ADDRESS"
echo "    - Block time: $BLOCK_TIME"
echo "    - RPC port: 9944"

echo "[*] Launching gearexe node..."
nohup ./target/release/ethexe --cfg none run --dev --tmp --base "$GEAREXE_DIR" \
    --validator $VALIDATOR_PUBLIC_KEY \
    --validator-session $VALIDATOR_PUBLIC_KEY \
    --ethereum-rpc $WS_RPC \
    --ethereum-router $ROUTER_ADDRESS \
    --eth-block-time $BLOCK_TIME \
    --network-listen-addr "/ip4/0.0.0.0/udp/20333/quic-v1" \
    --rpc-port 9944 \
    --rpc-cors "all" > $LOGS_DIR/gearexe.log 2>&1 &
GEAREXE_PID=$!

echo "[*] Gearexe node started with PID: $GEAREXE_PID"

# Monitor gearexe process and handle unexpected termination
(
  while kill -0 $GEAREXE_PID 2>/dev/null; do
    sleep 1
  done

  exit_code=$?

  if [[ $exit_code -ne 0 ]]; then
    echo "[!] Gearexe exited unexpectedly with code $exit_code"
    echo "[!] Last 20 lines of gearexe logs:"
    tail -n 20 $LOGS_DIR/gearexe.log
    kill $$
  fi
) &

echo "[*] Waiting for gearexe node to initialize (5 seconds)..."
sleep 5
# Check if the process is still running after 5 seconds
if ! kill -0 $GEAREXE_PID 2>/dev/null; then
    echo "[!] Gearexe node failed to start. Check logs at: $LOGS_DIR/gearexe.log"
    echo "[!] Last 20 lines of gearexe logs:"
    tail -n 20 $LOGS_DIR/gearexe.log
    exit 1
fi
echo "[*] Gearexe initialization in progress..."
sleep 10
echo "[*] Gearexe node is ready"
