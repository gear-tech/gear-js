import { bytesToHex, concatBytes, randomBytes, hexToBytes } from '@ethereumjs/util';
import { keccak_256 } from '@noble/hashes/sha3.js';

import { bigint128ToBytes } from '../../util/index.js';
import { HexString } from '../../types/index.js';

// TODO: add JSDocs
export interface IInjectedTransaction {
  readonly destination: HexString;
  readonly payload: HexString;
  recipient?: HexString;
  value?: bigint;
  referenceBlock?: HexString;
  salt?: HexString;
}

// TODO: add validation of all fields
export class InjectedTransaction {
  private _destination: HexString;
  private _payload: HexString;
  private _value: bigint;
  private _referenceBlock: HexString;
  private _salt: HexString;
  private _recipient: HexString;

  constructor(tx: IInjectedTransaction) {
    this._destination = tx.destination;
    this._payload = tx.payload;
    this._value = tx.value || 0n;
    if (tx.referenceBlock) {
      this._referenceBlock = tx.referenceBlock;
    }
    this._salt = tx.salt ? tx.salt : bytesToHex(randomBytes(32));
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
    this._salt = value;
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

  public get payload(): HexString {
    return this._payload;
  }

  public get payloadU8a(): Uint8Array {
    return hexToBytes(this._payload);
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

  public get salt(): HexString {
    return this._salt;
  }

  public get saltU8a(): Uint8Array {
    return hexToBytes(this._salt);
  }

  public get hash(): HexString {
    const bytes = concatBytes(
      this.destinationU8a,
      this.payloadU8a,
      this.valueU8a,
      this.referenceBlockU8a,
      this.saltU8a,
    );
    const hash = keccak_256(bytes);

    // TODO: consider caching the result if necessary
    return bytesToHex(hash);
  }

  public get data() {
    return {
      destination: this.destination,
      payload: this.payload,
      value: Number(this.value),
      reference_block: this.referenceBlock,
      salt: this.salt,
    };
  }
}
