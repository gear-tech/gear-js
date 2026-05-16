import { ViemForkRequiredError } from '../errors/vara-eth-error.js';

const EXPECTED_NAME = '@vara-eth/viem';

// Detected once at module load. Avoids a static `import 'node:module'` that
// browser bundlers can't resolve — the import alone (independent of whether
// `probe()` is ever called) is enough to break dApp bundles that pull the
// root `@vara-eth/api` export.
const IS_NODE = typeof process !== 'undefined' && !!process.versions?.node;

let cachedResult: { ok: boolean; detail: string } | null = null;

function probe(): { ok: boolean; detail: string } {
  if (cachedResult) return cachedResult;

  if (!IS_NODE) {
    // Browser / non-Node runtime. The code-upload path that this gate fronts
    // (`requestCodeValidation*`) needs EIP-7594 sidecar support — if the
    // installed viem doesn't have it the on-chain submit will surface the
    // failure. We don't fail-fast in dApps; their build pipeline is
    // responsible for picking the right viem.
    cachedResult = { ok: true, detail: 'non-node runtime — probe skipped' };
    return cachedResult;
  }

  try {
    // `Function('return require')` returns the global CJS `require` without
    // a top-level `import 'node:module'`. The indirect call form keeps the
    // expression opaque to static analysers, so bundlers don't try to
    // resolve `node:module` at bundle time.
    const globalRequire = Function(
      'return typeof require !== "undefined" ? require : null',
    )() as NodeRequire | null;

    if (!globalRequire) {
      // ESM Node without a captured `require`. Without `createRequire` we
      // can't synchronously inspect `viem/package.json`; treat as
      // unprobeable and allow. The Rust verifier-style cross-impl test in
      // `test/unit/injected-signing.fixture.test.ts` covers the cases that
      // matter most.
      cachedResult = { ok: true, detail: 'ESM Node — probe skipped' };
      return cachedResult;
    }

    const pkg = globalRequire('viem/package.json') as { name?: string; version?: string };
    cachedResult =
      pkg.name === EXPECTED_NAME
        ? { ok: true, detail: `${pkg.name}@${pkg.version ?? 'unknown'}` }
        : {
            ok: false,
            detail: `installed viem is ${pkg.name ?? 'unknown'}@${pkg.version ?? 'unknown'}, expected ${EXPECTED_NAME}`,
          };
  } catch (err) {
    // Probe failed — unusual resolution setup, missing `viem/package.json`
    // exports entry, or runtime mismatch. Optimistically allow code-upload
    // paths to proceed; if the underlying viem truly doesn't speak
    // EIP-7594 the on-chain submit will surface the error.
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
 * The probe is memoised — package.json is read once per process. In non-Node
 * runtimes the probe is skipped entirely (dApp bundles are responsible for
 * picking the right viem).
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
