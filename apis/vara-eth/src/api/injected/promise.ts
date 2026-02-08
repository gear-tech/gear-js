import { bytesToHex, concatBytes, hexToBytes } from '@ethereumjs/util';
import { keccak_256 } from '@noble/hashes/sha3.js';
import type { Address, Hash, Hex } from 'viem';
import { recoverMessageAddress } from 'viem';

import type { IInjectedTransactionPromise } from '../../types/index.js';
import type { EthereumClient } from '../../eth/index.js';
import { bigint128ToBytes } from '../../util/index.js';
import { ReplyCode } from '../../errors/index.js';

export type InjectedTransactionPromiseRaw = {
  data: {
    txHash: Hash;
    reply: {
      payload: Hex;
      value: number;
      code: Hex;
    };
  };
  signature: Hex;
};

export class InjectedTxPromise implements IInjectedTransactionPromise {
  /**
   * The hash of the original injected transaction
   */
  public readonly txHash: Hash;
  /**
   * The payload of the reply message
   */
  public readonly payload: Hex;
  /**
   * The value (in wei) associated with the reply
   */
  public readonly value: bigint;
  /**
   * The reply code indicating the result status
   */
  public readonly code: ReplyCode;
  /**
   * The validator's signature for this promise
   */
  public readonly signature: Hex;

  private _validatorAddress?: Address;

  constructor(
    promise: InjectedTransactionPromiseRaw,
    private _ethClient: EthereumClient,
  ) {
    this.txHash = promise.data.txHash;
    this.payload = promise.data.reply.payload;
    this.value = BigInt(promise.data.reply.value);
    this.code = ReplyCode.fromBytes(promise.data.reply.code);
    this.signature = promise.signature;
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

    const validators = await this._ethClient.router.validators();

    if (!validators.includes(lcAddress)) {
      throw new Error(
        `Promise signature validation failed: recovered address ${lcAddress} is not a registered validator`,
      );
    }

    this._validatorAddress = lcAddress;
  }

  /**
   * Returns the address of the validator that signed the promise
   * @throws {Error} If the signature is not validated yet
   */
  public get validatorAddress() {
    if (!this._validatorAddress) {
      throw new Error('Validator address is not available. Call validateSignature() first.');
    }

    return this._validatorAddress;
  }

  private get _dataU8a(): Uint8Array {
    return concatBytes(this._txHashU8a, this._payloadU8a, this._codeU8a, this._valueU8a);
  }

  /**
   * Computes the keccak256 hash of the promise data (txHash + payload + code + value)
   * @returns The hash used for signature verification
   */
  public get hash(): Hash {
    return bytesToHex(keccak_256(this._dataU8a));
  }

  private get _payloadU8a(): Uint8Array {
    return hexToBytes(this.payload);
  }

  private get _txHashU8a(): Uint8Array {
    return hexToBytes(this.txHash);
  }

  private get _codeU8a(): Uint8Array {
    return this.code.toBytes();
  }

  private get _valueU8a(): Uint8Array {
    return bigint128ToBytes(this.value);
  }
}
