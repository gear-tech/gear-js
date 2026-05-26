import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { SailsProgram } from 'sails-js';
import { SailsIdlParser } from 'sails-js/parser';
import type { Hash, PublicClient, WalletClient } from 'viem';
import { createPublicClient, createWalletClient, recoverMessageAddress, webSocket, zeroAddress } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import {
  createVaraEthApi,
  getMirrorClient,
  type IInjectedTransaction,
  InjectedTx,
  InjectedTxPromise,
  type VaraEthApi,
  WsVaraEthProvider,
} from '../src';
import type { InjectedTransactionPromiseRaw } from '../src/api/injected/promise';
import { walletClientToSigner } from '../src/signer/index.js';
import { hasProps, waitNBlocks } from './common';
import { config } from './config';

let api: VaraEthApi;
let publicClient: PublicClient;
let walletClient: WalletClient;
let signer: ReturnType<typeof walletClientToSigner>;

let mirror: ReturnType<typeof getMirrorClient>;

let programId: Hash;
let sailsParser: SailsIdlParser;
let counterProgram: SailsProgram;

const injectedTxs: {
  id: Hash;
  referenceBlock: Hash;
  payload: string;
  destination: Hash;
  value: number;
  salt: string;
}[] = [];

beforeAll(async () => {
  sailsParser = new SailsIdlParser();
  await sailsParser.init();
  const idl = fs.readFileSync('./programs/counter-idl/counter_idl.idl', 'utf-8');
  counterProgram = new SailsProgram(sailsParser.parse(idl));

  const account = privateKeyToAccount(config.privateKey);

  const transport = webSocket(config.wsRpc);
  publicClient = createPublicClient({ transport });

  walletClient = createWalletClient({ account, transport });
  signer = walletClientToSigner(walletClient);

  api = await createVaraEthApi(new WsVaraEthProvider(), publicClient, config.routerId, signer);
});

afterAll(async () => {
  await api.provider.disconnect();
});

describe('Injected Transactions', () => {
  describe('signature', () => {
    let injectedTxHash: string;
    let injectedTxSignature: string;
    let injectedMessageId: string;
    let injectedPromiseHash: string;
    let injectedPromiseSignature: string;
    let injectedPromiseReplyInfoHash: string;

    const INJECTED_TEST_PROGRAM_MANIFEST_PATH = 'programs/injected/Cargo.toml';

    const TX: IInjectedTransaction = {
      recipient: '0x0000000000000000000000000000000000000000',
      destination: '0x0000000000000000000000000000000000000000',
      payload: '0x000102',
      value: 256n,
      referenceBlock: '0x0000000000000000000000000000000000000000000000000000000000000000',
      salt: '0x030405',
    };

    const PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

    const PROMISE: InjectedTransactionPromiseRaw = {
      data: {
        txHash: '0x8e1dda533d36d8374621199611afdddb892b6c8fc9ae84e0db73b394d6322059',
        reply: {
          payload: '0x000102',
          value: 256,
          code: '0x00010000',
        },
      },
      signature:
        '0x6239210962901c5f3695f6d17fda5f59e39d53f91fc4346d269762aedcf00c7532cf824d73e08e5ea97df63b4bac8232a1a6978442dea95a40558d00356b35001c',
    };

    const HASH_REGEXP = '<(0x[0-9a-f]{64})>';
    const HEX_REGEXP = '<(0x[0-9a-f]*)>';

    const getAndValidateValueByRegexp = (str: string, regexp: string) => {
      const value = str.match(regexp)?.[1];

      if (!value) {
        throw new Error(`Failed to get value by regexp ${regexp}`);
      }

      return value;
    };

    beforeAll(() => {
      const result = execSync(`cargo run --manifest-path ${INJECTED_TEST_PROGRAM_MANIFEST_PATH}`, {
        stdio: 'pipe',
      });

      const resultStr = result.toString();

      const hash = getAndValidateValueByRegexp(resultStr, `hash: ${HASH_REGEXP}`);
      const signature = getAndValidateValueByRegexp(resultStr, `signature: ${HEX_REGEXP}`);
      const messageId = getAndValidateValueByRegexp(resultStr, `message_id: ${HASH_REGEXP}`);
      const promiseHash = getAndValidateValueByRegexp(resultStr, `promise_hash: ${HASH_REGEXP}`);
      const promiseSig = getAndValidateValueByRegexp(resultStr, `promise_signature: ${HEX_REGEXP}`);
      const promiseReplyInfoHash = getAndValidateValueByRegexp(resultStr, `reply_hash: ${HASH_REGEXP}`);

      injectedTxHash = hash;
      injectedTxSignature = signature;
      injectedMessageId = messageId;

      injectedPromiseHash = promiseHash;
      injectedPromiseSignature = promiseSig;
      injectedPromiseReplyInfoHash = promiseReplyInfoHash;
    }, 5 * 60_000);

    test('should create a correct hash', () => {
      const injected = new InjectedTx(api.provider, api.eth, TX);
      expect(injected.hash).toBe(injectedTxHash);
    });

    test('should create a correct message id', () => {
      const injected = new InjectedTx(api.provider, api.eth, TX);
      expect(injected.messageId).toBe(injectedMessageId);
    });

    test('should create a correct signature', async () => {
      const account = privateKeyToAccount(PRIVATE_KEY);

      const injected = new InjectedTx(api.provider, api.eth, TX);

      const signature = await account.sign({ hash: injected.hash });

      expect(signature).toBe(injectedTxSignature);
    });

    test('should create a correct promise hash', () => {
      const promise = new InjectedTxPromise(PROMISE, api.eth);

      expect(promise.hash).toBe(injectedPromiseHash);
    });

    test('should create a correct reply hash', () => {
      const promise = new InjectedTxPromise(PROMISE, api.eth);
      expect(promise.replyHash).toBe(injectedPromiseReplyInfoHash);
    });

    test('should create correct promise signature', async () => {
      const promise = new InjectedTxPromise(PROMISE, api.eth);

      const account = privateKeyToAccount(PRIVATE_KEY);

      const signature = await account.signMessage({ message: { raw: promise.hash } });

      expect(signature).toBe(injectedPromiseSignature);
    });

    test('should correctly recover account from signature', async () => {
      const promise = new InjectedTxPromise(PROMISE, api.eth);
      const account = privateKeyToAccount(PRIVATE_KEY);

      const address = await recoverMessageAddress({ message: { raw: promise.hash }, signature: PROMISE.signature });

      expect(address).toBe(account.address);
    });
  });

  describe('setup', () => {
    test('should create program', async () => {
      const tx = api.eth.router.createProgramBuilder(config.codeId).build();
      await tx.sendAndWaitForReceipt();

      programId = await tx.getProgramId();
      console.log(`Program id: ${programId}`);

      expect(programId).toBeDefined();

      mirror = getMirrorClient({ address: programId, signer, publicClient });
    });

    test(
      'should wait for programId appeared on Vara.Eth',
      async () => {
        let id = null;
        while (id === null) {
          const ids = await api.query.program.getIds();
          if (ids.includes(programId)) {
            id = programId;
          }
        }

        const ids = await api.query.program.getIds();
        if (!ids.includes(programId)) {
          process.exit(1);
        }
        expect(ids).toContain(programId);
      },
      config.blockTime * 20_000,
    );

    test('should approve wvara', async () => {
      const tx = await api.eth.wvara.approve(programId, BigInt(10 * 1e12));

      await tx.send();

      const approvalData = await tx.getApprovalLog();

      hasProps(approvalData, ['owner', 'spender', 'value']);

      expect(approvalData.value).toEqual(BigInt(10 * 1e12));

      const allowance = await api.eth.wvara.allowance(await api.eth.signer.getAddress(), programId);
      expect(allowance).toEqual(BigInt(10 * 1e12));
    });

    test('should check that program is active', async () => {
      const hash = await mirror.stateHash();

      const state = await api.query.program.readState(hash);

      expect('Active' in state.program).toBeTruthy();
    });

    test('should top up executable balance', async () => {
      const tx = await mirror.executableBalanceTopUp(BigInt(10 * 1e12));

      const { status } = await tx.sendAndWaitForReceipt();

      expect(status).toBe('success');
    });

    test(
      'should send init message',
      async () => {
        if (!counterProgram.ctors) throw new Error('No ctors');
        const payload = counterProgram.ctors.CreatePrg.encodePayload();

        const tx = await mirror.sendMessage(payload);

        await tx.send();

        const message = await tx.getMessage();

        hasProps(message, ['id', 'source', 'payload', 'value', 'callReply']);

        const { waitForReply } = await tx.setupReplyListener();

        await waitForReply();
      },
      config.longRunningTestTimeout,
    );
  });

  describe('transactions', () => {
    let unwatch: () => void;

    let currentStateHash: Hash;
    let newStateHash: Hash;

    let messageId: Hash;

    let testTx: InjectedTx;

    let promise: InjectedTxPromise;

    test('should set recipient to null by default', async () => {
      testTx = await api.createInjectedTransaction({
        destination: programId,
        payload: '0x',
      });

      expect(testTx.recipient).toBeNull();
    });

    test('should set specific recipient address using setRecipient', async () => {
      const recipient = await testTx.setRecipient('0x70997970c51812dc3a010c7d01b50e0d17dc79c8');

      expect(recipient).toBe('0x70997970c51812dc3a010c7d01b50e0d17dc79c8');
      expect(testTx.recipient).toBe('0x70997970c51812dc3a010c7d01b50e0d17dc79c8');
    });

    test('should set slot validator using setRecipient without args', async () => {
      const recipient = await testTx.setRecipient();

      expect(recipient).not.toBe(zeroAddress);
      expect(recipient).toMatch(/^0x[0-9a-fA-F]{40}$/);
      expect(testTx.recipient).toBe(recipient);
    });

    test('should set zero address using setDefaultValidator', () => {
      const recipient = testTx.setDefaultValidator();

      expect(recipient).toBe(zeroAddress);
      expect(testTx.recipient).toBe(zeroAddress);
    });

    test('should read current state hash', async () => {
      currentStateHash = await mirror.stateHash();
    });

    test('should subscribe to StateChanged event', async () => {
      unwatch = mirror.watchStateChangedEvent((stateHash) => {
        newStateHash = stateHash;
      });
    });

    test('should send increment message', async () => {
      const payload = counterProgram.services.Counter.functions.Increment.encodePayload();

      const injected: IInjectedTransaction = {
        destination: programId,
        payload,
      };
      const tx = await api.createInjectedTransaction(injected);

      expect(tx.recipient).toBeNull();

      const result = await tx.send();

      expect(tx.recipient).not.toBeNull();

      messageId = tx.messageId;
      injectedTxs.push({
        id: tx.messageId,
        referenceBlock: tx.referenceBlock!,
        payload,
        destination: programId,
        value: 0,
        salt: tx.salt,
      });

      expect(result).toBe('Accept');
    });

    test(
      'should wait for reply on Etherum',
      async () => {
        const reply = await mirror.waitForReply(messageId);

        expect(reply).toHaveProperty('value', 0n);
        expect(reply).toHaveProperty('replyCode', '0x00010000');
        expect(reply).toHaveProperty('blockNumber');
        expect(reply).toHaveProperty('txHash');
        expect(counterProgram.services.Counter.functions.Increment.decodeResult(reply.payload)).toEqual(1);
      },
      config.longRunningTestTimeout,
    );

    test('should wait for a new state hash', async () => {
      while (!newStateHash) {
        await waitNBlocks(1);
      }

      expect(newStateHash).toBeDefined();
      expect(newStateHash).not.toEqual(currentStateHash);
    });

    test('should unsubscribe from StateChanged event', () => {
      unwatch();
    });

    test('should send a message and wait for the promise', async () => {
      const payload = counterProgram.services.Counter.functions.Decrement.encodePayload();

      const injected: IInjectedTransaction = {
        destination: programId,
        payload,
      };

      const tx = await api.createInjectedTransaction(injected);

      expect(tx.recipient).toBeNull();

      injectedTxs.push({
        id: tx.messageId,
        referenceBlock: tx.referenceBlock!,
        payload,
        destination: programId,
        value: 0,
        salt: tx.salt,
      });

      const result = await tx.sendAndWaitForPromise();

      expect(result.txHash).toBeDefined();
      expect(result.code.isSuccess).toBeTruthy();
      expect(Array.from(result.code.toBytes())).toEqual([0, 1, 0, 0]);
      expect(result.value).toBe(0n);
      expect(result.signature).toBeDefined();
      expect(counterProgram.services.Counter.functions.Decrement.decodeResult(result.payload)).toEqual(0);

      promise = result;
    });

    test('should validate promise signature', async () => {
      expect(promise).toBeDefined();

      await expect(promise.validateSignature()).resolves.not.toThrow();
    });

    test('should send tx with invalid signature', async () => {
      const payload = '0x';
      const injected: IInjectedTransaction = {
        destination: zeroAddress,
        payload,
      };

      const tx = await api.createInjectedTransaction(injected);

      await tx.sign();

      tx.setSalt('0x00');

      await expect(tx.sendAndWaitForPromise()).rejects.toThrow(
        'RpcError(-32602): Invalid params :: Address mismatch at line 1 column 461',
      );
    });

    test.skip('should send transaction with non-zero value and reject', async () => {
      const payload = '0x';
      const injected: IInjectedTransaction = {
        destination: programId,
        payload,
        value: 10n,
      };

      const tx = await api.createInjectedTransaction(injected);

      await tx.sign();

      await expect(tx.sendAndWaitForPromise()).rejects.toThrow(
        'RpcError(-32602): Invalid params :: Injected transactions with non-zero value are not supported',
      );
    });
  });

  describe('queries', () => {
    const assertTx = (
      tx: Awaited<ReturnType<typeof api.query.injected.getTransaction>>,
      itx: (typeof injectedTxs)[0],
    ) => {
      expect(tx).toHaveProperty('data');
      expect(tx).toHaveProperty('signature');
      expect(tx).toHaveProperty('address');
      expect(tx.data).toHaveProperty('destination', itx.destination);
      expect(tx.data).toHaveProperty('payload', itx.payload);
      expect(tx.data).toHaveProperty('value', itx.value);
      expect(tx.data).toHaveProperty('referenceBlock', itx.referenceBlock);
      expect(tx.data).toHaveProperty('salt', itx.salt);
    };

    test('should get injected transaction by id', async () => {
      expect(injectedTxs).toHaveLength(2);
      const itx = injectedTxs[0];
      const tx = await api.query.injected.getTransaction(itx.id);

      assertTx(tx, itx);
    });

    test('should request non-existing transaction and throw not found error', async () => {
      const nonExistingId = `0x${'00'.repeat(32)}` as Hash;

      await expect(api.query.injected.getTransaction(nonExistingId)).rejects.toThrow(
        `Transaction with id ${nonExistingId} not found`,
      );
    });

    test('should request multiple transactions by ids', async () => {
      expect(injectedTxs).toHaveLength(2);

      const txs = await api.query.injected.getTransactions(injectedTxs.map((i) => i.id));

      expect(txs).toHaveLength(2);
      txs.forEach((tx, i) => {
        assertTx(tx!, injectedTxs[i]);
      });
    });

    test('should request multiple transaction with some non-existing ids and get null for them', async () => {
      const nonExistingId = `0x${'00'.repeat(32)}` as Hash;

      expect(injectedTxs).toHaveLength(2);

      const txs = await api.query.injected.getTransactions([injectedTxs[0].id, nonExistingId, injectedTxs[1].id]);

      expect(txs).toHaveLength(3);
      expect(txs[0]).not.toBeNull();
      expect(txs[1]).toBeNull();
      expect(txs[2]).not.toBeNull();
    });

    test('should request more than 100 transactions and get error', async () => {
      const ids = Array.from({ length: 101 }, (_, i) => `0x${i.toString(16).padStart(64, '0')}` as Hash);

      await expect(api.query.injected.getTransactions(ids)).rejects.toThrow(
        'RpcError(-32602): Invalid params :: Too many transaction ids requested. Maximum is 100.',
      );
    });
  });
});
