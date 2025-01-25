import { ethers } from 'ethers';
import * as fs from 'fs';
import { CodeState, GearExeApi, getMirrorContract, getRouterContract, HttpGearexeProvider } from '../src';
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
  wallet.provider.destroy();
});

const uploadCodeTest = () => {
  test('upload code', async () => {
    const [txHash, _codeId] = (await api.provider.send('dev_setBlob', [ethers.hexlify(new Uint8Array(code))])) as [
      string,
      string,
    ];

    expect(_codeId).toBe(config.codeId);

    codeId = _codeId;

    const { receipt, waitForCodeGotValidated } = await router.requestCodeValidationNoBlob(_codeId, txHash);

    codeValidatedPromise = waitForCodeGotValidated();
    expect(receipt.blockHash).toBeDefined();
  });

  test('wait for code got validated', async () => {
    expect(await codeValidatedPromise).toBeTruthy();
    await waitNBlocks(3);
  });
};

if (!config.skipUpload) {
  describe('upload code', uploadCodeTest);
} else {
  codeId = config.codeId;
}

describe('router', () => {
  test('check code state', async () => {
    expect(await router.codeState(codeId)).toBe(CodeState.Validated);
  });

  test('create program', async () => {
    const { id } = await router.createProgram(codeId);

    const mirror = getMirrorContract(id, wallet);

    const mirrorRouter = (await mirror.router()).toLowerCase();

    expect(mirrorRouter).toBe(config.routerId);
  });
});
