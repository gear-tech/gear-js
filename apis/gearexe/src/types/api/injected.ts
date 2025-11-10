import { bytesToHex, concatBytes, randomBytes } from '@ethereumjs/util';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { hexToBytes } from 'ethereum-cryptography/utils';
import { HexString } from 'gear-js-util';
import { bigint128ToBytes } from '../../util/index.js';

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
    if (tx.salt) {
      this._salt = hexToBytes(tx.salt);
    }
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
    return this._referenceBlock ? hexToBytes(this._referenceBlock) : new Uint8Array(32).fill(0);
  }

  public get salt(): Uint8Array {
    if (!this._salt) {
      this._salt = randomBytes(32);
    }
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

    const hash = keccak256(bytes);

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
