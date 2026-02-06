import { createPublicClient, createWalletClient, webSocket } from 'viem';
import type { Abi, Account, Chain, Hex, PublicClient, WalletClient, WebSocketTransport } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import * as fs from 'fs';
import path from 'path';

import { CodeState, EthereumClient, getMirrorClient, ISigner } from '../src';
import { config } from './config';
import { walletClientToSigner } from '../src/signer';

// const code = fs.readFileSync(path.join(config.targetDir, 'counter.opt.wasm'));
let codeId: `0x${string}`;
let publicClient: PublicClient<WebSocketTransport, Chain, undefined>;
let walletClient: WalletClient<WebSocketTransport, Chain, Account>;
let signer: ISigner;
let ethereumClient: EthereumClient;

// let codeValidatedPromise: Promise<boolean>;

beforeAll(async () => {
  const transport = webSocket(config.wsRpc);

  publicClient = createPublicClient({
    transport,
  }) as PublicClient<WebSocketTransport, Chain, undefined>;
  const account = privateKeyToAccount(config.privateKey);

  walletClient = createWalletClient({
    account,
    transport,
  });
  signer = walletClientToSigner(walletClient);
  ethereumClient = new EthereumClient(publicClient, config.routerId, signer);
  await ethereumClient.waitForInitialization();
  codeId = config.codeId;
});

afterAll(async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
});

describe('router', () => {
  describe('upload code', () => {
    // test.skip('should request code validation', async () => {
    //   const tx = await ethereumClient.router.requestCodeValidation(code);
    //   codeId = tx.codeId;
    //   const receipt = await tx.sendAndWaitForReceipt();
    //   expect(receipt.blockHash).toBeDefined();
    //   codeValidatedPromise = tx.waitForCodeGotValidated();
    // }, 60_000);

    // test.skip(
    //   'should wait when code got validated',
    //   async () => {
    //     expect(await codeValidatedPromise).toBeTruthy();
    //     await waitNBlocks(5);

    //     console.log(codeId);
    //   },
    //   config.longRunningTestTimeout,
    // );

    test('should check that code state is Validated', async () => {
      expect(await ethereumClient.router.codeState(codeId)).toBe(CodeState.Validated);
    });
  });

  describe('create program', () => {
    test('should create program', async () => {
      const tx = await ethereumClient.router.createProgram(codeId);

      await tx.send();

      const id = await tx.getProgramId();

      const mirror = getMirrorClient({ address: id, signer, publicClient });

      const mirrorRouter = (await mirror.router()).toLowerCase();

      expect(mirrorRouter).toBe(config.routerId);
    });

    test('should create program with abi interface', async () => {
      const {
        abi,
        bytecode: { object: bytecode },
      } = JSON.parse(fs.readFileSync(path.join(config.solOut, 'Counter.sol', 'CounterAbi.json'), 'utf-8')) as {
        abi: Abi;
        bytecode: { object: Hex };
      };

      const deployHash = await walletClient.deployContract({
        abi,
        bytecode,
      });

      const receipt = await ethereumClient.publicClient.waitForTransactionReceipt({ hash: deployHash });

      const contractAddr = receipt.contractAddress?.toLowerCase() as `0x${string}` | undefined;

      if (!contractAddr) {
        throw new Error('Counter ABI deployment failed');
      }

      expect(contractAddr).toBeDefined();

      const tx = await ethereumClient.router.createProgramWithAbiInterface(codeId, contractAddr);

      const createProgramReceipt = await tx.sendAndWaitForReceipt();

      expect(createProgramReceipt.blockHash).toBeDefined();
    });
  });

  describe('view functions', () => {
    test('should get genesisBlockHash', async () => {
      const blockhash = await ethereumClient.router.genesisBlockHash();
      expect(blockhash).toBeDefined();
      expect(typeof blockhash).toBe('string');
      expect(blockhash.startsWith('0x')).toBe(true);
    });

    test('should get genesisTimestamp', async () => {
      const timestamp = await ethereumClient.router.genesisTimestamp();
      expect(timestamp).toBeDefined();
      expect(typeof timestamp).toBe('number');
      expect(timestamp).toBeGreaterThan(0);
    });

    test('should get computeSettings', async () => {
      const settings = await ethereumClient.router.computeSettings();
      expect(settings).toBeDefined();
      expect(settings.threshold).toBeDefined();
      expect(settings.wvaraPerSecond).toBeDefined();
      expect(typeof settings.threshold).toBe('bigint');
      expect(typeof settings.wvaraPerSecond).toBe('bigint');
    });

    test('should get mirrorImpl address', async () => {
      const implAddr = await ethereumClient.router.mirrorImpl();
      expect(implAddr).toBeDefined();
      expect(typeof implAddr).toBe('string');
      expect(implAddr.startsWith('0x')).toBe(true);
    });

    test('should get programsCount', async () => {
      const count = await ethereumClient.router.programsCount();
      expect(count).toBeDefined();
      expect(typeof count).toBe('bigint');
      expect(count).toBeGreaterThanOrEqual(0n);
    });

    test('should get validatedCodesCount', async () => {
      const count = await ethereumClient.router.validatedCodesCount();
      expect(count).toBeDefined();
      expect(typeof count).toBe('bigint');
      expect(count).toBeGreaterThanOrEqual(0n);
    });

    test('should get validators list', async () => {
      const validators = await ethereumClient.router.validators();
      expect(validators).toBeDefined();
      expect(Array.isArray(validators)).toBe(true);
      expect(validators.length).toBeGreaterThan(0);
      validators.forEach((validator) => {
        expect(typeof validator).toBe('string');
        expect(validator.startsWith('0x')).toBe(true);
      });
    });

    test('should get validatorsCount', async () => {
      const count = await ethereumClient.router.validatorsCount();
      expect(count).toBeDefined();
      expect(typeof count).toBe('bigint');
      expect(count).toBeGreaterThan(0n);
    });

    test('should get validatorsThreshold', async () => {
      const threshold = await ethereumClient.router.validatorsThreshold();
      expect(threshold).toBeDefined();
      expect(typeof threshold).toBe('bigint');
      expect(threshold).toBeGreaterThan(0n);
    });

    test('should get signingThresholdPercentage', async () => {
      const fraction = await ethereumClient.router.signingThresholdFraction();
      expect(fraction).toBeDefined();
      expect(Array.isArray(fraction)).toBeTruthy();
      expect(fraction.length).toBe(2);
      expect(fraction[0]).toBeGreaterThan(0);
      expect(fraction[1]).toBeGreaterThan(0);
    });

    test('should get validatorsAggregatedPublicKey', async () => {
      const publicKey = await ethereumClient.router.validatorsAggregatedPublicKey();
      expect(publicKey).toBeDefined();
    });

    test('should get validatorsVerifiableSecretSharingCommitment', async () => {
      const commitment = await ethereumClient.router.validatorsVerifiableSecretSharingCommitment();
      expect(commitment).toBeDefined();
      expect(typeof commitment).toBe('string');
    });

    test('should get wrappedVara address', async () => {
      const varaAddr = await ethereumClient.router.wrappedVara();
      expect(varaAddr).toBeDefined();
      expect(typeof varaAddr).toBe('string');
      expect(varaAddr.startsWith('0x')).toBe(true);
    });

    test('should get latestCommittedBlockHash', async () => {
      const blockhash = await ethereumClient.router.latestCommittedBlockHash();
      expect(blockhash).toBeDefined();
      expect(typeof blockhash).toBe('string');
    });

    test('should get code state for validated code', async () => {
      const state = await ethereumClient.router.codeState(codeId);
      expect(state).toBeDefined();
      expect(state).toBe(CodeState.Validated);
    });

    test('should get states for multiple codes', async () => {
      const states = await ethereumClient.router.codesStates([codeId]);
      expect(states).toBeDefined();
      expect(Array.isArray(states)).toBe(true);
      expect(states.length).toBe(1);
      expect(states[0]).toBe(CodeState.Validated);
    });

    test('should check if addresses are validators', async () => {
      const validators = await ethereumClient.router.validators();
      const isValid = await ethereumClient.router.areValidators(validators as `0x${string}`[]);
      expect(isValid).toBeDefined();
      expect(typeof isValid).toBe('boolean');
    });

    test('should return false for non-validator addresses', async () => {
      const notValidator = '0x0000000000000000000000000000000000000001';
      const isValid = await ethereumClient.router.areValidators([notValidator as `0x${string}`]);
      expect(isValid).toBe(false);
    });

    test('should check if single address is validator', async () => {
      const validators = await ethereumClient.router.validators();
      const firstValidator = validators[0];
      const isValid = await ethereumClient.router.isValidator(firstValidator);
      expect(isValid).toBe(true);
    });

    test('should return false for non-validator address', async () => {
      const notValidator = '0x0000000000000000000000000000000000000001';
      const isValid = await ethereumClient.router.isValidator(notValidator);
      expect(isValid).toBe(false);
    });

    test('should get code id for created program', async () => {
      const tx = await ethereumClient.router.createProgram(codeId);
      await tx.send();
      const programId = await tx.getProgramId();

      const retrievedCodeId = await ethereumClient.router.programCodeId(programId);
      expect(retrievedCodeId).toBeDefined();
      expect(retrievedCodeId.toLowerCase()).toBe(codeId.toLowerCase());
    });

    test('should get code ids for multiple programs', async () => {
      const tx = await ethereumClient.router.createProgram(codeId);
      await tx.send();
      const programId = await tx.getProgramId();

      const codeIds = await ethereumClient.router.programsCodeIds([programId]);
      expect(codeIds).toBeDefined();
      expect(Array.isArray(codeIds)).toBe(true);
      expect(codeIds.length).toBe(1);
      expect(codeIds[0].toLowerCase()).toBe(codeId.toLowerCase());
    });
  });
});
