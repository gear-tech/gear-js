import { createRequire } from 'node:module';

import { ViemForkRequiredError } from '../errors/vara-eth-error.js';

const EXPECTED_NAME = '@vara-eth/viem';

let cachedResult: { ok: boolean; detail: string } | null = null;

function probe(): { ok: boolean; detail: string } {
  if (cachedResult) return cachedResult;

  try {
    // createRequire bound to this module's URL so we resolve `viem` against the
    // consumer's installed copy (not a bundled-in snapshot).
    const require = createRequire(import.meta.url);
    const pkg = require('viem/package.json') as { name?: string; version?: string };

    if (pkg.name === EXPECTED_NAME) {
      cachedResult = { ok: true, detail: `${pkg.name}@${pkg.version ?? 'unknown'}` };
    } else {
      cachedResult = {
        ok: false,
        detail: `installed viem is ${pkg.name ?? 'unknown'}@${pkg.version ?? 'unknown'}, expected ${EXPECTED_NAME}`,
      };
    }
  } catch (err) {
    // Probe failed — could be a non-Node runtime (browser bundle), an unusual
    // resolution setup, or a missing `viem/package.json` exports entry. We
    // optimistically allow code-upload paths to proceed; if the underlying viem
    // truly doesn't speak EIP-7594, the on-chain submit will surface the error.
    cachedResult = {
      ok: true,
      detail: `viem/package.json probe failed; allowing call to proceed. ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  return cachedResult;
}

/**
 * Asserts at runtime that the installed `viem` is the `@vara-eth/viem` fork
 * with EIP-7594 multi-blob support. Called at the entry of code-upload paths
 * (`RouterClient.requestCodeValidation`,
 * `RouterClient.requestCodeValidationOnBehalf`,
 * `RouterClient.prepareAndSignRequestCodeValidationPermitData`).
 *
 * Read-only contract calls (`MirrorClient.stateHash`, `RouterClient.validators`,
 * etc.) never call this, so consumers who don't upload code can use upstream
 * viem freely.
 *
 * The probe is memoised — package.json is read once per process.
 *
 * @throws {ViemForkRequiredError} when the installed viem is not the fork.
 */
export function assertViemFork(): void {
  const result = probe();
  if (!result.ok) {
    throw new ViemForkRequiredError(new Error(result.detail));
  }
}

/**
 * Test-only: reset the memoised probe result. Allows unit tests to exercise
 * both code paths.
 *
 * @internal
 */
export function _resetViemForkProbeCacheForTests(): void {
  cachedResult = null;
}
