import dotenv from 'dotenv';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ScriptError,
  logger,
  CommandRunner,
  isProcessRunning,
  killProcess,
  ensureDir,
  cleanDir,
  readFileContent,
  fileExists,
} from './common.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.join(__dirname, '../');

// ============================================================================
// Constants
// ============================================================================

const LOGS_DIR = '/tmp/vara-eth/logs';
const READY_FILE = '/tmp/vara-eth/environment-ready';
const SETUP_SCRIPT = path.join(PROJECT_DIR, 'scripts/setup-local-env.mjs');

// ============================================================================
// Test Runner State
// ============================================================================

const state = {
  envPid: null,
  envProcess: null,
  testFailed: false,
};

// ============================================================================
// Environment Setup
// ============================================================================

async function setupEnvironment() {
  logger.info('Setting up Vara.Eth environment with Anvil...');

  if (await fileExists(READY_FILE)) {
    try {
      await CommandRunner.command('rm', [READY_FILE]);
    } catch {
      // File might already be gone
    }
  }

  const child = spawn('node', [SETUP_SCRIPT], {
    cwd: PROJECT_DIR,
    stdio: 'inherit',
    env: {
      ...process.env,
      RUNNING_TESTS: 'true',
    },
    detached: true,
  });

  state.envPid = child.pid;
  state.envProcess = child;

  logger.info(`Environment setup started with PID: ${child.pid}`);
  logger.info('Waiting for environment to be ready...');

  let waited = 0;
  const maxWait = 300_000; // 5 minutes
  const pollInterval = 1_000; // 1 second

  while (!(await fileExists(READY_FILE))) {
    if (!isProcessRunning(child.pid)) {
      throw new ScriptError('Environment setup process terminated unexpectedly');
    }

    waited += pollInterval;
    if (waited > maxWait) {
      throw new ScriptError(`Timeout waiting for environment to be ready after ${maxWait / 1000}s`);
    }

    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  logger.success('Environment is ready, proceeding with tests...');
}

// ============================================================================
// Contract Compilation
// ============================================================================

async function compileContracts() {
  logger.info('Compiling contracts...');

  try {
    await CommandRunner.exec('forge build', {
      cwd: PROJECT_DIR,
      stdio: 'ignore',
    });
    logger.success('Contracts compiled successfully');
  } catch (error) {
    throw new ScriptError(`Failed to compile contracts: ${error.message}`);
  }
}

// ============================================================================
// Test Execution
// ============================================================================

async function runTests() {
  logger.info('Running test suite...');
  logger.info('Starting test execution in sequential mode (--runInBand)...');
  logger.info('Test output follows:');
  console.log('--------------------------------------------------------');

  return new Promise((resolve) => {
    const child = spawn('npx', ['jest', '--runInBand'], {
      cwd: PROJECT_DIR,
      stdio: 'inherit',
    });

    child.on('close', (code) => {
      console.log('--------------------------------------------------------');
      if (code !== 0) {
        logger.error(`Tests failed with exit code: ${code}`);
        state.testFailed = true;
        resolve(code);
      } else {
        logger.success('All tests passed successfully');
        state.testFailed = false;
        resolve(0);
      }
    });

    child.on('error', (error) => {
      logger.error(`Test execution error: ${error.message}`);
      state.testFailed = true;
      resolve(1);
    });
  });
}

// ============================================================================
// Cleanup
// ============================================================================

async function cleanup() {
  logger.info('Performing cleanup...');

  // Kill entire process group (parent and all children)
  if (state.envPid) {
    try {
      logger.info(`Stopping Vara.Eth environment (PID: ${state.envPid})...`);
      // Kill the entire process group using negative PID
      // This ensures all child processes (Anvil, VaraEth) are also terminated
      process.kill(-state.envPid, 'SIGTERM');
      // Wait for graceful shutdown
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Force kill if still running
      if (isProcessRunning(state.envPid)) {
        process.kill(-state.envPid, 'SIGKILL');
      }
      logger.info('Vara.Eth environment stopped');
    } catch (error) {
      logger.debug(`Error killing environment process group: ${error.message}`);
    }
  }

  // Print logs if tests failed
  if (state.testFailed) {
    logger.error('Test execution failed. Log files preserved for debugging:');
    console.error(`    - Router deployment logs: ${path.join(LOGS_DIR, 'deploy_contracts.log')}`);
    console.error(`    - Anvil node logs: ${path.join(LOGS_DIR, 'anvil.log')}`);
    console.error(`    - VaraEth node logs: ${path.join(LOGS_DIR, 'varaeth.log')}`);

    // Print last 50 lines of varaeth logs
    const varAethLogFile = path.join(LOGS_DIR, 'varaeth.log');
    const logs = await readFileContent(varAethLogFile);
    if (logs) {
      logger.info('Last 50 lines of varaeth logs:');
      console.error('=====================================================');
      console.error(logs.split('\n').slice(-50).join('\n'));
      console.error('=====================================================');
    }
  } else {
    logger.success('Tests completed successfully.');
  }

  // Clean up ready signal file
  try {
    await CommandRunner.command('rm', ['-f', READY_FILE]);
  } catch {
    // File might already be gone
  }

  logger.success('Cleanup completed');
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  // Load environment files
  dotenv.config({
    path: [path.join(PROJECT_DIR, 'scripts/anvil.env')],
    quiet: true,
  });

  // Setup signal handlers for graceful shutdown
  const handleSignal = async (signal) => {
    logger.info(`Received ${signal}, shutting down...`);
    await cleanup();
    process.exit(0);
  };

  process.on('SIGINT', () => handleSignal('SIGINT'));
  process.on('SIGTERM', () => handleSignal('SIGTERM'));

  try {
    // Initialize directories
    await ensureDir(LOGS_DIR);
    await cleanDir(LOGS_DIR);

    // Setup environment
    await setupEnvironment();

    // Compile contracts
    await compileContracts();

    // Run tests
    const testExitCode = await runTests();

    // Cleanup
    await cleanup();

    process.exit(testExitCode);
  } catch (error) {
    logger.error(`${error.message}`);
    await cleanup();
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
