import dotenv from 'dotenv';
import { readFile, writeFile, rm, mkdir } from 'node:fs/promises';
import { existsSync, createWriteStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import https from 'node:https';
import { ScriptError, logger, CommandRunner, isProcessRunning, parseVersion, compareVersions } from './common.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.join(__dirname, '..');
const ROOT_DIR = path.resolve(__dirname, '../../..');

const FOUNDRY_VERSION = '1.5.0';
const GITHUB_ETHEXE_RELEASE_URL = 'https://github.com/gear-tech/gear/releases/download/build/ethexe';

class Config {
  constructor() {
    this.envFiles = [
      path.join(PROJECT_DIR, 'scripts/anvil.env'),
      path.join(PROJECT_DIR, '.env'),
      path.join(ROOT_DIR, '.env'),
    ];

    this.dirs = {
      tmp: '/tmp/vara-eth',
      anvil: '/tmp/vara-eth/anvil',
      varaeth: '/tmp/vara-eth/vara-eth',
      logs: '/tmp/vara-eth/logs',
      project: PROJECT_DIR,
      root: ROOT_DIR,
    };

    this.load();
  }

  load() {
    for (const file of this.envFiles) {
      if (existsSync(file)) {
        dotenv.config({ path: file, override: true, quiet: true });
      }
    }
  }

  get(key, defaultValue = undefined) {
    const value = process.env[key];
    if (!value && !defaultValue) {
      throw new ScriptError(`Environment variable ${key} is not set`);
    }
    return value ?? defaultValue;
  }

  getOptional(key, defaultValue = null) {
    return process.env[key] ?? defaultValue;
  }

  has(key) {
    return key in process.env && process.env[key] !== '';
  }

  validateRequired(keys) {
    const missing = keys.filter((key) => !this.has(key));
    if (missing.length > 0) {
      throw new ScriptError(`Required environment variables not set: ${missing.join(', ')}`);
    }
  }

  get skipBuild() {
    return this.get('SKIP_BUILD', 'false') === 'true';
  }

  get runningTests() {
    return this.has('RUNNING_TESTS');
  }

  get takeCliFromBuildRelease() {
    return this.get('TAKE_CLI_FROM_BUILD_RELEASE', 'false') === 'true';
  }
}

async function setupDirs(config) {
  logger.info('Setting up temp directories...');
  await mkdir(config.dirs.anvil, { recursive: true });
  await mkdir(config.dirs.varaeth, { recursive: true });

  logger.info('Cleaning old logs...');
  try {
    await rm(config.dirs.logs, { recursive: true, force: true });
    await mkdir(config.dirs.logs, { recursive: true });
  } catch (error) {
    logger.debug(`Log cleanup warning: ${error.message}`);
  }
}

async function validateFoundry() {
  logger.info('Validating Foundry installation...');

  const foundryPath = `${process.env.HOME}/.foundry/bin`;

  // Check if anvil is available
  let anvilAvailable = false;
  try {
    const versionOutput = await CommandRunner.command('anvil', ['--version']);
    anvilAvailable = true;
    logger.debug(`Found anvil: ${versionOutput.trim()}`);
  } catch {
    anvilAvailable = false;
  }

  // If anvil not found, try installing foundryup
  if (!anvilAvailable) {
    logger.info('Installing foundryup...');
    try {
      await CommandRunner.exec('curl -L https://foundry.paradigm.xyz | bash');
      process.env.PATH = `${foundryPath}:${process.env.PATH}`;
      logger.info('Foundryup installed, updating PATH...');
    } catch (error) {
      throw new ScriptError('Failed to install foundryup');
    }

    // Try to find anvil again
    try {
      await CommandRunner.command('anvil', ['--version']);
    } catch {
      throw new ScriptError(
        `Anvil is still not found. Please ensure Foundry is installed from https://getfoundry.sh and ${foundryPath} is in PATH`,
      );
    }
  }

  // Validate Foundry version
  try {
    const versionOutput = await CommandRunner.command('forge', ['--version']);
    const installedVersion = parseVersion(versionOutput);

    if (!installedVersion) {
      throw new ScriptError('Could not parse Foundry version');
    }

    const requiredVersion = parseVersion(FOUNDRY_VERSION);
    const versionDiff = compareVersions(installedVersion, requiredVersion);

    if (versionDiff < 0) {
      throw new ScriptError(
        `Foundry version ${installedVersion.toString()} is older than required ${requiredVersion.toString()}. Please upgrade: curl -L https://foundry.paradigm.xyz | bash`,
      );
    }

    logger.success(
      `Foundry ${installedVersion.toString()} is properly installed (required: ${requiredVersion.toString()})`,
    );
  } catch (error) {
    if (error instanceof ScriptError) throw error;
    throw new ScriptError(`Failed to validate Foundry version: ${error.message}`);
  }
}

async function downloadEthexeFromRelease(outputPath) {
  logger.info('Downloading ethexe binary from GitHub releases...');

  return new Promise((resolve, reject) => {
    const file = createWriteStream(outputPath);

    https
      .get(GITHUB_ETHEXE_RELEASE_URL, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          logger.debug(`Following redirect to ${redirectUrl}`);
          https
            .get(redirectUrl, (redirectResponse) => {
              if (redirectResponse.statusCode !== 200) {
                reject(new ScriptError(`Failed to download ethexe: HTTP ${redirectResponse.statusCode}`));
                return;
              }
              redirectResponse.pipe(file);
            })
            .on('error', reject);
        } else if (response.statusCode === 200) {
          response.pipe(file);
        } else {
          reject(new ScriptError(`Failed to download ethexe: HTTP ${response.statusCode}`));
        }
      })
      .on('error', reject);

    file.on('finish', () => {
      file.close();
      logger.success('Ethexe binary downloaded successfully');
      resolve();
    });

    file.on('error', (error) => {
      reject(new ScriptError(`Failed to write ethexe binary: ${error.message}`));
    });
  });
}

async function setupGearRepo(config) {
  const pathToGear = config.getOptional('PATH_TO_GEAR_REPO');

  if (pathToGear) {
    logger.info(`Gear repo found at ${pathToGear}`);
    return pathToGear;
  }

  const branch = config.getOptional('GEAR_BRANCH', 'master');
  const gearRepoPath = config.dirs.tmp + '/gear';

  logger.info(`Cloning gear repo (branch ${branch})...`);
  try {
    await CommandRunner.command('git', [
      'clone',
      '--depth',
      '1',
      '-b',
      branch,
      'https://github.com/gear-tech/gear',
      gearRepoPath,
    ]);
    logger.success('Gear repo cloned successfully');
  } catch (error) {
    throw new ScriptError(`Failed to clone gear repo: ${error.message}`);
  }

  return gearRepoPath;
}

async function buildContracts(config, gearRepoPath) {
  if (config.skipBuild) {
    logger.info('Skipping contract build (SKIP_BUILD=true)');
    return;
  }

  const pathToContracts = path.join(gearRepoPath, 'ethexe/contracts');

  logger.info('Setting up Forge environment...');
  try {
    await CommandRunner.exec('forge install', {
      cwd: pathToContracts,
    });
  } catch (error) {
    throw new ScriptError(`Failed to install Forge dependencies: ${error.message}`);
  }

  logger.info('Cleaning Forge build artifacts...');
  try {
    await CommandRunner.exec('forge clean', { cwd: pathToContracts });
  } catch (error) {
    logger.debug(`Forge clean warning: ${error.message}`);
  }

  logger.info('Compiling contracts with Forge...');
  try {
    await CommandRunner.exec('forge compile', { cwd: pathToContracts });
    logger.success('Contracts compiled successfully');
  } catch (error) {
    throw new ScriptError(`Failed to compile contracts: ${error.message}`);
  }
}

async function buildPrograms(config) {
  if (config.skipBuild) {
    logger.info('Skipping program build (SKIP_BUILD=true)');
    return;
  }

  if (!config.runningTests) {
    logger.info('Skipping program build (RUNNING_TESTS not set)');
    return;
  }

  logger.info('Building WASM programs...');
  try {
    await CommandRunner.exec('cargo build --release', {
      cwd: config.dirs.project,
    });
    logger.success('Programs built successfully');
    await CommandRunner.exec('ls -al target/wasm32-gear/release', {
      cwd: config.dirs.project,
    });
  } catch (error) {
    throw new ScriptError(`Failed to build programs: ${error.message}`);
  }
}

async function buildVaraEth(config, gearRepoPath) {
  if (config.skipBuild) {
    logger.info('Skipping varaeth build (SKIP_BUILD=true)');
    return;
  }

  if (config.takeCliFromBuildRelease) {
    logger.info('Downloading ethexe from GitHub releases instead of building...');
    const ethexePath = path.join(gearRepoPath, 'target/release/ethexe');
    await mkdir(path.dirname(ethexePath), { recursive: true });
    await downloadEthexeFromRelease(ethexePath);

    // Make the binary executable
    try {
      await CommandRunner.command('chmod', ['+x', ethexePath]);
      logger.success('Ethexe binary is ready');
    } catch (error) {
      throw new ScriptError(`Failed to make ethexe executable: ${error.message}`);
    }
    return;
  }

  logger.info('Building varaeth...');
  try {
    await CommandRunner.exec('cargo build -p ethexe-cli --release', {
      cwd: gearRepoPath,
    });
    logger.success('Varaeth built successfully');
  } catch (error) {
    throw new ScriptError(`Failed to build varaeth: ${error.message}`);
  }
}

async function killProcessOnPort(port) {
  try {
    logger.info(`Attempting to free port ${port}...`);
    // Kill any process using the port (works on macOS and Linux)
    // Use proper number validation for port
    const portNum = parseInt(port, 10);
    if (Number.isNaN(portNum) || portNum < 1 || portNum > 65535) {
      logger.debug(`Invalid port number: ${port}`);
      return;
    }
    // Use shell with explicit validation
    await CommandRunner.exec(`lsof -ti:${portNum} | xargs kill -9 2>/dev/null || true`, {
      shell: '/bin/sh',
    });
    // Wait a bit for the port to be released
    await new Promise((resolve) => setTimeout(resolve, 500));
  } catch (error) {
    logger.debug(`Could not kill process on port ${port}: ${error.message}`);
  }
}

async function startAnvil(config, state) {
  const blockTime = config.get('BLOCK_TIME', '1');
  const numAccounts = 10;
  const logFile = path.join(config.dirs.logs, 'anvil.log');
  const rpcPort = 8545; // Anvil's default RPC port

  logger.info('Starting Anvil Ethereum node...');
  logger.info(`Running with parameters: --block-time ${blockTime} --chain-id 31337`);

  // Kill any existing process on the RPC port
  await killProcessOnPort(rpcPort);

  const child = CommandRunner.spawn(
    'anvil',
    [
      '--block-time',
      blockTime,
      '--chain-id',
      '31337',
      '--accounts',
      String(numAccounts),
      '--mnemonic',
      'test test test test test test test test test test test junk',
      '--balance',
      '5000000000000000000',
    ],
    { logFile },
  );

  state.anvilPid = child.pid;
  state.anvilProcess = child;

  logger.success(`Anvil node started with PID: ${child.pid}`);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (!isProcessRunning(child.pid)) {
    const logs = await readFile(logFile, 'utf-8').catch(() => 'unable to read logs');
    throw new ScriptError(
      `Anvil failed to start. Check logs at: ${logFile}\nLogs: ${logs.split('\n').slice(-10).join('\n')}`,
    );
  }

  logger.info(`Anvil has ${numAccounts} prefunded test accounts.`);
  logger.info(
    `You can obtain them using "test test test test test test test test test test test junk" mnemonic by different derivation paths`,
  );
  logger.success('Anvil node is ready');
}

async function deployContracts(config, gearRepoPath, state) {
  const rpc = config.get('ETHEREUM_HTTP_RPC');
  const pathToContracts = path.join(gearRepoPath, 'ethexe/contracts');
  const logFile = path.join(config.dirs.logs, 'deploy_contracts.log');

  logger.info('Deploying Ethereum contracts...');
  logger.info(`Deploying to Eth node at ${rpc}`);
  logger.info(`Deployment logs will be saved to: ${logFile}`);

  try {
    await CommandRunner.command(
      'forge',
      ['script', 'script/Deployment.s.sol:DeploymentScript', '--rpc-url', rpc, '--broadcast', '--slow', '-vvvv'],
      {
        cwd: pathToContracts,
        stdio: 'ignore',
        env: {
          ...process.env,
          ROUTER_VALIDATORS_LIST: config.get('VALIDATOR_KEY_ADDRESS'),
          PRIVATE_KEY: config.get('CLIENT_KEY_PRIVATE'),
        },
      },
    );
    logger.success('Contracts deployed successfully');
  } catch (error) {
    const logs = await readFile(logFile, 'utf-8').catch(() => 'unable to read logs');
    throw new ScriptError(
      `Contract deployment failed. Check logs at: ${logFile}\n\nError: ${error.message}\n\nLogs:\n${logs.split('\n').slice(-20).join('\n')}`,
    );
  }
}

async function extractRouterAddress(config, gearRepoPath) {
  const artifactsDir = config.get('ARTIFACTS_DIR', '31337');
  const broadcastPath = path.join(
    gearRepoPath,
    'ethexe/contracts/broadcast/Deployment.s.sol',
    artifactsDir,
    'run-latest.json',
  );

  logger.info('Extracting router contract address from deployment artifacts...');

  if (!existsSync(broadcastPath)) {
    throw new ScriptError(`Deployment artifact not found at: ${broadcastPath}\nContract deployment may have failed`);
  }

  logger.info(`Parsing deployment artifacts from ${broadcastPath}...`);

  try {
    const content = await readFile(broadcastPath, 'utf-8');
    const artifacts = JSON.parse(content);

    const routerTx = artifacts.transactions.find((tx) => tx.contractName === 'Router');

    if (!routerTx) {
      throw new ScriptError('Failed to extract Router implementation address from deployment artifacts');
    }

    const routerAddress = routerTx.contractAddress;
    logger.success(`Router implementation address: ${routerAddress}`);

    const proxyTx = artifacts.transactions.find(
      (tx) =>
        tx.contractName === 'TransparentUpgradeableProxy' &&
        tx.transactionType === 'CREATE' &&
        tx.arguments &&
        tx.arguments.some((arg) => typeof arg === 'string' && arg.toLowerCase().includes(routerAddress.toLowerCase())),
    );

    if (!proxyTx) {
      throw new ScriptError('Failed to extract Router proxy address from deployment artifacts');
    }

    const proxyAddress = proxyTx.contractAddress;
    logger.success(`Router proxy address: ${proxyAddress}`);

    return proxyAddress;
  } catch (error) {
    if (error instanceof ScriptError) throw error;
    throw new ScriptError(`Failed to parse deployment artifacts: ${error.message}`);
  }
}

async function updateTestEnv(config, routerAddress) {
  const testEnvPath = path.join(config.dirs.project, 'scripts/anvil.env');

  logger.info(`Updating ROUTER_ADDRESS in ${testEnvPath}...`);

  try {
    let content = await readFile(testEnvPath, 'utf-8');

    if (content.includes('export ROUTER_ADDRESS=')) {
      content = content.replace(/^export ROUTER_ADDRESS=.*$/m, `export ROUTER_ADDRESS="${routerAddress}"`);
    } else {
      content += `\nexport ROUTER_ADDRESS="${routerAddress}"\n`;
    }

    await writeFile(testEnvPath, content, 'utf-8');
    logger.success('ROUTER_ADDRESS updated in anvil.env');
  } catch (error) {
    throw new ScriptError(`Failed to update anvil.env: ${error.message}`);
  }
}

async function setupVaraEthKeys(config, gearRepoPath, state) {
  const varAethDir = config.dirs.varaeth;
  const validatorPrivateKey = config.get('VALIDATOR_KEY_PRIVATE');
  const networkPrivateKey = config.get('NETWORK_KEY_PRIVATE');
  const clientPrivateKey = config.get('CLIENT_KEY_PRIVATE');
  const ethexePath = path.join(gearRepoPath, 'target/release/ethexe');

  logger.info('Setting up Gear node keys...');

  try {
    logger.info('Inserting validator key...');
    const validatorOutput = await CommandRunner.command(
      ethexePath,
      ['--cfg', 'none', 'key', '-k', path.join(varAethDir, 'keys'), 'insert', validatorPrivateKey],
      { cwd: gearRepoPath },
    );

    const validatorPubkeyMatch = validatorOutput.match(/Public key: (0x[0-9a-fA-F]+)/);
    if (!validatorPubkeyMatch) {
      throw new ScriptError('Failed to extract validator public key from output');
    }

    const validatorPubkey = validatorPubkeyMatch[1].replace(/^0x/, '');
    logger.success(`Validator key configured: ${validatorPubkey}`);

    logger.info('Inserting network key...');
    const networkOutput = await CommandRunner.command(
      ethexePath,
      ['key', '-k', path.join(varAethDir, 'net'), 'insert', networkPrivateKey],
      { cwd: gearRepoPath },
    );

    const networkPubkeyMatch = networkOutput.match(/Public key: (0x[0-9a-fA-F]+)/);
    if (!networkPubkeyMatch) {
      throw new ScriptError('Failed to extract network public key from output');
    }

    const networkPubkey = networkPubkeyMatch[1].replace(/^0x/, '');
    logger.success(`Network key configured: ${networkPubkey}`);

    state.validatorPubkey = validatorPubkey;
    state.networkPubkey = networkPubkey;

    logger.info('Inserting client key...');
    const clientOutput = await CommandRunner.command(
      ethexePath,
      ['key', '-k', path.join(varAethDir, 'keys'), 'insert', clientPrivateKey],
      { cwd: gearRepoPath },
    );

    const clientPubkeyMatch = clientOutput.match(/Public key: (0x[0-9a-fA-F]+)/);
    if (!clientPubkeyMatch) {
      throw new ScriptError('Failed to extract client public key from output');
    }

    const clientPubkey = clientPubkeyMatch[1].replace(/^0x/, '');
    logger.success(`Client key configured: ${clientPubkey}`);
  } catch (error) {
    throw new ScriptError(`Failed to setup keys: ${error.message}`);
  }
}

async function startVaraEth(config, gearRepoPath, state) {
  const varAethDir = config.dirs.varaeth;
  const wsRpc = config.get('ETHEREUM_WS_RPC');
  const routerAddress = config.get('ROUTER_ADDRESS');
  const blockTime = config.get('BLOCK_TIME', '1');
  const rpc = config.get('ETHEREUM_HTTP_RPC');
  const logFile = path.join(config.dirs.logs, 'varaeth.log');

  logger.info('Starting VaraEth...');

  logger.info('VaraEth configuration:');
  console.log(`    - Base directory: ${varAethDir}`);
  console.log(`    - Validator key: ${state.validatorPubkey}`);
  console.log(`    - Network key: ${state.networkPubkey}`);
  console.log(`    - Ethereum RPC: ${wsRpc}`);
  console.log(`    - Router address: ${routerAddress}`);
  console.log(`    - Block time: ${blockTime}`);
  console.log(`    - RPC port: 9944`);

  const ethexePath = path.join(gearRepoPath, 'target/release/ethexe');

  const child = CommandRunner.spawn(
    ethexePath,
    [
      '--cfg',
      'none',
      'run',
      '--tmp',
      '--base',
      varAethDir,
      '--validator',
      state.validatorPubkey,
      '--validator-session',
      state.validatorPubkey,
      '--network-key',
      state.networkPubkey,
      '--ethereum-rpc',
      wsRpc,
      '--ethereum-router',
      routerAddress,
      '--eth-beacon-rpc',
      rpc,
      '--eth-block-time',
      blockTime,
      '--network-listen-addr',
      '/ip4/0.0.0.0/udp/20333/quic-v1',
      '--rpc-port',
      '9944',
      '--rpc-cors',
      'all',
    ],
    { logFile },
  );

  state.varAethPid = child.pid;
  state.varAethProcess = child;

  logger.success(`VaraEth node started with PID: ${child.pid}`);

  await new Promise((resolve) => setTimeout(resolve, 5000));

  if (!isProcessRunning(child.pid)) {
    const logs = await readFile(logFile, 'utf-8').catch(() => 'unable to read logs');
    throw new ScriptError(
      `VaraEth failed to start. Check logs at: ${logFile}\nLogs: ${logs.split('\n').slice(-20).join('\n')}`,
    );
  }

  logger.success('VaraEth node is ready');
}

async function uploadCode(config, gearRepoPath) {
  const wsRpc = config.get('ETHEREUM_WS_RPC');
  const routerAddress = config.get('ROUTER_ADDRESS');
  const senderPublicKey = config.get('CLIENT_KEY_ADDRESS');
  const varAethDir = config.dirs.varaeth;
  const wasmFile = path.join(config.dirs.project, 'target/wasm32-gear/release/counter.opt.wasm');
  const keyStore = path.join(varAethDir, 'keys');

  logger.info(`Uploading code:`);
  console.log(`    - Rpc: ${wsRpc}`);
  console.log(`    - Wasm: ${wasmFile}`);
  console.log(`    - Router Address: ${routerAddress}`);
  console.log(`    - Sender Public Key: ${senderPublicKey}`);
  console.log(`    - Key Store: ${keyStore}`);

  const ethexePath = path.join(gearRepoPath, 'target/release/ethexe');

  try {
    await CommandRunner.command(
      ethexePath,
      [
        '--cfg',
        'none',
        'tx',
        '--ethereum-rpc',
        wsRpc,
        '--ethereum-router',
        routerAddress,
        '--key-store',
        keyStore,
        '--sender',
        senderPublicKey,
        'upload',
        '-l',
        wasmFile,
        '-w',
      ],
      { cwd: gearRepoPath },
    );
    logger.success('Code uploaded successfully');
  } catch (error) {
    logger.error(`Code upload failed: ${error.message}`);
  }
}

async function monitorVaraEth(state) {
  if (!state.varAethProcess) return;

  return new Promise((resolve) => {
    state.varAethProcess.on('exit', (code) => {
      if (code !== 0) {
        logger.error(`VaraEth exited unexpectedly with code ${code}`);
      }
    });

    state.varAethProcess.on('error', (error) => {
      logger.error(`VaraEth error: ${error.message}`);
    });
  });
}

async function createReadySignal(config) {
  const readyFile = path.join(config.dirs.tmp, 'environment-ready');

  logger.success('Environment setup complete. Creating ready signal...');

  try {
    await writeFile(readyFile, '', 'utf-8');
    logger.success(`Ready signal created at ${readyFile}`);
  } catch (error) {
    throw new ScriptError(`Failed to create ready signal: ${error.message}`);
  }
}

async function cleanup(state, config, error = null) {
  logger.info('Performing cleanup...');

  if (state.varAethProcess && isProcessRunning(state.varAethPid)) {
    logger.info(`Stopping VaraEth node (PID: ${state.varAethPid})...`);
    try {
      state.varAethProcess.kill('SIGTERM');
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (isProcessRunning(state.varAethPid)) {
        state.varAethProcess.kill('SIGKILL');
      }
    } catch {
      // Already dead
    }
    logger.info('VaraEth node stopped');
  }

  if (state.anvilProcess && isProcessRunning(state.anvilPid)) {
    logger.info(`Stopping Anvil node (PID: ${state.anvilPid})...`);
    try {
      state.anvilProcess.kill('SIGTERM');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (isProcessRunning(state.anvilPid)) {
        state.anvilProcess.kill('SIGKILL');
      }
    } catch {
      // Already dead
    }
    logger.info('Anvil node stopped');
  }

  logger.info('Removing temporary files...');
  try {
    await rm(config.dirs.anvil, { recursive: true, force: true });
    const readyFile = path.join(config.dirs.tmp, 'environment-ready');
    if (existsSync(readyFile)) {
      await rm(readyFile, { force: true });
    }
  } catch (err) {
    logger.debug(`Temp cleanup warning: ${err.message}`);
  }

  logger.success('Cleanup completed');

  if (error) {
    logger.error('Environment setup failed. Log files preserved for debugging:');
    console.error(`    - Router deployment logs: ${path.join(config.dirs.logs, 'deploy_contracts.log')}`);
    console.error(`    - Anvil node logs: ${path.join(config.dirs.logs, 'anvil.log')}`);
    console.error(`    - VaraEth node logs: ${path.join(config.dirs.logs, 'varaeth.log')}`);
    console.error(`\n${error.message}`);
  }
}

async function main() {
  const state = {
    anvilPid: null,
    anvilProcess: null,
    varAethPid: null,
    varAethProcess: null,
    validatorPubkey: null,
    networkPubkey: null,
  };

  const config = new Config();

  const handleSignal = async (signal) => {
    logger.info(`Received ${signal}, shutting down...`);
    await cleanup(state, config);
    process.exit(0);
  };

  process.on('SIGINT', () => handleSignal('SIGINT'));
  process.on('SIGTERM', () => handleSignal('SIGTERM'));

  try {
    config.validateRequired([
      'ETHEREUM_HTTP_RPC',
      'ETHEREUM_WS_RPC',
      'VALIDATOR_KEY_PRIVATE',
      'NETWORK_KEY_PRIVATE',
      'ETHEREUM_BEACON_RPC',
    ]);

    await setupDirs(config);

    await validateFoundry();

    const gearRepoPath = await setupGearRepo(config);

    if (!config.skipBuild) {
      await buildContracts(config, gearRepoPath);
      await buildPrograms(config);
      await buildVaraEth(config, gearRepoPath);
    }

    await startAnvil(config, state);

    await deployContracts(config, gearRepoPath, state);

    const routerAddress = await extractRouterAddress(config, gearRepoPath);
    process.env.ROUTER_ADDRESS = routerAddress;

    await updateTestEnv(config, routerAddress);

    await setupVaraEthKeys(config, gearRepoPath, state);
    await startVaraEth(config, gearRepoPath, state);

    await uploadCode(config, gearRepoPath);

    await createReadySignal(config);

    logger.info('Environment is running. Waiting for termination signal...');
    await monitorVaraEth(state);

    await new Promise(() => {});
  } catch (error) {
    await cleanup(state, config, error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
