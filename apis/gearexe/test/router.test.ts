import { ethers } from 'ethers';
import * as fs from 'fs';
import { CodeState, getMirrorContract, getRouterContract, uploadContract } from '../src';
import { config } from './config';
import { ethWsProvider, waitNBlocks } from './common';
import path from 'path';

const code = fs.readFileSync(path.join(config.targetDir, 'counter.opt.wasm'));
let codeId: string;
let wallet: ethers.Wallet;
let router: ReturnType<typeof getRouterContract>;

let codeValidatedPromise: Promise<boolean>;

beforeAll(async () => {
  wallet = new ethers.Wallet(config.privateKey, ethWsProvider());
  router = getRouterContract(config.routerId, wallet);
});

afterAll(async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  wallet.provider!.destroy();
});

describe('router', () => {
  describe('base', () => {
    test('should get genesisBlockHash', async () => {
      const blockhash = await router.genesisBlockHash();
      expect(blockhash).toBeDefined();
    });
  });

  describe('upload code', () => {
    test('should request code validation', async () => {
      const tx = await router.requestCodeValidation(code);
      codeId = tx.codeId;
      const receipt = await tx.sendAndWaitForReceipt();
      expect(receipt.blockHash).toBeDefined();
      codeValidatedPromise = tx.waitForCodeGotValidated();
    }, 60_000);

    test('should wait when code got validated', async () => {
      expect(await codeValidatedPromise).toBeTruthy();
      await waitNBlocks(5);

      console.log(codeId);
    }, 30_000);

    test('should check that code state is Validated', async () => {
      expect(await router.codeState(codeId)).toBe(CodeState.Validated);
    });
  });

  describe('create program', () => {
    test('should create program', async () => {
      const tx = await router.createProgram(codeId);

      await tx.send();

      const id = await tx.getProgramId();

      const mirror = getMirrorContract(id, wallet);

      const mirrorRouter = (await mirror.router()).toLowerCase();

      expect(mirrorRouter).toBe(config.routerId);
    });

    test('should create program with abi interface', async () => {
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
});
