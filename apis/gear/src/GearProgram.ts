import { AddressOrPair, SignerOptions, SubmittableExtrinsic, VoidFn } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { Event } from '@polkadot/types/interfaces';

import { decodeAddress, ReplyCode } from './utils';
import { GearApi } from './GearApi';
import { HexString } from './types';

interface ICalculateReplyResult {
  /**
   * The encoded reply payload.
   */
  payload: HexString;
  /**
   * The value associated with the reply.
   */
  value: bigint;
  /**
   * The reply code as a ReplyCode object.
   */
  code: ReplyCode;
}

interface ITxResultBase {
  /**
   * The transaction hash
   */
  txHash: HexString;
  /**
   * The block hash in which the transaction was included.
   */
  blockHash?: HexString;
  /**
   * The block number in which the transaction was included.
   */
  blockNumber?: number;
  /**
   * Indicates whether the transaction was succesful
   */
  success: boolean;
  /**
   * The error message if the transaction failed
   */
  error?: string;
}

interface IMessageResponse {
  /**
   * The id of the message
   */
  id: HexString;
  /**
   * The encoded payload
   */
  payload: HexString;
  /**
   * The value associated with the message
   */
  value: bigint;
  /**
   * The reply code as a ReplyCode object
   */
  replyCode: ReplyCode;
}

interface ISendMessageResult extends ITxResultBase {
  /**
   * The id of the message
   */
  msgId?: HexString;
  /**
   * A function to get the response from the program
   */
  response?: () => Promise<IMessageResponse>;
}

interface ISubmitTxResult extends ITxResultBase {
  events?: Event[];
}

export class Program {
  private _isInitialized = false;
  public readonly waitForInitialization: Promise<void>;
  private _events: EventTarget;
  private _storageUnsub: VoidFn;

  constructor(
    private _id: HexString,
    private _api: GearApi,
    private _account?: AddressOrPair,
    private _signerOptions?: Partial<SignerOptions>,
  ) {
    this.waitForInitialization = this._init();
    this._events = new EventTarget();
  }

  /**
   * ## Creates a new instance of the Program class and initializes it.
   * @param programId - The program ID.
   * @param api - The GearApi instance.
   * @param account - (optional) The account or address to be used for transactions.
   * @param signerOptions - (optional) Signer options for transactions.
   * @returns An initialized Program instance.
   */
  static async new(
    programId: HexString,
    api: GearApi,
    account?: AddressOrPair,
    signerOptions?: Partial<SignerOptions>,
  ): Promise<Program> {
    const program = new Program(programId, api, account, signerOptions);

    await program.waitForInitialization;

    return program;
  }

  private throwOnAccountNotSet() {
    if (!this._account) {
      throw new Error('Account is not set');
    }
  }

  private async _init(): Promise<void> {
    if (this._isInitialized) {
      return;
    }

    if (this._storageUnsub) {
      this._storageUnsub();
      this._storageUnsub = undefined;
    }

    const state = await this._api.query.gearProgram.programStorage(this._id);

    if (state.isNone) {
      throw new Error(`Program ${this._id} doesn't exist`);
    }

    if (state.unwrap().isExited) {
      this._id = state.unwrap().asExited.toHex();
      return this._init();
    }

    if (state.unwrap().isTerminated) {
      throw new Error(`Program ${this._id} has been terminated`);
    }

    this._storageUnsub = await this._api.query.gearProgram.programStorage(this._id, (data) => {
      if (data.unwrap().isExited) {
        this._isInitialized = false;
        this._id = data.unwrap().asExited.toHex();
        this._events.dispatchEvent(new CustomEvent('programExited', { detail: { inheritorId: this._id } }));
        this._init();
      }
    });

    this._isInitialized = true;
  }

  /**
   * ## Subscribes to a specific event emitted by the program.
   * @param action - The name of the event to subscribe to (e.g., 'programExited').
   * @param cb - The callback function to execute when the event is triggered. Receives the inheritor ID as a parameter.
   * @returns A function to unsubscribe from the event.
   */
  public async on(action: 'programExited', callback: (inheritorId: HexString) => void | Promise<void>) {
    await this.waitForInitialization;

    const listener = function (event: CustomEvent) {
      callback(event.detail.inheritorId);
    };

    this._events.addEventListener(action, listener);

    return () => {
      this._events.removeEventListener(action, listener);
    };
  }

  private async _submitTx(
    tx: SubmittableExtrinsic<'promise', ISubmittableResult>,
    eventsToBeReturned: string[] = [],
  ): Promise<ISubmitTxResult> {
    const _events: Event[] = [];
    const [success, txError, blockHash] = await new Promise<[boolean, string?, HexString?]>((resolve) =>
      tx
        .signAndSend(this._account, this._signerOptions, ({ events, status }) => {
          if (status.isInBlock) {
            for (const e of events) {
              if (eventsToBeReturned.includes(e.event.method)) {
                _events.push(e.event);
              }
              if (e.event.method === 'ExtrinsicSuccess') {
                resolve([true, undefined, status.asInBlock.toHex()]);
              } else if (e.event.method === 'ExtrinsicFailed') {
                resolve([false, this._api.getExtrinsicFailedError(e.event).docs, status.asInBlock.toHex()]);
              }
            }
          }
        })
        .catch((error) => {
          resolve([false, error.message]);
        }),
    );

    return {
      txHash: tx.hash.toHex(),
      success,
      events: _events,
      error: txError,
      blockHash,
      blockNumber: blockHash ? (await this._api.blocks.getBlockNumber(blockHash)).toNumber() : undefined,
    };
  }

  private get _accountAddress(): HexString {
    if (typeof this._account == 'string') {
      return decodeAddress(this._account);
    } else if ('address' in this._account) {
      return decodeAddress(this._account.address);
    } else {
      return this._account.toHex();
    }
  }

  /**
   * ## Gets the current program ID.
   * @returns The program ID as a HexString.
   */
  public get id(): HexString {
    return this._id;
  }

  /**
   * Retrieves the current balance of the program.
   * @returns The program's balance as a bigint.
   */
  public async balance(): Promise<bigint> {
    await this.waitForInitialization;
    const { data: balance } = await this._api.query.system.account(this._id);
    return balance.free.toBigInt();
  }

  /**
   * ## Transfers funds to the program to increase its balance.
   * @param value - The amount to transfer as a bigint.
   */
  public async topUp(value: bigint): Promise<Omit<ITxResultBase, 'events'>> {
    await this.waitForInitialization;
    this.throwOnAccountNotSet();

    const tx = this._api.tx.balances.transferKeepAlive(this._id, value);

    return this._submitTx(tx);
  }

  /**
   * ## Calculates the gas required for the message.
   * @param payload - The encoded payload to send, as a HexString or Uint8Array.
   * @param value - The value to send with the payload (default is 0).
   * @param allowOtherPanics - Whether to allow panics in other programs during gas calculation (default is false).
   * @returns Gas details.
   */
  public async calculateGas(payload: HexString | Uint8Array, value: bigint | number = 0, allowOtherPanics = false) {
    await this.waitForInitialization;
    this.throwOnAccountNotSet();

    const { min_limit, reserved, burned, may_be_returned, waited } = await this._api.program.calculateGas.handle(
      this._accountAddress,
      this._id,
      payload,
      value,
      allowOtherPanics,
    );

    return {
      minLimit: min_limit.toBigInt(),
      reserved: reserved.toBigInt(),
      burned: burned.toBigInt(),
      mayBeReturned: may_be_returned.toBigInt(),
      waited: waited.isTrue,
    };
  }

  /**
   * ## Sends a message to the program.
   * @param payload - The payload to send, as a HexString or Uint8Array.
   * @param value - The value to send with the message (default is 0).
   * @param gasLimit - The gas limit for the message ('max', 'auto', or a specific value). If 'auto', it will be calculated automatically.
   * @param keepAlive - Whether to use keep-alive for the transaction (default is true).
   */
  public async sendMessage(
    payload: HexString | Uint8Array,
    value: bigint | number = 0,
    gasLimit: bigint | number | 'max' | 'auto' = 'auto',
    keepAlive = true,
  ): Promise<ISendMessageResult> {
    await this.waitForInitialization;
    this.throwOnAccountNotSet();

    if (gasLimit == 'max') {
      gasLimit = this._api.blockGasLimit.toBigInt();
    } else if (gasLimit == 'auto') {
      const gas = await this.calculateGas(payload, value, keepAlive);
      gasLimit = gas.minLimit;
    }

    const tx = this._api.tx.gear.sendMessage(this._id, payload, gasLimit, value, keepAlive);

    const { success, blockHash, blockNumber, events, txHash, error } = await this._submitTx(tx, ['MessageQueued']);

    let msgId: HexString;
    let response: () => Promise<any>;

    if (success) {
      const messageQueuedEvent = events.find((e) => e.method === 'MessageQueued');
      if (messageQueuedEvent) {
        msgId = messageQueuedEvent.data[0].toHex();
      }
      response = async () => {
        const {
          data: { message },
        } = await this._api.message.getReplyEvent(this._id, msgId, blockNumber);

        return {
          id: message.id.toHex(),
          payload: message.payload.toHex(),
          value: message.value.toBigInt(),
          replyCode: new ReplyCode(message.details.unwrap().code.toU8a(), this._api.specVersion),
        };
      };
    }

    return {
      success,
      blockHash,
      blockNumber,
      txHash,
      error,
      msgId,
      response,
    };
  }

  /**
   * ## Calculates the reply for a given payload and value.
   * @param payload - The payload to send, as a HexString or Uint8Array.
   * @param value - The value to send with the payload (default is 0).
   * @param gasLimit - The gas limit for the reply ('max' or a specific value).
   * @returns Reply details.
   */
  public async calculateReply(
    payload: HexString | Uint8Array,
    value = 0,
    gasLimit: bigint | number | 'max' = 'max',
  ): Promise<ICalculateReplyResult> {
    await this.waitForInitialization;
    this.throwOnAccountNotSet();

    const reply = await this._api.message.calculateReply({
      payload,
      origin: this._accountAddress,
      destination: this._id,
      gasLimit: gasLimit == 'max' ? this._api.blockGasLimit : gasLimit,
      value,
    });

    return {
      payload: reply.payload.toHex(),
      value: reply.value.toBigInt(),
      code: new ReplyCode(reply.code.toU8a(), this._api.specVersion),
    };
  }
}
