import { spawn } from 'node:child_process';
import * as fs from 'node:fs';
import { config } from 'dotenv';
import { generateCodeHash } from '../../src/util/hash';

if (typeof WebSocket === 'undefined') {
  import('ws').then((module) => {
    global.WebSocket = module.default as any;
  });
}

config({ quiet: true });

const BLOCK_TIME = 1;
const COUNTER_CODE = 'target/wasm32-gear/release/counter.opt.wasm';
let routerAddress: string;
let keyStore: string;

const pathToEthexeBin = process.env.PATH_TO_ETHEXE!;

if (!pathToEthexeBin) {
  throw new Error('PATH_TO_ETHEXE environment variable is not set');
}

function setupCodeId() {
  const code = fs.readFileSync(COUNTER_CODE);
  const codeId = generateCodeHash(code);

  console.log(`\nGenerated code id: ${codeId}`);
  process.env.CODE_ID = codeId;
}

async function setupVaraEth() {
  const logFile = fs.createWriteStream('vara-eth.log', { flags: 'w' });

  const varaEth = spawn(
    pathToEthexeBin,
    ['run', '--dev', '--block-time', BLOCK_TIME.toString(), '--rpc-port', '9944'],
    {
      stdio: 'pipe',
      detached: true,
      env: {
        ...process.env,
        RUST_LOG: 'trace',
      },
    },
  );

  Object.assign(globalThis, {
    __VARA_ETH_PID__: varaEth.pid,
    __VARA_ETH_PROCESS__: varaEth,
    __VARA_ETH_LOG_FILE__: logFile,
  });

  await new Promise((resolve, reject) => {
    varaEth.stdout.on('data', (data) => {
      const dataStr = data.toString();
      logFile.write(dataStr);

      if (dataStr.includes('Key directory:')) {
        const match = dataStr.match(/Key directory: (\/.*)/);
        if (!match) {
          reject(new Error('Failed to extract key directory'));
        } else {
          keyStore = match[1].trim();
          console.log(`Key Store: ${keyStore}`);
        }
      }
      if (dataStr.includes('Ethereum router address:')) {
        const match = dataStr.match(/Ethereum router address: (0x[a-fA-F\d]{40})/);
        if (!match) {
          reject(new Error('Failed to extract router address'));
        } else {
          routerAddress = match[1].trim();
          console.log(`Router Address: ${routerAddress}`);
        }
      }
      if (keyStore && routerAddress) {
        resolve(0);
      }
    });

    varaEth.stderr.on('data', (data) => {
      logFile.write(data.toString());
    });

    varaEth.on('error', (err) => {
      reject(new Error(`Failed to start vara-eth process: ${err.message}`));
    });

    varaEth.on('exit', (code, signal) => {
      if (code !== null && code !== 0) {
        reject(new Error(`vara-eth process exited with code ${code}`));
      } else if (signal !== null) {
        reject(new Error(`vara-eth process was killed with signal ${signal}`));
      }
    });
  });

  process.env.ROUTER_ADDRESS = routerAddress;
}

export default async () => {
  setupCodeId();

  await setupVaraEth();
};
