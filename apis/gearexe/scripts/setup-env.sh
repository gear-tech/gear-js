#!/bin/bash
set -e

RETH_VERSION="1.9.0"
RETH_BIN_DIR=/tmp/gearexe-js/reth/bin
ETH_DIR=/tmp/gearexe-js/eth
GEAREXE_DIR=/tmp/gearexe-js/gearexe
GEAR_REPO_DIR=/tmp/gearexe-js/gear
LOGS_DIR=/tmp/gearexe-js/logs
PROJECT_DIR=$(pwd)

# Logging functions
log_info() {
    echo "[*] $1"
}

log_error() {
    echo "[!] $1" >&2
}

log_success() {
    echo "[✓] $1"
}

if [ -f .env ]; then
    source .env
fi

source scripts/test.env

cd ../../
ROOT_DIR=$(pwd)
if [ -f .env ]; then
    source .env
fi

if [ "$DEPLOY_ON_HOLESKY" == "true" ]; then
    setup_holesky_env
fi

export ROUTER_VALIDATORS_LIST="$VALIDATOR_PUBLIC_KEY_ETH"

mkdir -p $ETH_DIR
mkdir -p $GEAREXE_DIR
mkdir -p $LOGS_DIR
mkdir -p $RETH_BIN_DIR

# Clean old logs
log_info "Cleaning previous log files..."
rm -rf $LOGS_DIR/*

# Function to check required environment variables
validate_holesky_config() {
    local required_vars=("HOLESKY_PRIVATE_KEY" "HOLESKY_RPC_URL" "HOLESKY_WS_RPC_URL" "HOLESKY_PUBLIC_KEY")
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            log_error "$var is not set"
            exit 1
        fi
    done
}

# Function to setup Holesky environment
setup_holesky_env() {
    log_info "Setting up Holesky environment variables..."
    validate_holesky_config

    export PRIVATE_KEY="$HOLESKY_PRIVATE_KEY_ETH"
    export RPC="$HOLESKY_RPC_URL"
    export WS_RPC="$HOLESKY_WS_RPC_URL"
    export ARTIFACTS_DIR="17000"
    export BLOCK_TIME="12"
    export VALIDATOR_PRIVATE_KEY="$HOLESKY_PRIVATE_KEY"
    export VALIDATOR_PUBLIC_KEY="$HOLESKY_PUBLIC_KEY_ETH"

    log_success "Holesky environment configured"
}

cleanup() {
    exit_code="$?"
    log_info "Script exited with code $exit_code"
    log_info "Performing cleanup..."

    if [[ -n "$GEAREXE_PID" ]]; then
        log_info "Stopping Gear node (PID: $GEAREXE_PID)..."
        kill $GEAREXE_PID 2>/dev/null || true
        log_info "Gear node stopped"
    fi

    if [[ -n "$RETH_PID" ]]; then
        log_info "Stopping Reth node (PID: $RETH_PID)..."
        kill $RETH_PID 2>/dev/null || true
        log_info "Reth node stopped"
    fi

    # Print logs if exit code is not 0
    if [ $exit_code -ne 0 ]; then
        log_error "Test execution failed. Log files preserved for debugging:"
        echo "    - Router deployment logs: $LOGS_DIR/deploy_contracts.log"
        echo "    - Reth node logs: $LOGS_DIR/reth.log"
        echo "    - Gearexe node logs: $LOGS_DIR/gearexe.log"
    else
        log_success "Tests completed successfully. Removing logs..."
        rm -rf $LOGS_DIR
    fi

    log_info "Removing temporary files..."
    # rm -rf $GEAREXE_DIR
    rm -rf $ETH_DIR
    rm -f /tmp/gearexe-js/environment-ready
    log_success "Cleanup completed"
}
trap cleanup EXIT

PROJECT_PATH=$(pwd)
cd ../../
ROOT_PATH=$(pwd)

path_to_gear_repo=

# Set path to gear repo
log_info "Checking if path to gear repo is provided..."
if [[ -n "$PATH_TO_GEAR_REPO" ]]; then
    path_to_gear_repo=$PATH_TO_GEAR_REPO
    log_info "Gear repo found in $path_to_gear_repo"
else
    if [[ -z $GEAR_BRANCH ]]; then
        GEAR_BRANCH=master
    fi
    log_info "Cloning gear repo (branch $GEAR_BRANCH)..."
    git clone --depth 1 -b $GEAR_BRANCH https://github.com/gear-tech/gear $GEAR_REPO_DIR
    path_to_gear_repo="$GEAR_REPO_DIR"
fi

path_to_contracts=$path_to_gear_repo/ethexe/contracts

# Function to determine platform for downloads
get_platform() {
    case "$(uname)" in
        Linux*)
            echo "x86_64-unknown-linux-gnu" ;;
        Darwin*)
            echo "aarch64-apple-darwin" ;;
        CYGWIN*|MINGW*|MSYS*)
            echo "x86_64-pc-windows-gnu" ;;
        *)
            log_error "Unknown operating system. Cannot determine platform for Reth download."
            exit 1
            ;;
    esac
}

# Function to download and install Reth
download_reth() {
    local version=$1
    local platform=$2

    log_info "Downloading Reth v$version for $platform..."
    local reth_link="https://github.com/paradigmxyz/reth/releases/download/v$version/reth-v$version-$platform.tar.gz"
    log_info "Download URL: $reth_link"

    log_info "Fetching archive..."
    if ! curl -L "$reth_link" -o "$RETH_BIN_DIR/reth.tar.gz"; then
        log_error "Failed to download Reth"
        exit 1
    fi

    log_info "Extracting Reth binary..."
    if ! tar -xf "$RETH_BIN_DIR/reth.tar.gz" -C "$RETH_BIN_DIR"; then
        log_error "Failed to extract Reth archive"
        exit 1
    fi

    log_info "Setting executable permissions..."
    chmod +x "$RETH_BIN_DIR/reth"
    rm -f "$RETH_BIN_DIR/reth.tar.gz"
    log_success "Reth binary successfully installed at: $RETH_BIN_DIR/reth"
}

# Function to get current Reth version
get_reth_version() {
    if [[ -f "$RETH_BIN_DIR/reth" && -x "$RETH_BIN_DIR/reth" ]]; then
        "$RETH_BIN_DIR/reth" --version 2>/dev/null | head -1 | grep -o 'Version: [0-9.]*' | cut -d' ' -f2 || echo ""
    else
        echo ""
    fi
}

# Function to build gearexe
build_gearexe() {
    log_info "Building gearexe..."
    cd "$path_to_gear_repo"
    log_info "Running cargo build for ethexe-cli..."
    if ! cargo build -p ethexe-cli --release; then
        log_error "Failed to build gearexe"
        exit 1
    fi
    log_success "Successfully built gearexe"
}

# Function to build WASM contracts
build_wasm_contracts() {
    if [[ -n "$RUNNING_TESTS" ]]; then
        log_info "Building contracts..."
        cd "$PROJECT_DIR"
        log_info "Running cargo build for WASM contracts..."
        if ! cargo build --release; then
            log_error "Failed to build contracts"
            exit 1
        fi
        log_success "WASM contracts built successfully:"
        ls -al target/wasm32-gear/release
    fi
}

# Function to setup Forge environment and compile contracts
setup_forge() {
    log_info "Setting up Forge environment..."
    cd "$path_to_contracts"
    log_info "Installing Forge dependencies..."
    if ! forge install; then
        log_error "Failed to install Forge dependencies"
        exit 1
    fi

    log_info "Cleaning Forge build artifacts..."
    forge clean

    log_info "Compiling contracts with Forge..."
    if ! forge compile; then
        log_error "Failed to compile contracts"
        exit 1
    fi
    log_success "Successfully compiled contracts"
}

# Check if foundryup is installed and install it if not
if ! command -v foundryup &> /dev/null; then
    log_info "Installing foundryup..."
    curl -L https://foundry.paradigm.xyz | bash
fi

if [[ -z "$SKIP_BUILD" || "$SKIP_BUILD" != "true" ]]; then
    setup_forge
    build_wasm_contracts
    build_gearexe
fi

# Check and install/update Reth
log_info "Checking Reth installation..."
current_version=$(get_reth_version)

if [[ -z "$current_version" ]]; then
    log_info "Reth binary not found at $RETH_BIN_DIR/reth"
    platform=$(get_platform)
    log_info "Detected platform: $platform"
    download_reth "$RETH_VERSION" "$platform"
elif [[ "$current_version" != "$RETH_VERSION" ]]; then
    log_info "Reth version mismatch: found v$current_version, required v$RETH_VERSION"
    log_info "Updating Reth to version $RETH_VERSION..."
    platform=$(get_platform)
    log_info "Detected platform: $platform"
    download_reth "$RETH_VERSION" "$platform"
else
    log_success "Reth v$current_version is already installed and up to date"
fi


if [ "$DEPLOY_ON_HOLESKY" != "true" ]; then
    log_info "Starting Reth Ethereum node..."
    log_info "Running with parameters: --dev.block-time $BLOCK_TIME sec --dev --datadir $ETH_DIR --ws --ws.port 8546"
    nohup $RETH_BIN_DIR/reth node --dev.block-time "$BLOCK_TIME"sec --dev \
        --datadir $ETH_DIR --ws --ws.port 8546 \
        > $LOGS_DIR/reth.log 2>&1 &
        RETH_PID=$!
    log_success "Reth node started with PID: $RETH_PID"
    log_info "Waiting for Reth node to initialize (10 seconds)..."

    if ! kill -0 $RETH_PID 2>/dev/null; then
        log_error "Reth node failed to start. Check logs at: $LOGS_DIR/reth.log"
        log_error "Last 10 lines of Reth logs:"
        tail -n 10 $LOGS_DIR/reth.log
        exit 1
    fi
    log_info "Continuing initialization..."
    sleep 5
    log_success "Reth node is ready"
    sleep 5
fi

# Deploy contracts
log_info "Deploying Ethereum contracts..."
cd $path_to_contracts
log_info "Cleaning previous build artifacts..."
forge clean

log_info "Deploying contracts to Eth node at $RPC..."
log_info "Deployment logs will be saved to: $LOGS_DIR/deploy_contracts.log"
forge script script/Deployment.s.sol:DeploymentScript \
    --rpc-url $RPC --broadcast --slow -vvvv > \
    $LOGS_DIR/deploy_contracts.log 2>&1 || {
    log_error "Contract deployment failed. Check logs at: $LOGS_DIR/deploy_contracts.log"
    log_error "Last 10 lines of deployment logs:"
    echo "=========================="
    tail -n 20 $LOGS_DIR/deploy_contracts.log
    echo "=========================="
    exit 1
}
log_success "Contracts deployed successfully"

# Get router address
log_info "Extracting router contract address from deployment artifacts..."
cd $path_to_gear_repo
BROADCAST_PATH="ethexe/contracts/broadcast/Deployment.s.sol/$ARTIFACTS_DIR/run-latest.json"

if [ ! -f ${BROADCAST_PATH} ]; then
    log_error "Deployment artifact not found at: ${BROADCAST_PATH}"
    log_error "Contract deployment may have failed"
    exit 1
fi

log_info "Parsing deployment artifacts from ${BROADCAST_PATH}..."
ROUTER=`cat ${BROADCAST_PATH} | jq '.transactions[] | select(.contractName == "Router") | .contractAddress' | tr -d '"'`
if [ -z "$ROUTER" ]; then
    log_error "Failed to extract Router implementation address from deployment artifacts"
    exit 1
fi
log_success "Router implementation address: ${ROUTER}"

export ROUTER_ADDRESS=`cat ${BROADCAST_PATH} | jq ".transactions[] | \
  select(.contractName == \"TransparentUpgradeableProxy\") | \
  select(.transactionType == \"CREATE\") | \
  select(.arguments[] | ascii_downcase | contains(\"${ROUTER}\")) | \
  .contractAddress" |
  tr -d '"'`

if [ -z "$ROUTER_ADDRESS" ]; then
    log_error "Failed to extract Router proxy address from deployment artifacts"
    exit 1
fi
log_success "Router proxy address: ${ROUTER_ADDRESS}"

# Update ROUTER_ADDRESS in test.env
log_info "Updating ROUTER_ADDRESS in $PROJECT_DIR/scripts/test.env..."
if grep -q '^export ROUTER_ADDRESS=' "$PROJECT_DIR/scripts/test.env"; then
    # Replace existing ROUTER_ADDRESS
    sed "s|^export ROUTER_ADDRESS=.*$|export ROUTER_ADDRESS=\"$ROUTER_ADDRESS\"|" "$PROJECT_DIR/scripts/test.env" \
        > "$PROJECT_DIR/scripts/test.env.tmp"
    mv "$PROJECT_DIR/scripts/test.env.tmp" "$PROJECT_DIR/scripts/test.env"
else
    # Append if not present
    echo "export ROUTER_ADDRESS=\"$ROUTER_ADDRESS\"" >> "$PROJECT_DIR/scripts/test.env"
fi
log_success "ROUTER_ADDRESS updated in $PROJECT_DIR/scripts/test.env"

# Set keys
log_info "Setting up Gear node keys..."
cd $path_to_gear_repo
log_info "Inserting validator key..."
inserted_validator=$(./target/release/ethexe key -k $GEAREXE_DIR/keys insert $VALIDATOR_PRIVATE_KEY)
echo $inserted_validator
validator_pubkey=$(echo $inserted_validator | grep -o "Public key: 0x[0-9a-fA-F]\+" | awk '{print $3}' | sed 's/^0x//')
echo $validator_pubkey
if [ $? -ne 0 ]; then
    log_error "Failed to insert validator key"
    exit 1
fi
log_success "Validator key successfully configured: $validator_pubkey"
log_info "Inserting network key..."
inserted_network=$(./target/release/ethexe key -k $GEAREXE_DIR/net insert $PRIVATE_KEY)
echo $inserted_network
network_pubkey=$(echo $inserted_network | grep -o "Public key: 0x[0-9a-fA-F]\+" | awk '{print $3}' | sed 's/^0x//')
echo $network_pubkey
if [ $? -ne 0 ]; then
    log_error "Failed to insert network key"
    exit 1
fi

# Run gearexe
log_info "Starting Gear execution layer node (gearexe)..."
export RUST_LOG=debug
export RUST_BACKTRACE=1

log_info "Gearexe configuration:"
echo "    - Base directory: $GEAREXE_DIR"
echo "    - Validator key: $validator_pubkey"
echo "    - Network key: $network_pubkey"
echo "    - Ethereum RPC: $WS_RPC"
echo "    - Router address: $ROUTER_ADDRESS"
echo "    - Block time: $BLOCK_TIME"
echo "    - RPC port: 9944"

log_info "Launching gearexe node..."
nohup ./target/release/ethexe --cfg none run --dev --tmp --base "$GEAREXE_DIR" \
    --validator $validator_pubkey \
    --validator-session $validator_pubkey \
    --network-key $network_pubkey \
    --ethereum-rpc $WS_RPC \
    --ethereum-router $ROUTER_ADDRESS \
    --eth-block-time $BLOCK_TIME \
    --network-listen-addr "/ip4/0.0.0.0/udp/20333/quic-v1" \
    --rpc-port 9944 \
    --rpc-cors "all" > $LOGS_DIR/gearexe.log 2>&1 &
GEAREXE_PID=$!

log_success "Gearexe node started with PID: $GEAREXE_PID"

# Monitor gearexe process and handle unexpected termination
(
  while kill -0 $GEAREXE_PID 2>/dev/null; do
    sleep 1
  done

  exit_code=$?

  if [[ $exit_code -ne 0 ]]; then
    log_error "Gearexe exited unexpectedly with code $exit_code"
    log_error "Last 20 lines of gearexe logs:"
    echo "====================================================="
    tail -n 20 $LOGS_DIR/gearexe.log
    echo "====================================================="
    kill $$
  fi
) &

log_info "Waiting for gearexe node to initialize (5 seconds)..."
sleep 5
# Check if the process is still running after 5 seconds
if ! kill -0 $GEAREXE_PID 2>/dev/null; then
    log_error "Gearexe node failed to start. Check logs at: $LOGS_DIR/gearexe.log"
    log_error "Last 20 lines of gearexe logs:"
    tail -n 20 $LOGS_DIR/gearexe.log
    exit 1
fi
log_info "Gearexe initialization in progress..."
sleep 20
log_success "Gearexe node is ready"

# Signal that environment is ready
log_success "Environment setup complete. Creating ready signal..."
touch /tmp/gearexe-js/environment-ready
log_success "Ready signal created at /tmp/gearexe-js/environment-ready"

# Keep the script running to maintain all processes
log_info "Environment is running. Waiting for termination signal..."
wait
