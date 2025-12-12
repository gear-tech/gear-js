import * as fs from 'fs';
import { config } from 'dotenv';
import { generateCodeHash } from '../../src/util/hash';
import { execSync, spawn } from 'child_process';

if (typeof WebSocket === 'undefined') {
  import('ws').then((module) => {
    global.WebSocket = module.default as any;
  });
}

config({ quiet: true });

const BLOCK_TIME = 1;
const COUNTER_CODE = 'target/wasm32-gear/release/counter.opt.wasm';
const ANVIL_RPC = 'ws://127.0.0.1:8545';
let routerAddress: string;
const SENDER_ADDRESS = '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc';
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
  });

  process.env.ROUTER_ADDRESS = routerAddress;
}
async function uploadCode() {
  execSync(
    `${pathToEthexeBin} tx --ethereum-rpc ${ANVIL_RPC} --ethereum-router ${routerAddress} --sender ${SENDER_ADDRESS} --key-store "${keyStore}" upload ${COUNTER_CODE} -w`,
    { stdio: 'inherit' },
  );
}

export default async () => {
  setupCodeId();

  await setupVaraEth();

  uploadCode();
};
