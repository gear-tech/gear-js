/**
 * Fence test for Fix 2.3 — `InjectedTx.setReferenceBlock(supplied)` must throw
 * {@link InjectedTxStaleError} when the supplied block is outside the 32-block
 * validity window. Without the pre-check, validator rejection surfaces as an
 * opaque RPC error far from the call site.
 */

import type { Hex } from 'viem';

import { InjectedTx } from '../../src/api/injected/tx.js';
import { InjectedTxStaleError, VaraEthErrorCode } from '../../src/errors/vara-eth-error.js';

const STALE_HASH = `0x${'aa'.repeat(32)}` as Hex;
const FRESH_HASH = `0x${'bb'.repeat(32)}` as Hex;
const HEAD_HASH = `0x${'cc'.repeat(32)}` as Hex;

function makeMockEthClient(blockNumberByHash: Map<Hex, bigint>, headNumber: number) {
  return {
    publicClient: {
      async getBlock({ blockHash }: { blockHash: Hex }) {
        const number = blockNumberByHash.get(blockHash);
        if (number === undefined) throw new Error(`mock: unknown block ${blockHash}`);
        return { hash: blockHash, number };
      },
    },
    async getBlockNumber() {
      return headNumber;
    },
    async getBlock(n: number) {
      return { hash: HEAD_HASH, number: BigInt(n) };
    },
  } as never;
}

function makeTx(ethClient: never): InjectedTx {
  // Provider is unused on the path under test; cast through never.
  return new InjectedTx({} as never, ethClient, {
    destination: `0x${'11'.repeat(20)}` as `0x${string}`,
    payload: '0xdead' as `0x${string}`,
    value: 0n,
    salt: `0x${'00'.repeat(32)}` as `0x${string}`,
  } as never);
}

describe('InjectedTx.setReferenceBlock staleness pre-check (Fix 2.3)', () => {
  it('throws InjectedTxStaleError when the supplied block is >32 blocks behind head', async () => {
    const blocks = new Map<Hex, bigint>([[STALE_HASH, 100n]]);
    const ethClient = makeMockEthClient(blocks, 200);
    const tx = makeTx(ethClient);

    await expect(tx.setReferenceBlock(STALE_HASH)).rejects.toBeInstanceOf(InjectedTxStaleError);

    try {
      await tx.setReferenceBlock(STALE_HASH);
      fail('expected throw');
    } catch (err) {
      const e = err as InjectedTxStaleError;
      expect(e.code).toBe(VaraEthErrorCode.InjectedTxStale);
      expect(e.message).toContain(STALE_HASH);
    }
  });

  it('accepts a supplied block within the 32-block validity window', async () => {
    const blocks = new Map<Hex, bigint>([[FRESH_HASH, 95n]]);
    const ethClient = makeMockEthClient(blocks, 100);
    const tx = makeTx(ethClient);
    await expect(tx.setReferenceBlock(FRESH_HASH)).resolves.toBeUndefined();
  });

  it('falls through silently on transient RPC failure (does not block signing)', async () => {
    const ethClient = {
      publicClient: {
        async getBlock() {
          throw new Error('ECONNRESET');
        },
      },
      async getBlockNumber() {
        throw new Error('ECONNRESET');
      },
      async getBlock(_n: number) {
        return { hash: HEAD_HASH };
      },
    } as never;
    const tx = makeTx(ethClient);
    await expect(tx.setReferenceBlock(STALE_HASH)).resolves.toBeUndefined();
  });
});
