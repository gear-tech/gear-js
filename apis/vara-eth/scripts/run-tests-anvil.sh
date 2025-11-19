#!/bin/bash
set -e

LOGS_DIR=/tmp/vara-eth/logs
PROJECT_DIR=$(pwd)
cd ../../
ROOT_DIR=$(pwd)
TEST_FAILED=0

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

source "$PROJECT_DIR/scripts/test.env"

# Function to wait for environment to be ready
wait_for_environment() {
    log_info "Waiting for environment to be ready..."
    while [ ! -f /tmp/vara-eth/environment-ready ]; do
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
    log_info "Setting up Vara.Eth environment with Anvil..."
    cd $PROJECT_DIR

    rm -f /tmp/vara-eth/environment-ready


    RUNNING_TESTS=true ./scripts/setup-anvil.sh &
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

    cd $PROJECT_DIR
    log_info "Starting test execution in sequential mode (--runInBand)..."
    log_info "Test output follows:"
    echo "--------------------------------------------------------"
    set +e
    npx jest --runInBand
    test_result=$?
    set -e
    echo "--------------------------------------------------------"

    if [ $test_result -ne 0 ]; then
        TEST_FAILED=1
        log_error "Tests failed with exit code: $test_result"
        return $test_result
    else
        TEST_FAILED=0
        log_success "All tests passed successfully"
        return 0
    fi
}

cleanup() {
    log_info "Performing cleanup..."

    if [[ -n "$ENV_PID" ]]; then
        log_info "Stopping Vara.Eth environment (PID: $ENV_PID)..."
        kill $ENV_PID 2>/dev/null || true
        log_info "Vara.Eth environment stopped"
    fi

    # Print logs if tests failed
    if [ $TEST_FAILED -ne 0 ]; then
        log_error "Test execution failed. Log files preserved for debugging:"
        echo "    - Router deployment logs: $LOGS_DIR/deploy_contracts.log"
        echo "    - Anvil node logs: $LOGS_DIR/anvil.log"
        echo "    - VaraEth node logs: $LOGS_DIR/varaeth.log"

        # Print the last few lines of error logs to help with debugging
        log_info "Last 50 lines of varaeth logs:"
        echo "====================================================="
        tail -n 50 $LOGS_DIR/varaeth.log 2>/dev/null || echo "Log file not found"
        echo "====================================================="
    else
        log_success "Tests completed successfully."
    fi

    # Clean up ready signal file
    rm -f /tmp/vara-eth/environment-ready

    log_success "Cleanup completed"
}
trap cleanup EXIT

if [ -f .env ]; then
    source .env
fi

# Main execution flow
setup_environment
compile_contracts
run_tests
exit_code=$?
exit $exit_code
