/**
 * Fence test for Fix 1.1 — `sendAndWait` must call `tx.send()` before
 * `tx.setupReplyListener()`. Without `send()`, `setupReplyListener` triggers
 * `getReceipt()` which throws `No transaction hash available. Call send() first.`.
 *
 * Strategy: stub `MirrorClient.sendMessage` to return a fake TxManager that
 * records the call order. We never touch the real chain or signer.
 */

import type { Address, Hex } from 'viem';

import { sendAndWaitForReply } from '../../src/api/programs/send-and-wait.js';

interface CallLog {
  sendCalled: boolean;
  setupReplyListenerCalledBeforeSend: boolean;
}

function makeMockEthClient(log: CallLog) {
  return {
    publicClient: {} as never,
    signer: { getAddress: async () => '0xabc' as Address },
    getBlockNumber: async () => 100,
    getBlock: async () => ({ hash: '0x' + '00'.repeat(32) }),
    router: { address: '0xrouter' as Address },
  } as never;
}

function makeFakeTx(log: CallLog) {
  return {
    async send() {
      log.sendCalled = true;
    },
    async setupReplyListener() {
      log.setupReplyListenerCalledBeforeSend = log.setupReplyListenerCalledBeforeSend || !log.sendCalled;
      if (!log.sendCalled) {
        // Mirror the real error tx-manager.ts:126 emits.
        throw new Error('No transaction hash available. Call send() first.');
      }
      return {
        txHash: '0xa1' as Hex,
        message: { id: '0xc0' as Hex, source: '0x00' as Address, payload: '0x' as Hex, value: 0n, callReply: false },
        waitForReply: async () => ({
          payload: '0xreply' as Hex,
          value: 0n,
          replyCode: '0x00000000' as Hex,
          blockNumber: 1,
          txHash: '0xa1' as Hex,
        }),
      };
    },
  };
}

// Patch the `getMirrorClient` re-export by mocking the contracts module entry.
jest.mock('../../src/eth/contracts/mirror.contract.js', () => {
  let captured: { log: CallLog } | null = null;
  return {
    __setCallLog(log: CallLog) {
      captured = { log };
    },
    getMirrorClient: () => ({
      async sendMessage(_payload: Hex, _value?: bigint) {
        if (!captured) throw new Error('test setup: call __setCallLog first');
        return makeFakeTx(captured.log);
      },
    }),
    MirrorClient: class {},
  };
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mirrorMock = require('../../src/eth/contracts/mirror.contract.js');

describe('sendAndWaitForReply (Fix 1.1)', () => {
  it('calls tx.send() before tx.setupReplyListener() on the via=eth path', async () => {
    const log: CallLog = { sendCalled: false, setupReplyListenerCalledBeforeSend: false };
    mirrorMock.__setCallLog(log);

    const ethClient = makeMockEthClient(log);
    // Dummy createInjectedTransaction — not exercised on `via: 'eth'`.
    const createInjectedTransaction = (() => {
      throw new Error('not reachable on via=eth');
    }) as never;

    const result = await sendAndWaitForReply(
      createInjectedTransaction,
      ethClient,
      '0x' + '11'.repeat(20) as Address,
      '0xfeed' as Hex,
      { via: 'eth' },
    );

    expect(log.sendCalled).toBe(true);
    expect(log.setupReplyListenerCalledBeforeSend).toBe(false);
    expect(result.txHash).toBe('0xa1');
    expect(result.reply.payload).toBe('0xreply');
  });
});
