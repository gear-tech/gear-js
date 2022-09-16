import { TypeInfoRegistry, GearApi, Hex, MessageEnqueuedData, GasInfo } from '@gear-js/api';
import { AddressOrPair, SignerOptions, SubmittableExtrinsic, VoidFn } from '@polkadot/api/types';
import { Codec, ISubmittableResult } from '@polkadot/types/types';

export interface ISignOptions {
  account: AddressOrPair;
  options?: Partial<SignerOptions>;
  statusCb?: (result: ISubmittableResult) => void | Promise<void>;
}

export class BaseMessage<PayloadType = null, ResultType = null> {
  protected _registry: TypeInfoRegistry;
  protected _payloadType?: string;
  protected _enumVariant?: string;
  protected _resultType?: string;
  protected _resultEnumVariant?: string;
  protected _payload: Hex;
  protected _programId?: Hex;
  protected _value: bigint;
  protected _gas: GasInfo;

  constructor(
    registry: TypeInfoRegistry,
    protected api: GearApi,
    options: {
      programId?: Hex;
      payloadType?: string;
      enumVariant?: string;
      resultType?: string;
      resultEnumVariant?: string;
    },
  ) {
    this._programId = options.programId;
    this._registry = registry;
    this._payloadType = options.payloadType;
    this._enumVariant = options.enumVariant;
    this._resultType = options.resultType;
    this._resultEnumVariant = options.resultEnumVariant;
  }

  protected _getReplyPayload(payload: Hex): ResultType {
    const decoded = (this._registry.createType(this._resultType!, payload) as unknown as Codec).toHuman();
    return this._resultEnumVariant ? decoded![this._resultEnumVariant] : (decoded as unknown as ResultType);
  }

  protected async _waitForMessageStatus(): Promise<(messageId: Hex) => { status: Promise<boolean>; unsub: VoidFn }> {
    let _statusResolve: (value: boolean) => void;
    let _messageId: Hex;
    const messages = new Map<Hex, boolean>();

    const unsub = await this.api.gearEvents.subscribeToGearEvent('MessagesDispatched', ({ data: { statuses } }) => {
      for (const [id, status] of statuses) {
        if (!_messageId) {
          messages.set(id.toHex(), status.isSuccess);
        } else {
          _statusResolve(status.isSuccess);
        }
      }
    });
    return (messageId: Hex) => {
      if (messages.has(messageId)) {
        return { status: Promise.resolve(messages.get(messageId)!), unsub };
      } else {
        _messageId = messageId;
        return {
          status: new Promise((resolve) => {
            _statusResolve = resolve;
          }),
          unsub,
        };
      }
    };
  }

  protected async _waitForReply(): Promise<
    (messageId: Hex) => { payloadAndExitCode: Promise<[string, number]>; unsub: VoidFn }
  > {
    const messages = new Map<Hex, [string, number]>();

    let _payloadResolve: (value: [string, number]) => void;
    let _messageId: Hex;

    const unsub = await this.api.gearEvents.subscribeToUserMessageSentByActor({ from: this._programId }, (event) => {
      const {
        data: {
          message: { reply, payload },
        },
      } = event;
      if (reply.isSome) {
        const exitCode = reply.unwrap().exitCode;
        if (_messageId && reply.unwrap().replyTo.eq(_messageId)) {
          _payloadResolve([exitCode.eq(0) ? payload.toHex() : (payload.toHuman() as string), exitCode.toNumber()]);
        } else {
          messages.set(reply.unwrap().replyTo.toHex(), [payload.toHex(), exitCode.toNumber()]);
        }
      }
    });
    return (messageId) => {
      if (messages.has(messageId)) {
        return { payloadAndExitCode: Promise.resolve(messages.get(messageId)!), unsub };
      } else {
        _messageId = messageId;
        return {
          payloadAndExitCode: new Promise((resolve) => {
            _payloadResolve = resolve;
          }),
          unsub,
        };
      }
    };
  }

  protected _sendTransaction(
    extrinsic: SubmittableExtrinsic<'promise', ISubmittableResult>,
    signOptions: ISignOptions,
  ): Promise<Hex> {
    return new Promise((resolve, reject) =>
      extrinsic.signAndSend(signOptions.account, signOptions.options!, (result: ISubmittableResult) => {
        signOptions.statusCb && signOptions.statusCb(result);
        result.events.forEach(({ event }) => {
          const { method, data } = event;
          if (method === 'MessageEnqueued') {
            resolve((data as MessageEnqueuedData).id.toHex());
          } else if (method === 'ExtrinsicFailed') {
            reject(this.api.getExtrinsicFailedError(event));
          }
        });
      }),
    );
  }

  public payload(value: PayloadType) {
    const _payload = this._enumVariant ? { [this._enumVariant]: value } : value;
    this._payload = this._payloadType
      ? (this._registry.createType(this._payloadType, _payload) as unknown as Codec).toHex()
      : (value as unknown as Hex);
    return this;
  }

  public setProgramId(id: Hex) {
    this._programId = id;
  }
}
