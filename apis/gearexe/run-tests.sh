#!/bin/bash
set -e

RETH_VERSION="1.2.0"
ETH_DIR=/tmp/eth
GEAREXE_DIR=/tmp/gearexe
GEAR_REPO_DIR=/tmp/gear
PROJECT_DIR=$(pwd)
cd ../../
ROOT_DIR=$(pwd)

mkdir -p $ETH_DIR
mkdir -p $GEAREXE_DIR

cleanup() {
    exit_code=$?
    echo "[*]  Performing cleanup..."
    if [[ -n "$GEAREXE_PID" ]]; then
        echo "[*]  Stopping Gear node (PID: $GEAREXE_PID)..."
        kill $GEAREXE_PID 2>/dev/null || true
    fi

    if [[ -n "$RETH_PID" ]]; then
        echo "[*]  Stopping Reth node (PID: $RETH_PID)..."
        kill $RETH_PID 2>/dev/null || true
    fi

    # Print logs if exit code is not 0
    if [ $exit_code -ne 0 ]; then
        echo '[*]  Logs:'
        echo "============================RETH============================="
        cat $ETH_DIR/reth.log 2>/dev/null
        echo "===========================GEAREXE==========================="
        cat $GEAREXE_DIR/gearexe.log 2>/dev/null
    fi

    echo "[*]  Removing temporary files..."
    rm -rf $GEAREXE_DIR
    rm -rf $ETH_DIR
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
export SEQUENCER_PUBLIC_KEY_ETH="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
export PRIVATE_KEY="0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
export SENDER_PUBLIC_KEY_ETH="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
export ROUTER_AGGREGATED_PUBLIC_KEY_X="0x0000000000000000000000000000000000000000000000000000000000000001"
export ROUTER_AGGREGATED_PUBLIC_KEY_Y="0x4218F20AE6C646B363DB68605822FB14264CA8D2587FDD6FBC750D587E76A7EE"
export ROUTER_VERIFIABLE_SECRET_SHARING_COMMITMENT="0x"
export RPC="http://127.0.0.1:8545"
export WS_RPC="ws://127.0.0.1:8546"
export ETHERSCAN_API_KEY=
export BLOCK_TIME=5

path_to_gear_repo=

# Set path to gear repo
echo "[*]  Checking if path to gear repo is provided..."
if [[ -n "$GEAR_REPO" ]]; then
    path_to_gear_repo=$GEAR_REPO
else
    if [[ -z $GEAR_BRANCH ]]; then
        GEAR_BRANCH=master
    fi
    echo "[*]  Cloning gear repo (branch $GEAR_BRANCH)..."
    git clone --depth 1 -b $GEAR_BRANCH https://github.com/gear-tech/gear $GEAR_REPO_DIR
    path_to_gear_repo="$GEAR_REPO_DIR"
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
    cd $PROJECT_DIR
    cargo build --release
    ls -al target/wasm32-unknown-unknown/release

    # Deploy necessary contracts
    echo "[*]  Install forge dependencies ..."
    cd $path_to_contracts
    forge install
    forge clean
    forge compile
fi

if [[ -z "$RETH_BIN" ]]; then
    platform=
    case "$(uname)" in
        Linux*)   platform="x86_64-unknown-linux-gnu" ;;
        Darwin*)  platform="aarch64-apple-darwin" ;;
        CYGWIN*|MINGW*|MSYS*)
            platform="x86_64-pc-windows-gnu" ;;
        *)
            echo "Unknown OS"
            exit 1
            ;;
    esac

    RETH_LINK="https://github.com/paradigmxyz/reth/releases/download/v1.2.0/reth-v1.2.0-$platform.tar.gz"
    echo "[*]  Downloading reth ($RETH_LINK)..."
    curl -L $RETH_LINK -o "$ETH_DIR/reth.tar.gz"
    tar -xvf "$ETH_DIR/reth.tar.gz" -C $ETH_DIR
    ls -al $ETH_DIR
    RETH_BIN=$ETH_DIR/reth
    chmod +x $RETH_BIN
fi


echo "[*]  Running reth node..."
nohup $RETH_BIN node --dev.block-time 5sec --dev \
    --datadir $ETH_DIR --ws --ws.port 8546 \
    > $ETH_DIR/reth.log 2>&1 &
RETH_PID=$!
sleep 10


# Deploy contracts
echo "[*]  Deploying contracts..."
cd $path_to_contracts
export ROUTER_VALIDATORS_LIST=$VALIDATOR_PUBLIC_KEY_ETH
forge script script/Deployment.s.sol:DeploymentScript --rpc-url $RPC --broadcast --slow

# Get router address
echo "[*]  Getting router address..."
cd $path_to_gear_repo
BROADCAST_PATH="ethexe/contracts/broadcast/Deployment.s.sol/1337/run-latest.json"
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
./target/release/ethexe key -k $GEAREXE_DIR/keys insert $SEQUENCER_PRIVATE_KEY
./target/release/ethexe key -k $GEAREXE_DIR/keys insert $VALIDATOR_PRIVATE_KEY

# Run gearexe
echo "[*]  Running gearexe..."
export RUST_LOG=debug
export RUST_BACKTRACE=1
nohup ./target/release/ethexe --cfg none run --dev --base "$GEAREXE_DIR" \
    --sequencer $SEQUENCER_PUBLIC_KEY \
    --validator $VALIDATOR_PUBLIC_KEY \
    --validator-session $VALIDATOR_PUBLIC_KEY \
    --ethereum-rpc $WS_RPC \
    --ethereum-router $ROUTER_ADDRESS \
    --eth-block-time $BLOCK_TIME \
    --network-listen-addr "/ip4/0.0.0.0/udp/20333/quic-v1" \
    --rpc-port 9944 \
    --rpc-cors "all" > $GEAREXE_DIR/gearexe.log 2>&1 &
GEAREXE_PID=$!

(
  while kill -0 $GEAREXE_PID 2>/dev/null; do
    sleep 1
  done

  exit_code=$?

  if [[ $exit_code -ne 0 ]]; then
    echo "Gearexe exited with code $exit_code"
    tail -n 50 $GEAREXE_DIR/gearexe.log
    kill $$
  fi
) &

sleep 15

# Run tests
echo "[*]  Running tests..."
cd $ROOT_DIR
jest_bin=$(yarn bin jest)
cd $PROJECT_DIR
yarn node --no-warnings --experimental-vm-modules $jest_bin --runInBand
