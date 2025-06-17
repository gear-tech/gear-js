import { AddressOrPair, SignerOptions, SubmittableExtrinsic, VoidFn } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { Event } from '@polkadot/types/interfaces';

import { decodeAddress, ReplyCode } from './utils';
import { GearApi } from './GearApi';
import { HexString } from './types';
import { MessageQueued } from './events';

interface ICalculateReplyResult {
  /**
   * The encoded reply payload.
   */
  readonly payload: HexString;
  /**
   * The value associated with the reply.
   */
  readonly value: bigint;
  /**
   * The reply code as a ReplyCode object.
   */
  readonly code: ReplyCode;
}

interface ITxResultBaseSuccess {
  /**
   * The transaction hash
   */
  readonly txHash: HexString;
  /**
   * The block hash in which the transaction was included.
   */
  readonly blockHash: HexString;
  /**
   * The block number in which the transaction was included.
   */
  readonly blockNumber: number;
  /**
   * Indicates whether the transaction was succesful
   */
  readonly success: true;
}

interface ITxResultBaseFailed
  extends Pick<ITxResultBaseSuccess, 'txHash'>,
    Partial<Pick<ITxResultBaseSuccess, 'blockHash' | 'blockNumber'>> {
  success: false;

  /**
   * The error message if the transaction failed
   */
  readonly error?: string;
}

type ITxResultBase = ITxResultBaseSuccess | ITxResultBaseFailed;

interface IMessageResponse {
  /**
   * The id of the message
   */
  readonly id: HexString;
  /**
   * The encoded payload
   */
  readonly payload: HexString;
  /**
   * The value associated with the message
   */
  readonly value: bigint;
  /**
   * The reply code as a ReplyCode object
   */
  readonly replyCode: ReplyCode;
}

interface ISendMessageResultSuccess extends ITxResultBaseSuccess {
  /**
   * The id of the message
   */
  readonly id: HexString;
  /**
   * A function to get the response from the program
   */
  readonly response: () => Promise<IMessageResponse>;
}

type ISendMessageResult = ISendMessageResultSuccess | ITxResultBaseFailed;

interface ISubmitTxResultSuccess extends ITxResultBaseSuccess {
  readonly eventsToReturn: Event[];
}

type ISubmitTxResult = ISubmitTxResultSuccess | ITxResultBaseFailed;

interface ISendMessageParams {
  /**
   * The payload to send
   */
  readonly payload: HexString | Uint8Array;
  /**
   * The value to send with the message (default: 0)
   */
  readonly value?: bigint | number;
  /**
   * The gas limit for the message (default: 'auto')
   * - 'auto': calculate minimum required gas automatically
   * - 'max': use maximum available block gas limit
   * - number/bigint: specific gas limit value
   */
  readonly gasLimit?: bigint | number | 'max' | 'auto';
  /**
   * Whether to use keep-alive for the transaction (default: true)
   */
  readonly keepAlive?: boolean;
}

type ISentMessageInBatchSuccess = Pick<ISendMessageResultSuccess, 'id' | 'response' | 'success'>;

type ISentMessageInBatch = ISentMessageInBatchSuccess | Partial<Pick<ITxResultBaseFailed, 'success' | 'error'>>;

interface IBatchSendMessageResultSuccess extends ITxResultBaseSuccess {
  /**
   * Array of message IDs in the order they were sent
   */
  readonly sentMessages: ISentMessageInBatch[];
}

type IBatchSendMessageResult = IBatchSendMessageResultSuccess | ITxResultBaseFailed;

/**
 * # Program Class
 * @param _id - The ID of the program.
 * @param _api - An instance of the GearApi class
 * @param _account - (optional) The account or address to be used for transactions.
 * @param _signerOptions - (optional) Signer options for transactions.
 */
export class BaseGearProgram {
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
  ): Promise<BaseGearProgram> {
    const program = new BaseGearProgram(programId, api, account, signerOptions);

    await program.waitForInitialization;

    return program;
  }

  private _throwOnAccountNotSet() {
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

    let continueInit = true;

    while (continueInit) {
      if (state.isNone) {
        throw new Error(`Program ${this._id} doesn't exist`);
      }

      if (state.unwrap().isExited) {
        this._id = state.unwrap().asExited.toHex();
        continue;
      }

      if (state.unwrap().isTerminated) {
        throw new Error(`Program ${this._id} has been terminated`);
      }

      continueInit = false;
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
   * @param callback - The callback function to execute when the event is triggered. Receives the inheritor ID as a parameter.
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

  /**
   * ## Sets the account to be used for submitting transactions.
   * @param account
   * @param signerOptions
   * @returns
   */
  public setAccount(account: AddressOrPair, signerOptions?: SignerOptions): BaseGearProgram {
    this._account = account;
    this._signerOptions = signerOptions;
    return this;
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
            for (const { event } of events) {
              if (eventsToBeReturned.includes(event.method)) {
                _events.push(event);
              }
              if (event.method === 'ExtrinsicSuccess') {
                resolve([true, undefined, status.asInBlock.toHex()]);
              } else if (event.method === 'ExtrinsicFailed') {
                resolve([false, this._api.getExtrinsicFailedError(event).docs, status.asInBlock.toHex()]);
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
      eventsToReturn: _events,
      error: txError,
      blockHash,
      blockNumber: blockHash ? (await this._api.blocks.getBlockNumber(blockHash)).toNumber() : undefined,
    };
  }

  public get accountAddress(): HexString {
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
    this._throwOnAccountNotSet();

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
    this._throwOnAccountNotSet();

    const {
      min_limit: minLimit,
      reserved,
      burned,
      may_be_returned: mayBeReturned,
      waited,
    } = await this._api.program.calculateGas.handle(this.accountAddress, this._id, payload, value, allowOtherPanics);

    return {
      minLimit: minLimit.toBigInt(),
      reserved: reserved.toBigInt(),
      burned: burned.toBigInt(),
      mayBeReturned: mayBeReturned.toBigInt(),
      waited: waited.isTrue,
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
    this._throwOnAccountNotSet();

    const reply = await this._api.message.calculateReply({
      payload,
      origin: this.accountAddress,
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

  /**
   * ## Sends a message to the program.
   * @param params - Message parameters object containing:
   * @param params.payload - The payload to send, as a HexString or Uint8Array.
   * @param params.value - The value to send with the message (default is 0).
   * @param params.gasLimit - The gas limit for the message ('max', 'auto', or a specific value). If 'auto', it will be calculated automatically.
   * @param params.keepAlive - Whether to use keep-alive for the transaction (default is true).
   * @returns Promise resolving to the message sending result.
   */
  public sendMessage({ payload, value, gasLimit, keepAlive }: ISendMessageParams): Promise<ISendMessageResult>;

  /**
   * @deprecated - use sendMessage with ISendMessageParams instead
   */
  public sendMessage(
    payload: HexString | Uint8Array,
    value?: bigint | number,
    gasLimit?: bigint | number | 'max' | 'auto',
    keepAlive?: boolean,
  ): Promise<ISendMessageResult>;

  public async sendMessage(
    paramsOrPayload: ISendMessageParams | HexString | Uint8Array,
    value?: bigint | number,
    gasLimit?: bigint | number | 'max' | 'auto',
    keepAlive?: boolean,
  ): Promise<ISendMessageResult> {
    await this.waitForInitialization;
    this._throwOnAccountNotSet();

    const isPayloadDirect = typeof paramsOrPayload === 'string' || paramsOrPayload instanceof Uint8Array;

    const _payload = isPayloadDirect ? paramsOrPayload : paramsOrPayload.payload;
    const _value = (isPayloadDirect ? value : paramsOrPayload.value) ?? 0;
    const _keepAlive = (isPayloadDirect ? keepAlive : paramsOrPayload.keepAlive) ?? true;
    let _gasLimit = (isPayloadDirect ? gasLimit : paramsOrPayload.gasLimit) ?? 'auto';

    _gasLimit = await this._resolveGasLimit(_payload, _value, gasLimit, _keepAlive);

    const tx = this._api.tx.gear.sendMessage(this._id, _payload, _gasLimit, _value, _keepAlive);

    const txResult = await this._submitTx(tx, ['MessageQueued']);

    if (txResult.success === true) {
      const messageQueuedEvent = txResult.eventsToReturn[0];
      let msgId: HexString;

      if (messageQueuedEvent) {
        msgId = messageQueuedEvent.data[0].toHex();
      } else {
        throw new Error('MessageQueued event not found in transaction result');
      }

      return {
        success: true,
        txHash: txResult.txHash,
        blockHash: txResult.blockHash,
        blockNumber: txResult.blockNumber,
        id: msgId,
        response: this._waitForResponseHandler(msgId, txResult.blockNumber).bind(this),
      };
    } else {
      return {
        success: false,
        error: txResult.error,
        txHash: txResult.txHash,
        blockHash: txResult.blockHash,
        blockNumber: txResult.blockNumber,
      };
    }
  }

  /**
   * ## Sends multiple messages to the program in a single batch transaction.
   * @param messages - Array of message parameter objects to send in batch. Each object follows the ISendMessageParams interface.
   * @returns Transaction result with message IDs and their individual success status.
   */
  public async sendBatchMessages(messages: ISendMessageParams[]): Promise<IBatchSendMessageResult> {
    await this.waitForInitialization;
    this._throwOnAccountNotSet();

    const txs = await Promise.all(
      messages.map(async ({ payload, value = 0, gasLimit = 'auto', keepAlive = true }) => {
        const resolvedGasLimit = await this._resolveGasLimit(payload, value, gasLimit, keepAlive);
        return this._api.tx.gear.sendMessage(this._id, payload, resolvedGasLimit, value, keepAlive);
      }),
    );

    const batchTx = this._api.tx.utility.batchAll(txs);

    const txResult = await this._submitTx(batchTx, ['MessageQueued', 'ItemCompleted', 'ItemFailed']);

    let sentMessages: ISentMessageInBatch[] = [];

    if (txResult.success === true) {
      const mqEvents = txResult.eventsToReturn.filter(({ method }) => method == 'MessageQueued');
      if (mqEvents.length == messages.length) {
        sentMessages = mqEvents.map((event: MessageQueued) => {
          const id = event.data.id.toHex();
          return {
            success: true,
            id,
            response: this._waitForResponseHandler(id, txResult.blockNumber).bind(this),
          };
        });
      } else {
        const statusEvents = txResult.eventsToReturn.filter(
          ({ method }) => method === 'ItemCompleted' || method === 'ItemFailed',
        );
        const mqEvents = txResult.eventsToReturn.filter(({ method }) => method === 'MessageQueued') as MessageQueued[];
        let mqIndex = 0;

        for (let i = 0; i < messages.length; i++) {
          const statusEvent = statusEvents[i];
          if (statusEvent.method === 'ItemCompleted') {
            const id = mqEvents[mqIndex].data.id.toHex();
            sentMessages.push({
              success: true,
              id,
              response: this._waitForResponseHandler(id, txResult.blockNumber).bind(this),
            });
            mqIndex++;
          } else {
            sentMessages.push({
              success: false,
              error: this._api.getExtrinsicFailedError(statusEvent).docs,
            });
          }
        }
      }
      return {
        success: true,
        txHash: txResult.txHash,
        blockHash: txResult.blockHash,
        blockNumber: txResult.blockNumber,
        sentMessages,
      };
    } else {
      return {
        success: false,
        error: txResult.error,
        txHash: txResult.txHash,
        blockHash: txResult.blockHash,
        blockNumber: txResult.blockNumber,
      };
    }
  }

  private _waitForResponseHandler(id: HexString, blockNumber: number) {
    return async () => {
      const {
        data: { message },
      } = await this._api.message.getReplyEvent(this._id, id, blockNumber);

      return {
        id: message.id.toHex(),
        payload: message.payload.toHex(),
        value: message.value.toBigInt(),
        replyCode: new ReplyCode(message.details.unwrap().code.toU8a(), this._api.specVersion),
      };
    };
  }

  /**
   * Resolves the gas limit based on the provided value or calculates it if needed.
   * @param payload - The message payload.
   * @param value - The value to send with the message.
   * @param gasLimit - The requested gas limit or 'auto'/'max' option.
   * @param keepAlive - Whether the message uses keep-alive semantics.
   * @returns Resolved gas limit as a bigint.
   * @private
   */
  private async _resolveGasLimit(
    payload: HexString | Uint8Array,
    value: bigint | number,
    gasLimit?: bigint | number | 'max' | 'auto',
    keepAlive?: boolean,
  ): Promise<bigint> {
    try {
      if (gasLimit === 'max') {
        return this._api.blockGasLimit.toBigInt();
      } else if (!gasLimit || gasLimit === 'auto') {
        const gas = await this.calculateGas(payload, value, keepAlive);
        return gas.minLimit;
      } else {
        try {
          return BigInt(gasLimit);
        } catch (_) {
          throw new Error(`Invalid gas limit value: ${gasLimit}`);
        }
      }
    } catch (error) {
      throw new Error(`Failed to resolve gas limit: ${error.message}`);
    }
  }
}

/**
 * @deprecated - use BaseGearProgram instead
 */
export class Program extends BaseGearProgram {}
