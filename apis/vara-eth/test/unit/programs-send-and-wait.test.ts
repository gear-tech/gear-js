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

function makeMockEthClient() {
  return {
    publicClient: {} as never,
    signer: { getAddress: async () => '0xabc' as Address },
    getBlockNumber: async () => 100,
    getBlock: async () => ({ hash: `0x${'00'.repeat(32)}` }),
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
vi.mock('../../src/eth/contracts/mirror.contract.js', () => {
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

const mirrorMock = (await import(
  '../../src/eth/contracts/mirror.contract.js'
)) as typeof import('../../src/eth/contracts/mirror.contract.js') & {
  __setCallLog(log: CallLog): void;
};

describe('sendAndWaitForReply (Fix 1.1 + ethexe-alignment value reject)', () => {
  it('rejects non-zero value on via=injected before signing (ethexe-rpc relay rejects it server-side)', async () => {
    const log: CallLog = { sendCalled: false, setupReplyListenerCalledBeforeSend: false };
    mirrorMock.__setCallLog(log);

    const ethClient = makeMockEthClient();
    const createInjectedTransaction = vi.fn();

    await expect(
      sendAndWaitForReply(
        createInjectedTransaction as never,
        ethClient,
        `0x${'11'.repeat(20)}` as Address,
        '0xfeed' as Hex,
        { via: 'injected', value: 1n },
      ),
    ).rejects.toThrow(/value` must be 0 on the injected path/);

    expect(createInjectedTransaction).not.toHaveBeenCalled();
  });

  it('calls tx.send() before tx.setupReplyListener() on the via=eth path', async () => {
    const log: CallLog = { sendCalled: false, setupReplyListenerCalledBeforeSend: false };
    mirrorMock.__setCallLog(log);

    const ethClient = makeMockEthClient();
    // Dummy createInjectedTransaction — not exercised on `via: 'eth'`.
    const createInjectedTransaction = (() => {
      throw new Error('not reachable on via=eth');
    }) as never;

    const result = await sendAndWaitForReply(
      createInjectedTransaction,
      ethClient,
      `0x${'11'.repeat(20)}` as Address,
      '0xfeed' as Hex,
      { via: 'eth' },
    );

    expect(log.sendCalled).toBe(true);
    expect(log.setupReplyListenerCalledBeforeSend).toBe(false);
    expect(result.txHash).toBe('0xa1');
    expect(result.reply.payload).toBe('0xreply');
  });
});
