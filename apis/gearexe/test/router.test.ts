import { ethers } from 'ethers';
import * as fs from 'fs';
import {
  CodeState,
  GearExeApi,
  getMirrorContract,
  getRouterContract,
  HttpGearexeProvider,
  uploadContract,
} from '../src';
import { config } from './config';
import { ethWsProvider, waitNBlocks } from './common';
import path from 'path';

const code = fs.readFileSync(path.join(config.targetDir, 'counter.opt.wasm'));
let codeId: string;
let wallet: ethers.Wallet;
let api: GearExeApi;
let router: ReturnType<typeof getRouterContract>;

let codeValidatedPromise: Promise<boolean>;

beforeAll(async () => {
  api = new GearExeApi(new HttpGearexeProvider());
  wallet = new ethers.Wallet(config.privateKey, ethWsProvider());
  router = getRouterContract(config.routerId, wallet);
});

afterAll(async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  wallet.provider!.destroy();
});

const uploadCodeDescribe = config.skipUpload ? describe.skip : describe;

if (config.skipUpload) {
  codeId = config.codeId;
}

describe('router', () => {
  test('check router initialized', async () => {
    const blockhash = await router.genesisBlockHash();
    expect(blockhash).toBeDefined();
  });
});

uploadCodeDescribe('upload code', () => {
  test('upload code', async () => {
    const tx = await router.requestCodeValidationNoBlob(code, api);
    codeId = tx.codeId;

    codeValidatedPromise = tx.waitForCodeGotValidated();
    await tx.processDevBlob();

    const receipt = await tx.getReceipt();

    expect(receipt.blockHash).toBeDefined();
  });

  test('wait for code got validated', async () => {
    expect(await codeValidatedPromise).toBeTruthy();
    await waitNBlocks(5);

    console.log(codeId);
  });
});

describe('router', () => {
  test('check code state', async () => {
    expect(await router.codeState(codeId)).toBe(CodeState.Validated);
  });

  test('create program', async () => {
    const tx = await router.createProgram(codeId);

    await tx.send();

    const id = await tx.getProgramId();

    const mirror = getMirrorContract(id, wallet);

    const mirrorRouter = (await mirror.router()).toLowerCase();

    expect(mirrorRouter).toBe(config.routerId);
  });

  test('create program with abi interface', async () => {
    const {
      bytecode: { object: bytecode },
    } = JSON.parse(fs.readFileSync(path.join(config.solOut, 'Counter.sol', 'CounterAbi.json'), 'utf-8'));

    const u8aByteCode = Uint8Array.from(bytecode);

    const contractAddr = await uploadContract(u8aByteCode, wallet);

    expect(contractAddr).toBeDefined();

    const tx = await router.createProgramWithAbiInterface(codeId, contractAddr);

    const receipt = await tx.sendAndWaitForReceipt();

    expect(receipt.blockHash).toBeDefined();
  });
});
