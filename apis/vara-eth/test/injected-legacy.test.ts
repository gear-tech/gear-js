/**
 * Integration tests for the legacy injected transaction RPC format.
 *
 * Run these against a node that does NOT implement the `version` RPC method so that
 * `createVaraEthApi` falls back to the legacy `{ recipient, tx }` payload shape and
 * `sendAndWaitForPromise` resolves to an `InjectedTxPromise`.
 *
 * Required environment variables:
 *   LEGACY_WS_RPC        – WebSocket RPC URL of the legacy Vara.Eth node
 *   LEGACY_ROUTER_ADDRESS – Router contract address on the Ethereum side
 *   LEGACY_CODE_ID       – Validated code ID to use for program deployment
 *
 * Optional:
 *   WS_RPC  – Ethereum WebSocket RPC (defaults to ws://127.0.0.1:8545)
 */

import fs from 'node:fs';
import { SailsProgram } from 'sails-js';
import { SailsIdlParser } from 'sails-js/parser';
import type { Hash, PublicClient, WalletClient } from 'viem';
import { createPublicClient, createWalletClient, webSocket, zeroAddress } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import {
  createVaraEthApi,
  getMirrorClient,
  type InjectedTx,
  InjectedTxPromise,
  type VaraEthApi,
  WsVaraEthProvider,
} from '../src';
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

describe.skip('Legacy Injected Transactions', () => {
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
      'should wait for programId to appear on Vara.Eth',
      async () => {
        let found = false;
        while (!found) {
          const ids = await api.query.program.getIds();
          found = ids.includes(programId);
        }
        const ids = await api.query.program.getIds();
        expect(ids).toContain(programId);
      },
      config.longRunningTestTimeout,
    );

    test('should approve wvara', async () => {
      const tx = await api.eth.wvara.approve(programId, BigInt(10 * 1e12));
      await tx.send();
      const approvalData = await tx.getApprovalLog();
      hasProps(approvalData, ['owner', 'spender', 'value']);
      expect(approvalData.value).toEqual(BigInt(10 * 1e12));
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

  // ── Legacy transaction behaviour ──────────────────────────────────────────

  describe('transactions', () => {
    let testTx: InjectedTx;
    let promise: InjectedTxPromise;

    test('should have null recipient by default', async () => {
      testTx = await api.createInjectedTransaction({
        destination: programId,
        payload: '0x',
      });

      expect(testTx.recipient).toBeNull();
    });

    test('should set a specific recipient address via setRecipient', async () => {
      const address = '0x70997970c51812dc3a010c7d01b50e0d17dc79c8';
      const recipient = await testTx.setRecipient(address);

      expect(recipient).toBe(address);
      expect(testTx.recipient).toBe(address);
    });

    test('should set the slot validator via setRecipient with no args', async () => {
      const recipient = await testTx.setRecipient();

      expect(recipient).not.toBe(zeroAddress);
      expect(recipient).toMatch(/^0x[0-9a-fA-F]{40}$/);
      expect(testTx.recipient).toBe(recipient);
    });

    test('should set the zero address via setDefaultValidator', () => {
      const recipient = testTx.setDefaultValidator();

      expect(recipient).toBe(zeroAddress);
      expect(testTx.recipient).toBe(zeroAddress);
    });

    test('should send an increment message and auto-assign recipient', async () => {
      const payload = counterProgram.services.Counter.functions.Increment.encodePayload();
      const tx = await api.createInjectedTransaction({ destination: programId, payload });

      expect(tx.recipient).toBeNull();

      const result = await tx.send();

      expect(tx.recipient).not.toBeNull();
      expect(result).toBe('Accept');
    });

    test(
      'should send a message and receive an InjectedTxPromise',
      async () => {
        const payload = counterProgram.services.Counter.functions.Decrement.encodePayload();
        const tx = await api.createInjectedTransaction({ destination: programId, payload });

        expect(tx.recipient).toBeNull();

        const result = await tx.sendAndWaitForPromise();

        expect(result).toBeInstanceOf(InjectedTxPromise);

        const p = result as InjectedTxPromise;
        expect(p.txHash).toBeDefined();
        expect(p.code.isSuccess).toBeTruthy();
        expect(Array.from(p.code.toBytes())).toEqual([0, 1, 0, 0]);
        expect(p.value).toBe(0n);
        expect(p.signature).toBeDefined();
        expect(counterProgram.services.Counter.functions.Decrement.decodeResult(p.payload)).toEqual(0);

        promise = p;
      },
      config.longRunningTestTimeout,
    );

    test('should validate promise signature', async () => {
      expect(promise).toBeDefined();
      await expect(promise.validateSignature()).resolves.not.toThrow();
    });

    test('should return validatorAddress after validateSignature', async () => {
      expect(promise.validatorAddress).toMatch(/^0x[0-9a-f]{40}$/);
    });

    test('should send tx with invalid signature and reject', async () => {
      const tx = await api.createInjectedTransaction({
        destination: zeroAddress,
        payload: '0x',
      });

      await tx.sign();
      tx.setSalt('0x00');

      await expect(tx.sendAndWaitForPromise()).rejects.toThrow('RpcError(-32602): Invalid params :: Address mismatch');
    });

    test(
      'should reject when waiting for blocks after reference block expires',
      async () => {
        // Wait for blocks to pass so a manually-set old reference block becomes outdated.
        await waitNBlocks(2);
      },
      config.longRunningTestTimeout,
    );
  });
});
