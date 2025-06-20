import { ethers } from 'ethers';
import * as fs from 'fs';
import { CodeState, GearExeApi, getMirrorContract, getRouterContract, HttpGearexeProvider } from '../src';
import { config } from './config';
import { ethWsProvider, waitNBlocks } from './common';
import path from 'path';

const code = fs.readFileSync(path.join(config.targetDir, 'counter.opt.wasm'));
let _codeId: string;
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

const uploadCodeTest = () => {
  test('upload code', async () => {
    const tx = await router.requestCodeValidationNoBlob(code, api);
    _codeId = tx.codeId;

    codeValidatedPromise = tx.waitForCodeGotValidated();
    await tx.processDevBlob();

    const receipt = await tx.getReceipt();

    expect(receipt.blockHash).toBeDefined();
  });

  test('wait for code got validated', async () => {
    expect(await codeValidatedPromise).toBeTruthy();
    await waitNBlocks(5);
  });
};

if (!config.skipUpload) {
  describe('upload code', uploadCodeTest);
} else {
  _codeId = config.codeId;
}

describe('router', () => {
  test('check code state', async () => {
    expect(await router.codeState(_codeId)).toBe(CodeState.Validated);
  });

  test('create program', async () => {
    const tx = await router.createProgram(_codeId);

    await tx.send();

    const id = await tx.getProgramId();

    const mirror = getMirrorContract(id, wallet);

    const mirrorRouter = (await mirror.router()).toLowerCase();

    expect(mirrorRouter).toBe(config.routerId);
  });
});
