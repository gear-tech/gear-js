import { bytesToHex, concatBytes, hexToBytes, randomBytes } from '@ethereumjs/util';
import { blake2b } from '@noble/hashes/blake2';
import { keccak_256 } from '@noble/hashes/sha3.js';
import type { Address, Hex } from 'viem';
import { zeroAddress } from 'viem';

import type { IInjectedTransaction, IVaraEthProvider, IVaraEthValidatorPoolProvider } from '../../types/index.js';
import { InjectedTransactionPromiseRaw, InjectedTxPromise } from './promise.js';
import type { EthereumClient } from '../../eth/index.js';
import { isPoolProvider } from '../../provider/util.js';
import { bigint128ToBytes } from '../../util/index.js';

export class InjectedTx {
  private _destination: Address;
  private _payload: Hex;
  private _value: bigint;
  private _referenceBlock: Hex;
  private _salt: Hex;
  private _recipient?: Address;
  private _signature: Hex;

  constructor(
    private _varaethProvider: IVaraEthProvider | IVaraEthValidatorPoolProvider,
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
      this._recipient = tx.recipient.toLowerCase() as Address;
      if (isPoolProvider(this._varaethProvider)) {
        this._varaethProvider.setActiveValidator(this._recipient);
      }
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

  public get recipient(): Address | null {
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
    const hash = blake2b(this._bytes, { dkLen: 32 });

    return bytesToHex(hash);
  }

  public get txHash(): Hex {
    return this.messageId;
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

  /**
   * ## Specify validator address the transaction is intended for
   * @param address - (optional) the validator address. Default: zero address
   * @returns the validator address
   */
  public async setRecipient(address?: Address): Promise<Address> {
    if (isPoolProvider(this._varaethProvider)) {
      if (!address) {
        return this.setNextValidator();
      }
      this._varaethProvider.setActiveValidator(address);
    }

    const validators = await this._ethClient.router.validators();

    if (address) {
      const lcAddr = address.toLowerCase() as Address;
      if (!validators.includes(lcAddr)) {
        throw new Error('Address is not a validator');
      }
      this._recipient = lcAddr;
    } else {
      this._recipient = zeroAddress;
    }

    return this._recipient;
  }

  public async setNextValidator() {
    if (!isPoolProvider(this._varaethProvider)) {
      throw new Error('Next validator can only be set for pool providers');
    }

    const validators = await this._ethClient.router.validators();

    const latestBlockTimestamp = await this._ethClient.getLatestBlockTimestamp();
    const timestamp = latestBlockTimestamp + this._ethClient.blockDuration * 2;
    const slot = Math.floor(timestamp / this._ethClient.blockDuration);

    const validatorIndex = slot % validators.length;

    this._varaethProvider.setActiveValidator(validators[validatorIndex]);
    this._recipient = validators[validatorIndex].toLowerCase() as Address;
    return this._recipient;
  }

  public get _rpcData() {
    return [
      {
        recipient: this._recipient,
        tx: {
          data: this._data,
          signature: this._signature,
          address: this._ethClient.accountAddress,
        },
      },
    ];
  }

  public async sign() {
    this._signature = await this._ethClient.signMessage(this.hash);

    return this._signature;
  }

  public async send(): Promise<string> {
    if (!this._referenceBlock) {
      await this.setReferenceBlock();
    }

    await this.sign();

    if (!this._recipient) {
      await this.setRecipient();
    }

    const result = await this._varaethProvider.send<string>('injected_sendTransaction', this._rpcData);

    return result;
  }

  public async sendAndWaitForPromise(): Promise<InjectedTxPromise> {
    if (!this._referenceBlock) {
      await this.setReferenceBlock();
    }

    await this.sign();

    if (!this._recipient) {
      await this.setRecipient();
    }

    let unsub: (() => void) | undefined;

    const promise = new Promise<InjectedTxPromise>((resolve, reject) => {
      this._varaethProvider
        .subscribe<unknown, InjectedTransactionPromiseRaw>(
          'injected_sendTransactionAndWatch',
          'injected_sendTransactionAndWatchUnsubscribe',
          this._rpcData,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(new InjectedTxPromise(result, this._ethClient));
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
