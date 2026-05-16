import type { Address, Hash, Hex } from 'viem';

/**
 * Stable string codes attached to every {@link VaraEthError}. Switch on these
 * (`err.code === VaraEthErrorCode.PromiseTimeout`) rather than `err.message`
 * — messages may change.
 */
export const VaraEthErrorCode = {
  ViemForkRequired: 'VIEM_FORK_REQUIRED',
  InjectedTxStale: 'INJECTED_TX_STALE',
  PromiseTimeout: 'PROMISE_TIMEOUT',
  PromiseSigInvalid: 'PROMISE_SIG_INVALID',
  PermitExpired: 'PERMIT_EXPIRED',
  BlobUnderpriced: 'BLOB_UNDERPRICED',
  CodeValidationTimeout: 'CODE_VALIDATION_TIMEOUT',
  NoSailsIdl: 'NO_SAILS_IDL',
  RpcConnectionFailed: 'RPC_CONNECTION_FAILED',
  ChainIdMismatch: 'CHAIN_ID_MISMATCH',
} as const;

export type VaraEthErrorCode = (typeof VaraEthErrorCode)[keyof typeof VaraEthErrorCode];

/**
 * Base class for all typed errors thrown by `@vara-eth/api` public APIs.
 *
 * Sub-classes carry a stable {@link VaraEthErrorCode} for programmatic matching.
 * The `cause` chain is preserved when a typed error wraps an underlying viem /
 * JSON-RPC / network error.
 *
 * Sub-classes set `name` automatically via `new.target.name`.
 */
export class VaraEthError extends Error {
  public readonly code: VaraEthErrorCode;

  constructor(code: VaraEthErrorCode, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = new.target.name;
    this.code = code;
  }
}

export class ViemForkRequiredError extends VaraEthError {
  constructor(cause?: unknown) {
    super(
      VaraEthErrorCode.ViemForkRequired,
      'EIP-7594 blob upload requires the @vara-eth/viem fork. Install with: yarn add npm:@vara-eth/viem@2.48.11 (or matching pinned version).',
      { cause },
    );
  }
}

export class InjectedTxStaleError extends VaraEthError {
  constructor(referenceBlock: Hex, currentBlock: Hex, cause?: unknown) {
    super(
      VaraEthErrorCode.InjectedTxStale,
      `Injected tx reference_block ${referenceBlock} is outside the 32-block validity window (current block: ${currentBlock}).`,
      { cause },
    );
  }
}

export class PromiseTimeoutError extends VaraEthError {
  public readonly txHash: Hash;

  constructor(txHash: Hash, timeoutMs: number, cause?: unknown) {
    super(
      VaraEthErrorCode.PromiseTimeout,
      `Injected tx ${txHash} did not resolve within ${timeoutMs}ms. The tx may still settle; resume by re-attaching to the subscription.`,
      { cause },
    );
    this.txHash = txHash;
  }
}

export class PromiseSignatureInvalidError extends VaraEthError {
  /** Address recovered from the signature, if the recovery step itself succeeded. Undefined when recovery failed. */
  public readonly recoveredAddress: Address | undefined;

  constructor(recoveredAddress: Address | undefined, cause?: unknown) {
    const detail =
      recoveredAddress === undefined
        ? 'Validator signature did not recover to a valid address.'
        : `Validator signature recovered to ${recoveredAddress}, which is not in the current validator set.`;
    super(VaraEthErrorCode.PromiseSigInvalid, detail, { cause });
    this.recoveredAddress = recoveredAddress;
  }
}

export class PermitExpiredError extends VaraEthError {
  constructor(deadline: bigint, now: bigint, cause?: unknown) {
    super(
      VaraEthErrorCode.PermitExpired,
      `Permit deadline ${deadline} is in the past (now: ${now}). Re-sign with an extended deadline.`,
      { cause },
    );
  }
}

export class BlobUnderpricedError extends VaraEthError {
  constructor(maxFeePerBlobGas: bigint, baseFeePerBlobGas: bigint, cause?: unknown) {
    super(
      VaraEthErrorCode.BlobUnderpriced,
      `Blob tx underpriced: maxFeePerBlobGas=${maxFeePerBlobGas} < baseFeePerBlobGas=${baseFeePerBlobGas}. Bump multiplier and retry.`,
      { cause },
    );
  }
}

/**
 * `requestCodeValidation` was committed but `CodeGotValidated` did not fire
 * within the caller's timeout. The code-validation tx is on-chain; resume the
 * deploy by calling `router.createProgramBuilder(codeId).build()` (with a
 * fresh executable-balance permit if needed) once validators commit
 * out-of-band. The `codeId`, `txHash`, and `timeoutMs` fields carry everything
 * the caller needs to do that resume.
 */
export class CodeValidationTimeoutError extends VaraEthError {
  public readonly codeId: Hex;
  public readonly txHash: Hash;
  public readonly timeoutMs: number;

  constructor(codeId: Hex, txHash: Hash, timeoutMs: number, cause?: unknown) {
    super(
      VaraEthErrorCode.CodeValidationTimeout,
      `CodeGotValidated for ${codeId} (tx ${txHash}) did not fire within ${timeoutMs}ms.`,
      { cause },
    );
    this.codeId = codeId;
    this.txHash = txHash;
    this.timeoutMs = timeoutMs;
  }
}

export class NoSailsIdlError extends VaraEthError {
  constructor() {
    super(
      VaraEthErrorCode.NoSailsIdl,
      'WASM has no `sails_idl` custom section. Use --abi to supply an external ABI, or pass payload as hex.',
    );
  }
}

export class RpcConnectionError extends VaraEthError {
  public readonly endpoint?: string;

  constructor(endpoint: string | undefined, cause?: unknown) {
    super(
      VaraEthErrorCode.RpcConnectionFailed,
      endpoint
        ? `Failed to reach Vara.Eth RPC at ${endpoint}.`
        : 'Failed to reach Vara.Eth RPC.',
      { cause },
    );
    this.endpoint = endpoint;
  }
}

export class ChainIdMismatchError extends VaraEthError {
  constructor(expected: number, got: number) {
    super(
      VaraEthErrorCode.ChainIdMismatch,
      `Ethereum chain ID mismatch: expected ${expected}, got ${got}. Check ethereumRpc + routerAddress configuration.`,
    );
  }
}
