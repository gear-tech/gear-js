import { bytesToHex, concatBytes, randomBytes, hexToBytes } from '@ethereumjs/util';
import { keccak_256 } from '@noble/hashes/sha3.js';
import { blake2b } from '@noble/hashes/blake2';
import { Address, Hex } from 'viem';

import { IInjectedTransaction, IInjectedTransactionPromise, IVaraEthProvider } from '../types/index.js';
import { EthereumClient } from '../eth/index.js';
import { bigint128ToBytes } from '../util/index.js';

type InjectedTransactionPromiseRaw = {
  data: {
    txHash: {
      hash: Hex;
    };
    reply: {
      payload: Hex;
      value: number;
      code:
        | {
            Success: string;
          }
        | { Error: string };
    };
  };
  signature: Hex;
};

export class Injected {
  private _destination: Hex;
  private _payload: Hex;
  private _value: bigint;
  private _referenceBlock: Hex;
  private _salt: Hex;
  private _recipient: Hex;
  private _signature: Hex;

  constructor(
    private _varaethProvider: IVaraEthProvider,
    private _ethClient: EthereumClient,
    tx: IInjectedTransaction,
  ) {
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

  public get destination(): Hex {
    return this._destination;
  }

  private get _destinationU8a(): Uint8Array {
    const bytes = new Uint8Array(32).fill(0);
    bytes.set(hexToBytes(this._destination), 12);
    return bytes;
  }

  public get recipient(): Hex | null {
    return this._recipient || null;
  }

  public get payload(): Hex {
    return this._payload;
  }

  private get _payloadU8a(): Uint8Array {
    return hexToBytes(this._payload);
  }

  public get value(): bigint {
    return this._value;
  }

  private get _valueU8a(): Uint8Array {
    return bigint128ToBytes(this._value);
  }

  public get referenceBlock(): Hex | null {
    return this._referenceBlock || null;
  }

  private get _referenceBlockU8a(): Uint8Array {
    if (!this._referenceBlock) {
      throw new Error('Reference block is not defined');
    }
    return hexToBytes(this._referenceBlock);
  }

  public get salt(): Hex {
    return this._salt;
  }

  private get _saltU8a(): Uint8Array {
    return hexToBytes(this._salt);
  }

  private get _bytes() {
    return concatBytes(this._destinationU8a, this._payloadU8a, this._valueU8a, this._referenceBlockU8a, this._saltU8a);
  }

  public get hash(): Hex {
    const hash = keccak_256(this._bytes);

    return bytesToHex(hash);
  }

  public get messageId(): Hex {
    const id = blake2b(this._bytes, { dkLen: 32 });

    return bytesToHex(id);
  }

  private get _data() {
    return {
      destination: this.destination,
      payload: this.payload,
      value: Number(this.value),
      reference_block: this.referenceBlock,
      salt: this.salt,
    };
  }

  public setValue(value: bigint): this {
    this._value = value;
    return this;
  }

  public setSalt(value: Hex): this {
    this._salt = value;
    return this;
  }

  public async setReferenceBlock() {
    const latestBlockNumber = await this._ethClient.getBlockNumber();
    const blockNumber = latestBlockNumber - 3; // TODO: move to consts, explain why such value

    const block = await this._ethClient.getBlock(blockNumber);
    this._referenceBlock = block.hash;
  }

  public async setRecipient(address?: Address) {
    const validators = await this._ethClient.router.validators();

    if (address) {
      if (validators.includes(address)) {
        this._recipient = address;
        return;
      }
      throw new Error('Address is not a validator');
    }

    const slot = Math.floor(Date.now() / this._ethClient.blockDuration);

    const validatorIndex = slot % validators.length;

    this._recipient = validators[validatorIndex];
  }

  private get _rpcData() {
    return [
      {
        recipient: this._recipient,
        tx: {
          data: this._data,
          signature: this._signature,
          public_key: this._ethClient.accountAddress,
        },
      },
    ];
  }

  private async _sign() {
    this._signature = await this._ethClient.signMessage(this.hash);
  }

  public async send(): Promise<string> {
    if (!this._referenceBlock) {
      await this.setReferenceBlock();
    }

    await this._sign();

    if (!this._recipient) {
      await this.setRecipient();
    }

    const result = await this._varaethProvider.send<string>('injected_sendTransaction', this._rpcData);

    return result;
  }

  public async sendAndWaitForPromise(): Promise<IInjectedTransactionPromise> {
    if (!this._referenceBlock) {
      await this.setReferenceBlock();
    }

    await this._sign();

    if (!this._recipient) {
      await this.setRecipient();
    }

    let unsub: (() => void) | undefined;

    const promise = new Promise<IInjectedTransactionPromise>((resolve, reject) => {
      this._varaethProvider
        .subscribe<unknown, InjectedTransactionPromiseRaw>(
          'injected_subscribeTransactionPromise',
          'injected_unsubscribeTransactionPromise',
          this._rpcData,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                txHash: result.data.txHash.hash,
                reply: result.data.reply,
                signature: result.signature,
              });
            }
          },
        )
        .then((unsubFn) => {
          unsub = unsubFn;
        })
        .catch(reject);
    });

    try {
      return await promise;
    } finally {
      if (unsub) {
        unsub();
      }
    }
  }
}
