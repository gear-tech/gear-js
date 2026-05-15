import type { Address, Hash, Hex } from 'viem';

/**
 * Base class for all typed errors thrown by `@vara-eth/api` public APIs.
 *
 * Sub-classes carry a stable `.code` string for programmatic matching. Consumers
 * should switch on `.code` rather than `.message` — messages are user-facing and
 * may change.
 *
 * The `cause` chain is preserved when a typed error wraps an underlying viem /
 * JSON-RPC / network error.
 */
export class VaraEthError extends Error {
  public readonly code: string;

  constructor(code: string, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'VaraEthError';
    this.code = code;
  }
}

/**
 * Thrown when the installed `viem` is upstream (not the `@vara-eth/viem` fork)
 * and EIP-7594 blob upload is required by the caller.
 *
 * Surfaces only on code-validation paths (`RouterClient.requestCodeValidation`).
 * Read-only contract calls never trigger it.
 */
export class ViemForkRequiredError extends VaraEthError {
  constructor(cause?: unknown) {
    super(
      'VIEM_FORK_REQUIRED',
      'EIP-7594 blob upload requires the @vara-eth/viem fork. Install with: yarn add npm:@vara-eth/viem@2.48.11 (or matching pinned version).',
      { cause },
    );
    this.name = 'ViemForkRequiredError';
  }
}

/**
 * Thrown when an injected transaction's `reference_block` is older than the
 * validity window (32 blocks) at the time the validator sees it.
 */
export class InjectedTxStaleError extends VaraEthError {
  constructor(referenceBlock: Hex, currentBlock: Hex, cause?: unknown) {
    super(
      'INJECTED_TX_STALE',
      `Injected tx reference_block ${referenceBlock} is outside the 32-block validity window (current block: ${currentBlock}).`,
      { cause },
    );
    this.name = 'InjectedTxStaleError';
  }
}

/**
 * Thrown when an injected tx's promise subscription does not resolve within the
 * caller-supplied timeout. The tx may still settle later — the wallet's
 * persistence layer is responsible for resume semantics.
 */
export class PromiseTimeoutError extends VaraEthError {
  public readonly txHash: Hash;

  constructor(txHash: Hash, timeoutMs: number, cause?: unknown) {
    super(
      'PROMISE_TIMEOUT',
      `Injected tx ${txHash} did not resolve within ${timeoutMs}ms. The tx may still settle; resume by re-attaching to the subscription.`,
      { cause },
    );
    this.name = 'PromiseTimeoutError';
    this.txHash = txHash;
  }
}

/**
 * Thrown when a validator signature on an injected-tx promise fails to recover
 * to a currently-registered validator address. Indicates possible validator
 * misbehaviour or a mismatched chain.
 */
export class PromiseSignatureInvalidError extends VaraEthError {
  public readonly recoveredAddress: Address;

  constructor(recoveredAddress: Address, cause?: unknown) {
    super(
      'PROMISE_SIG_INVALID',
      `Validator signature recovered to ${recoveredAddress}, which is not in the current validator set.`,
      { cause },
    );
    this.name = 'PromiseSignatureInvalidError';
    this.recoveredAddress = recoveredAddress;
  }
}

/**
 * Thrown when an EIP-2612 permit signature has expired before the on-chain
 * call could include it.
 */
export class PermitExpiredError extends VaraEthError {
  constructor(deadline: bigint, now: bigint, cause?: unknown) {
    super(
      'PERMIT_EXPIRED',
      `Permit deadline ${deadline} is in the past (now: ${now}). Re-sign with an extended deadline.`,
      { cause },
    );
    this.name = 'PermitExpiredError';
  }
}

/**
 * Thrown when a blob-bearing transaction is rejected by the Ethereum mempool
 * because `maxFeePerBlobGas` was below current base fee.
 */
export class BlobUnderpricedError extends VaraEthError {
  constructor(maxFeePerBlobGas: bigint, baseFeePerBlobGas: bigint, cause?: unknown) {
    super(
      'BLOB_UNDERPRICED',
      `Blob tx underpriced: maxFeePerBlobGas=${maxFeePerBlobGas} < baseFeePerBlobGas=${baseFeePerBlobGas}. Bump multiplier and retry.`,
      { cause },
    );
    this.name = 'BlobUnderpricedError';
  }
}

/**
 * Thrown when a `Mirror.sendMessage` or other state-changing call reverts
 * on-chain. The decoded revert reason (when available) is exposed via
 * `.reason`.
 */
export class MessageRevertedError extends VaraEthError {
  public readonly reason: string;

  constructor(reason: string, cause?: unknown) {
    super('MESSAGE_REVERTED', `On-chain call reverted: ${reason}`, { cause });
    this.name = 'MessageRevertedError';
    this.reason = reason;
  }
}

/**
 * Thrown by the IDL extractor when the supplied WASM has no `sails_idl` custom
 * section. Callers should fall back to opaque-hex payload handling or an
 * external ABI source.
 */
export class NoSailsIdlError extends VaraEthError {
  constructor() {
    super(
      'NO_SAILS_IDL',
      'WASM has no `sails_idl` custom section. Use --abi to supply an external ABI, or pass payload as hex.',
    );
    this.name = 'NoSailsIdlError';
  }
}

/**
 * Thrown when the underlying JSON-RPC connection to a Vara.Eth node fails or
 * is unreachable. Caller-provided `timeoutMs` controls the deadline.
 */
export class RpcConnectionError extends VaraEthError {
  public readonly endpoint?: string;

  constructor(endpoint: string | undefined, cause?: unknown) {
    super(
      'RPC_CONNECTION_FAILED',
      endpoint
        ? `Failed to reach Vara.Eth RPC at ${endpoint}.`
        : 'Failed to reach Vara.Eth RPC.',
      { cause },
    );
    this.name = 'RpcConnectionError';
    this.endpoint = endpoint;
  }
}

/**
 * Thrown when the connected Ethereum chain ID does not match the chain ID the
 * Vara.Eth Router contract was deployed against.
 */
export class ChainIdMismatchError extends VaraEthError {
  constructor(expected: number, got: number) {
    super(
      'CHAIN_ID_MISMATCH',
      `Ethereum chain ID mismatch: expected ${expected}, got ${got}. Check ethereumRpc + routerAddress configuration.`,
    );
    this.name = 'ChainIdMismatchError';
  }
}
