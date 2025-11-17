import { bytesToHex, concatBytes, randomBytes, hexToBytes } from '@ethereumjs/util';
import { keccak_256 } from '@noble/hashes/sha3.js';

import { bigint128ToBytes } from '../../util/index.js';
import { HexString } from '../../types/index.js';

// TODO: add JSDocs
export interface IInjectedTransaction {
  readonly destination: HexString;
  readonly payload: HexString | Uint8Array;
  recipient?: HexString;
  value?: bigint;
  referenceBlock?: HexString;
  salt?: HexString;
}

// TODO: add validation of all fields
export class InjectedTransaction {
  private _destination: HexString;
  private _payload: Uint8Array;
  private _value: bigint;
  private _referenceBlock: HexString;
  private _salt: Uint8Array;
  private _recipient: HexString;

  constructor(tx: IInjectedTransaction) {
    this._destination = tx.destination;
    this._payload = typeof tx.payload === 'string' ? hexToBytes(tx.payload) : tx.payload;
    this._value = tx.value || 0n;
    if (tx.referenceBlock) {
      this._referenceBlock = tx.referenceBlock;
    }
    this._salt = tx.salt ? hexToBytes(tx.salt) : randomBytes(32);
    if (tx.recipient) {
      this._recipient = tx.recipient;
    }
  }

  public setRecipient(value: HexString): this {
    this._recipient = value;
    return this;
  }

  public setValue(value: bigint): this {
    this._value = value;
    return this;
  }

  public setReferenceBlock(value: HexString): this {
    this._referenceBlock = value;
    return this;
  }

  public setSalt(value: HexString): this {
    this._salt = hexToBytes(value);
    return this;
  }

  public get destination(): HexString {
    return this._destination;
  }

  public get destinationU8a(): Uint8Array {
    const bytes = new Uint8Array(32).fill(0);
    bytes.set(hexToBytes(this._destination), 12);
    return bytes;
  }

  public get recipient(): HexString | null {
    return this._recipient || null;
  }

  public get recipientU8a(): Uint8Array {
    if (!this.recipient) {
      // TODO: probably it should be a part of the Injected Transaction.
      // figure it out when https://github.com/gear-tech/gear/pull/4938 is ready
      throw new Error('Recipient is not defined');
    }
    return this._recipient ? hexToBytes(this._recipient) : new Uint8Array(20).fill(0);
  }

  public get payload(): Uint8Array {
    return this._payload;
  }

  public get value(): bigint {
    return this._value;
  }

  public get valueU8a(): Uint8Array {
    return bigint128ToBytes(this._value);
  }

  public get referenceBlock(): HexString | null {
    return this._referenceBlock || null;
  }

  public get referenceBlockU8a(): Uint8Array {
    if (!this._referenceBlock) {
      throw new Error('Reference block is not defined');
    }
    return hexToBytes(this._referenceBlock);
  }

  public get salt(): Uint8Array {
    return this._salt;
  }

  public get hash(): HexString {
    const bytes = concatBytes(
      this.recipientU8a,
      this.destinationU8a,
      this._payload,
      this.valueU8a,
      this.referenceBlockU8a,
      this._salt,
    );
    const hash = keccak_256(bytes);

    // TODO: consider caching the result if necessary
    return bytesToHex(hash);
  }

  public get data() {
    return {
      recipient: this._recipient,
      destination: this.destination,
      payload: this.payload,
      value: this.value.toString(),
      reference_block: this.referenceBlock,
      salt: this.salt,
    };
  }
}
