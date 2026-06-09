import { blake2b } from '@noble/hashes/blake2.js';
import { keccak_256 } from '@noble/hashes/sha3.js';
import { type Address, bytesToHex, concatBytes, type Hash, type Hex, hexToBytes, recoverMessageAddress } from 'viem';

import { ReplyCode } from '../../errors/reply-code.js';
import type { EthereumClient } from '../../eth/ethereumClient.js';
import { bigint128ToBytes } from '../../util/bigint.js';

export type InjectedTransactionPromiseRaw = {
  readonly Promise: {
    readonly txHash: Hash;
    readonly reply: {
      readonly payload: Hex;
      readonly value: number;
      readonly code: Hex;
    };
  };
};

export type InjectedTransactionPurgedRaw = {
  readonly Purged: {
    readonly txHash: Hash;
    readonly reason: number | string;
  };
};

export type InjectedTransactionReceiptRaw = {
  readonly data: InjectedTransactionPromiseRaw | InjectedTransactionPurgedRaw;
  readonly signature: Hex;
  readonly address: Address;
};

export type InjectedTransactionPromise = {
  /** The payload of the reply message */
  readonly payload: Hex;
  /** The value (in wei) associated with the reply */
  readonly value: bigint;
  /** The reply code indicating the result status */
  readonly code: ReplyCode;
};

/**
 * Mirrors `TransactionPurgedReason` from the Rust implementation (`#[repr(u8)]`).
 * Values not listed here may appear for future purge reasons.
 */
export enum TransactionPurgedReason {
  /** The transaction references an outdated block and cannot be included. */
  Outdated = 1,
  /** The transaction references a block that is not known locally. */
  UnknownReferenceBlock = 2,
  /** The transaction has a non-zero value, which is not supported yet. */
  NonZeroValue = 255,
}

const PURGE_REASON_MESSAGES: Record<number, string> = {
  [TransactionPurgedReason.Outdated]: 'transaction reference block is outdated',
  [TransactionPurgedReason.UnknownReferenceBlock]: 'transaction reference block is unknown',
  [TransactionPurgedReason.NonZeroValue]: 'transaction value must be zero',
};

// RPC may return the enum variant name as a string instead of its numeric discriminant.
const PURGE_REASON_BY_NAME: Record<string, TransactionPurgedReason> = {
  Outdated: TransactionPurgedReason.Outdated,
  UnknownReferenceBlock: TransactionPurgedReason.UnknownReferenceBlock,
  NonZeroValue: TransactionPurgedReason.NonZeroValue,
};

function normalizePurgeReason(reason: number | string): number {
  if (typeof reason === 'number') return reason;
  return PURGE_REASON_BY_NAME[reason] ?? -1;
}

/**
 * Represents a signed receipt returned by the node after an injected transaction is processed.
 *
 * A receipt is one of two variants:
 * - **Promise** — the transaction was executed and a reply was produced. Access reply data via {@link promise}.
 * - **Purged** — the transaction was dropped before execution. Access the reason via {@link error} or {@link purgedReason}.
 *
 * Always call {@link validateSignature} before trusting reply data.
 */
export class InjectedTxReceipt {
  /** ECDSA signature over {@link hash}, produced by the validator. */
  public readonly signature: Hex;
  /** Lowercase Ethereum address of the validator that signed this receipt. */
  public readonly address: Address;
  /** The injected transaction hash this receipt corresponds to. */
  public readonly txHash: Hash;
  private readonly _promise: InjectedTransactionPromise | null;
  private readonly _error: number | null;

  constructor(
    receipt: InjectedTransactionReceiptRaw,
    private _ethClient: EthereumClient,
  ) {
    this.signature = receipt.signature;
    this.address = receipt.address.toLowerCase() as Address;
    if ('Promise' in receipt.data) {
      this.txHash = receipt.data.Promise.txHash;
      this._promise = {
        payload: receipt.data.Promise.reply.payload,
        value: BigInt(receipt.data.Promise.reply.value),
        code: ReplyCode.fromBytes(receipt.data.Promise.reply.code),
      };
      this._error = null;
    } else {
      this.txHash = receipt.data.Purged.txHash;
      this._error = normalizePurgeReason(receipt.data.Purged.reason);
      this._promise = null;
    }
  }

  /**
   * Validates that this receipt was signed by a registered validator.
   *
   * Recovers the signer from {@link signature} over {@link hash} and checks:
   * 1. The recovered address matches {@link address} reported in the receipt.
   * 2. That address appears in the on-chain validator set.
   *
   * @throws {Error} If the recovered address does not match the receipt address.
   * @throws {Error} If the recovered address is not a registered validator.
   */
  public async validateSignature() {
    const recoveredAddress = await recoverMessageAddress({
      message: { raw: this.hash },
      signature: this.signature,
    });

    const lcAddress = recoveredAddress.toLowerCase() as Address;

    if (this.address !== lcAddress) {
      throw new Error(
        `Promise signature validation failed: recovered address ${lcAddress} doesn't match one received in the receipt ${this.address}`,
      );
    }

    const validators = await this._ethClient.router.validators();

    if (!validators.includes(lcAddress)) {
      throw new Error(
        `Promise signature validation failed: recovered address ${lcAddress} is not a registered validator`,
      );
    }
  }

  /**
   * Human-readable description of why this receipt is in a Purged state, or `null` for a successful Promise receipt.
   *
   * Returns `null` when the receipt is a Promise (success).
   * Returns a decoded reason string for known {@link TransactionPurgedReason} values.
   * Returns `'unknown purge reason: <code>'` for unrecognized codes.
   * Returns `'Unknown error'` if the receipt is neither Promise nor Purged (should not occur in practice).
   */
  public get error(): string | null {
    if (this._error === null) {
      if (this._promise) {
        return null;
      } else {
        return 'Unknown error';
      }
    }

    return PURGE_REASON_MESSAGES[this._error] ?? `unknown purge reason: ${this._error}`;
  }

  /**
   * The raw purge reason code, or `null` for a Promise receipt.
   *
   * Use this for programmatic branching on the purge reason.
   * Values correspond to {@link TransactionPurgedReason}; unrecognized future codes are returned as-is.
   */
  public get purgedReason(): number | null {
    return this._error;
  }

  /**
   * The reply data from a successfully executed transaction.
   *
   * @throws {Error} If the receipt is Purged — check `error === null` before accessing this getter,
   * or catch the thrown error.
   */
  public get promise(): InjectedTransactionPromise {
    if (!this._promise) {
      throw new Error(this.error ?? 'No promise received. Unknown error');
    }

    return this._promise;
  }

  /**
   * The receipt hash used as the signed message by the validator.
   *
   * Encoding: `keccak256([variant_tag] ‖ txHash ‖ inner_hash)` where:
   * - Promise variant: `tag = 0x00`, `inner_hash = replyHash`
   * - Purged variant: `tag = 0x01`, `inner_hash = reason_byte`
   *
   * @throws {Error} If the receipt is in an unexpected state (neither Promise nor Purged).
   */
  public get hash(): Hash {
    const data: Uint8Array[] = [];
    if (this._promise) {
      data.push(Uint8Array.from([0]));
      data.push(this._txHashU8a);
      data.push(this._replyHashU8a);
    } else if (this._error !== null) {
      data.push(Uint8Array.from([1]));
      data.push(this._txHashU8a);
      data.push(Uint8Array.from([this._error]));
    } else {
      throw new Error('Unable to create hash. No promise or error was received.');
    }

    return bytesToHex(keccak_256(concatBytes(data)));
  }

  /**
   * blake2b-256 hash of the reply info: `blake2b(payload ‖ value ‖ code)`.
   * Used as the `inner_hash` component of {@link hash} for Promise receipts.
   *
   * @throws {Error} If the receipt is Purged (no reply info to hash).
   */
  public get replyHash(): Hash {
    return bytesToHex(this._replyHashU8a);
  }

  private get _payloadU8a(): Uint8Array {
    return hexToBytes(this.promise.payload);
  }

  private get _txHashU8a(): Uint8Array {
    return hexToBytes(this.txHash);
  }

  private get _codeU8a(): Uint8Array {
    return this.promise.code.toBytes();
  }

  private get _valueU8a(): Uint8Array {
    return bigint128ToBytes(this.promise.value);
  }

  private get _replyHashU8a(): Uint8Array {
    return blake2b(concatBytes([this._payloadU8a, this._valueU8a, this._codeU8a]), { dkLen: 32 });
  }
}
