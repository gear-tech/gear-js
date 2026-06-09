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
    readonly reason: number; // TODO
  };
};

export type InjectedTransactionReceiptRaw = {
  readonly data: InjectedTransactionPromiseRaw | InjectedTransactionPurgedRaw;
  readonly signature: Hex;
  readonly address: Address;
};

export type InjectedTransactionPromise = {
  /**
   * The payload of the reply message
   */
  readonly payload: Hex;
  /**
   * The value (in wei) associated with the reply
   */
  readonly value: bigint;
  /**
   * The reply code indicating the result status
   */
  readonly code: ReplyCode;
};

export class InjectedTxReceipt {
  public readonly signature: Hex;
  public readonly address: Address;
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
      this._error = receipt.data.Purged.reason;
      this._promise = null;
    }
  }

  /**
   * Validates that the promise signature was created by an authorized validator
   * @throws {Error} If the signature is invalid or not from a registered validator
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

  public get error(): string | null {
    if (this._error === null) {
      if (this._promise) {
        return null;
      } else {
        return 'Unknown error';
      }
    }

    // TODO: decode error
    return this._error.toString();
  }

  public get promise(): InjectedTransactionPromise {
    if (!this._promise) {
      throw new Error(this.error ?? 'No promise received. Unknown error');
    }

    return this._promise;
  }

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

  public get replyHash(): Hash {
    return bytesToHex(this._replyHashU8a);
  }
}
