/**
 * Fence test for Fix 2.1 — `deployProgram` must throw
 * {@link CodeValidationTimeoutError} (not hang forever) when
 * `waitForCodeGotValidated` never fires within `codeValidationTimeoutMs`.
 *
 * Strategy: exercise the shared `withTimeout` primitive with the same error
 * factory `deployProgram` uses. Mirrors the production call shape without
 * spinning up the full deploy ceremony.
 */

import type { Hex } from 'viem';

import { CodeValidationTimeoutError, VaraEthErrorCode } from '../../src/errors/vara-eth-error.js';
import { withTimeout } from '../../src/util/promise.js';

const CODE_ID = `0x${'ab'.repeat(32)}` as Hex;
const TX_HASH = `0x${'cd'.repeat(32)}` as Hex;

const makeCodeValidationError = (timeoutMs: number) => new CodeValidationTimeoutError(CODE_ID, TX_HASH, timeoutMs);

describe('withTimeout wired with CodeValidationTimeoutError (Fix 2.1)', () => {
  it('throws CodeValidationTimeoutError carrying codeId + txHash on timeout', async () => {
    const neverResolves = new Promise<boolean>(() => {});

    await expect(withTimeout(neverResolves, 25, () => makeCodeValidationError(25))).rejects.toThrow(
      CodeValidationTimeoutError,
    );

    try {
      await withTimeout(neverResolves, 25, () => makeCodeValidationError(25));
      fail('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(CodeValidationTimeoutError);
      const e = err as CodeValidationTimeoutError;
      expect(e.code).toBe(VaraEthErrorCode.CodeValidationTimeout);
      expect(e.codeId).toBe(CODE_ID);
      expect(e.txHash).toBe(TX_HASH);
      expect(e.timeoutMs).toBe(25);
    }
  });

  it('resolves normally when the waiter beats the timeout', async () => {
    await expect(withTimeout(Promise.resolve(true), 5000, () => makeCodeValidationError(5000))).resolves.toBe(true);
  });

  it('does not leave a dangling timer after a successful resolve', async () => {
    // Spy on clearTimeout to make sure the helper releases the timer on the
    // success path. If `clearTimeout` is never called, Jest's open-handle
    // detector would flag the timer.
    const clearSpy = vi.spyOn(global, 'clearTimeout');
    try {
      await withTimeout(Promise.resolve(true), 5000, () => makeCodeValidationError(5000));
      expect(clearSpy).toHaveBeenCalled();
    } finally {
      clearSpy.mockRestore();
    }
  });
});
