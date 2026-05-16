/**
 * Fence test for Fix 2.1 — `deployProgram` must throw
 * {@link CodeValidationTimeoutError} (not hang forever) when
 * `waitForCodeGotValidated` never fires within `codeValidationTimeoutMs`.
 *
 * Strategy: exercise the timeout helper directly. The helper races the
 * `CodeGotValidated` promise against a setTimeout — the easiest test surface
 * is the racing primitive itself, not the full deploy ceremony.
 */

import type { Hex } from 'viem';

import { _waitForCodeValidationWithTimeoutForTests } from '../../src/api/programs/deploy.js';
import { CodeValidationTimeoutError, VaraEthErrorCode } from '../../src/errors/vara-eth-error.js';

const CODE_ID = ('0x' + 'ab'.repeat(32)) as Hex;
const TX_HASH = ('0x' + 'cd'.repeat(32)) as Hex;

describe('waitForCodeValidationWithTimeout (Fix 2.1)', () => {
  it('throws CodeValidationTimeoutError carrying codeId + txHash on timeout', async () => {
    const neverResolves = new Promise<boolean>(() => {});

    await expect(
      _waitForCodeValidationWithTimeoutForTests(neverResolves, 25, CODE_ID, TX_HASH),
    ).rejects.toThrow(CodeValidationTimeoutError);

    try {
      await _waitForCodeValidationWithTimeoutForTests(neverResolves, 25, CODE_ID, TX_HASH);
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
    const fast = Promise.resolve(true);
    await expect(
      _waitForCodeValidationWithTimeoutForTests(fast, 5000, CODE_ID, TX_HASH),
    ).resolves.toBeUndefined();
  });

  it('does not leave a dangling timer after a successful resolve', async () => {
    // Spy on clearTimeout to make sure the helper releases the timer on the
    // success path. If `clearTimeout` is never called, Jest's open-handle
    // detector would flag the timer.
    const clearSpy = jest.spyOn(global, 'clearTimeout');
    try {
      await _waitForCodeValidationWithTimeoutForTests(Promise.resolve(true), 5000, CODE_ID, TX_HASH);
      expect(clearSpy).toHaveBeenCalled();
    } finally {
      clearSpy.mockRestore();
    }
  });
});
