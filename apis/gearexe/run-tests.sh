#!/bin/bash
set -e

cleanup() {
    echo "[*]  Performing cleanup..."
    if [[ -n "$GEAREXE_PID" ]]; then
        echo "[*]  Stopping Gear node (PID: $GEAREXE_PID)..."
        kill $GEAREXE_PID 2>/dev/null || true
    fi

    if [[ -n "$ANVIL_PID" ]]; then
        echo "[*]  Stopping Anvil node (PID: $ANVIL_PID)..."
        kill $ANVIL_PID 2>/dev/null || true
    fi

    # Print logs if exit code is not 0
    if [ $? -ne 0 ]; then
        echo '[*]  Logs:'
        echo "======================================================"
        cat /tmp/gearexe.log
        echo "======================================================"
        cat /tmp/anvil.log
    fi

    echo "[*]  Removing temporary files..."
    rm -rf /tmp/gear
}
trap cleanup EXIT

# Take environment variables from .env file if it exists
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

export VALIDATOR_PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
export VALIDATOR_PUBLIC_KEY="038318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed75"
export VALIDATOR_PUBLIC_KEY_ETH="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
export SEQUENCER_PRIVATE_KEY="0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
export SEQUENCER_PUBLIC_KEY="02ba5734d8f7091719471e7f7ed6b9df170dc70cc661ca05e688601ad984f068b0"
export PRIVATE_KEY="0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
export ROUTER_AGGREGATED_PUBLIC_KEY_X="0x0000000000000000000000000000000000000000000000000000000000000001"
export ROUTER_AGGREGATED_PUBLIC_KEY_Y="0x4218F20AE6C646B363DB68605822FB14264CA8D2587FDD6FBC750D587E76A7EE"
export RPC="http://127.0.0.1:8545"
export WS_RPC="ws://127.0.0.1:8545"
export ETHERSCAN_API_KEY=
export BLOCK_TIME=1

PROJECT_PATH=$(pwd)
cd ../../
ROOT_PATH=$(pwd)

path_to_gear_repo=

# Set path to gear repo
echo "[*]  Checking if path to gear repo is provided..."
if [[ -n "$GEAR_REPO" ]]; then
    path_to_gear_repo=$GEAR_REPO
else
    echo "[*]  Cloning gear repo..."
    git clone --depth 1 https://github.com/gear-tech/gear /tmp/gear
    path_to_gear_repo="/tmp/gear"
fi

path_to_contracts=$path_to_gear_repo/ethexe/contracts

# Check if foundryup is installed and install it if not
if ! command -v foundryup &> /dev/null; then
    echo "[*]  Installing foundryup..."
    curl -L https://foundry.paradigm.xyz | bash
fi

if [[ -z "$SKIP_BUILD" ]]; then
    # Build gearexe
    echo "[*]  Building gearexe..."
    cd $path_to_gear_repo
    cargo build -p ethexe-cli --release

    # Build contracts
    echo "[*]  Building contracts..."
    cd $ROOT_PATH
    cargo build --release

    # Deploy necessary contracts
    echo "[*]  Install forge dependencies ..."
    cd $path_to_contracts
    forge install
fi

# Run anvil node
echo "[*]  Running Anvil node..."
nohup anvil -b $BLOCK_TIME > /tmp/anvil.log 2>&1 &
ANVIL_PID=$!

# Deploy contracts
echo "[*]  Deploying contracts..."
cd $path_to_contracts
export ROUTER_VALIDATORS_LIST=$VALIDATOR_PUBLIC_KEY_ETH
forge clean
forge script script/Deployment.s.sol:DeploymentScript --rpc-url $RPC --broadcast --slow

# Get router address
echo "[*]  Getting router address..."
cd $path_to_gear_repo
BROADCAST_PATH="ethexe/contracts/broadcast/Deployment.s.sol/31337/run-latest.json"
ROUTER=`cat ${BROADCAST_PATH} | jq '.transactions[] | select(.contractName == "Router") | .contractAddress' | tr -d '"'`
export ROUTER_ADDRESS=`cat ${BROADCAST_PATH} | jq ".transactions[] | \
  select(.contractName == \"TransparentUpgradeableProxy\") | \
  select(.transactionType == \"CREATE\") | \
  select(.arguments[] | ascii_downcase | contains(\"${ROUTER}\")) | \
  .contractAddress" |
  tr -d '"'`
echo "[*]  Router address is ${ROUTER_ADDRESS}"

# Set keys
echo "[*]  Setting keys..."
cd $path_to_gear_repo
./target/release/ethexe key -k /tmp/gearexe/keys insert $SEQUENCER_PRIVATE_KEY
./target/release/ethexe key -k /tmp/gearexe/keys insert $VALIDATOR_PRIVATE_KEY

# Run gearexe
echo "[*]  Running gearexe..."
nohup ./target/release/ethexe --cfg none run --dev --base "/tmp/gearexe" \
    --sequencer $SEQUENCER_PUBLIC_KEY \
    --validator $VALIDATOR_PUBLIC_KEY \
    --ethereum-rpc $WS_RPC \
    --ethereum-router $ROUTER_ADDRESS \
    --eth-block-time $BLOCK_TIME \
    --network-listen-addr "/ip4/0.0.0.0/udp/20333/quic-v1" \
    --rpc-port 9944 \
    --rpc-cors "all" > /tmp/gearexe.log 2>&1 &
GEAREXE_PID=$!
sleep 15

# Run tests
echo "[*]  Running tests..."
cd $ROOT_PATH
jest_bin=$(yarn bin jest)
cd $PROJECT_PATH
yarn node --no-warnings --experimental-vm-modules $jest_bin --runInBand
