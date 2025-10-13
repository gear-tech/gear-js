#!/bin/bash
set -e

LOGS_DIR=/tmp/gearexe-js/logs
PROJECT_DIR=$(pwd)
cd ../../
ROOT_DIR=$(pwd)

mkdir -p $LOGS_DIR

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

# Clean old logs
log_info "Cleaning previous log files..."
rm -rf $LOGS_DIR/*


# Function to wait for environment to be ready
wait_for_environment() {
    log_info "Waiting for environment to be ready..."
    while [ ! -f /tmp/gearexe-js/environment-ready ]; do
        # Check if setup process is still running
        if ! kill -0 $ENV_PID 2>/dev/null; then
            log_error "Environment setup process terminated unexpectedly"
            exit 1
        fi
        sleep 1
    done
    log_success "Environment is ready, proceeding with tests..."
}

# Function to setup test environment
setup_environment() {
    log_info "Setting up Gear.Exe environment..."
    cd $PROJECT_DIR

    # Remove any existing ready signal
    rm -f /tmp/gearexe-js/environment-ready

    # Start environment setup in background
    RUNNING_TESTS=true ./scripts/setup-env.sh &
    ENV_PID=$!

    wait_for_environment
}

# Function to compile contracts
compile_contracts() {
    log_info "Compiling contracts..."
    cd $PROJECT_DIR
    if ! forge build; then
        log_error "Failed to compile contracts"
        exit 1
    fi
    log_success "Contracts compiled successfully"
}

# Function to run tests
run_tests() {
    log_info "Running test suite..."
    cd $ROOT_DIR

    log_info "Locating Jest binary..."
    jest_bin=$(yarn bin jest)
    if [ $? -ne 0 ]; then
        log_error "Failed to locate Jest binary"
        exit 1
    fi
    log_success "Jest binary found at: $jest_bin"

    cd $PROJECT_DIR
    log_info "Starting test execution in sequential mode (--runInBand)..."
    log_info "Test output follows:"
    echo "--------------------------------------------------------"
    yarn node --no-warnings --experimental-vm-modules $jest_bin --runInBand
    test_result=$?
    echo "--------------------------------------------------------"

    if [ $test_result -ne 0 ]; then
        log_error "Tests failed with exit code: $test_result"
        exit $test_result
    else
        log_success "All tests passed successfully"
    fi
}

cleanup() {
    exit_code="$?"
    log_info "Script exited with code $exit_code"
    log_info "Performing cleanup..."

    if [[ -n "$ENV_PID" ]]; then
        log_info "Stopping Gear.Exe environment (PID: $ENV_PID)..."
        kill $ENV_PID 2>/dev/null || true
        log_info "Gear.Exe environment stopped"
    fi

    # Print logs if exit code is not 0
    if [ $exit_code -ne 0 ]; then
        log_error "Test execution failed. Log files preserved for debugging:"
        echo "    - Router deployment logs: $LOGS_DIR/deploy_contracts.log"
        echo "    - Reth node logs: $LOGS_DIR/reth.log"
        echo "    - Gearexe node logs: $LOGS_DIR/gearexe.log"

        # Print the last few lines of error logs to help with debugging
        log_info "Last 50 lines of gearexe logs:"
        tail -n 50 $LOGS_DIR/gearexe.log
    else
        log_success "Tests completed successfully. Removing logs..."
        rm -rf $LOGS_DIR
    fi

    # Clean up ready signal file
    rm -f /tmp/gearexe-js/environment-ready

    log_success "Cleanup completed"
}
trap cleanup EXIT

if [ -f .env ]; then
    source .env
fi

# Main execution flow
setup_environment
source "$PROJECT_DIR/scripts/test.env"
compile_contracts
run_tests
