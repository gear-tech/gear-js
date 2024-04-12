import { SubmittableExtrinsic, UnsubscribePromise, VoidFn } from '@polkadot/api/types';
import { HexString } from '@polkadot/util/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { ReplaySubject } from 'rxjs';

import { ICalculateReplyForHandleOptions, MessageSendOptions, MessageSendReplyOptions, ReplyInfo } from './types';
import { SendMessageError, SendReplyError } from './errors';
import { UserMessageSent, UserMessageSentData } from './events';
import {
  decodeAddress,
  encodePayload,
  getExtrinsic,
  validateGasLimit,
  validateMailboxItem,
  validateValue,
} from './utils';
import { GearTransaction } from './Transaction';
import { ProgramMetadata } from './metadata';
import { SPEC_VERSION } from './consts';

export class GearMessage extends GearTransaction {
  /**
   * ## Send Message
   * @param args Message parameters.
   * @param meta Program metadata obtained using `getProgramMetadata` function.
   * @param typeIndex (optional) Index of type in the registry. If not specified the type index from `meta.handle.input` will be used instead.
   * @returns Submitable result
   *
   * _Note that parameter `prepaid` is not supported starting from `1010` runtime version._
   * @example
   * ```javascript
   * const programId = '0x..';
   * const hexMeta = '0x...';
   * const meta = ProgramMetadata.from(hexMeta);
   *
   * const tx = api.message.send({
   *   destination: programId,
   *   payload: { amazingPayload: { } },
   *   gasLimit: 20_000_000
   * }, meta, meta.handle.input)
   *
   * tx.signAndSend(account, (events) => {
   *   events.forEach(({event}) => console.log(event.toHuman()))
   * })
   * ```
   */
  send(
    args: MessageSendOptions,
    meta: ProgramMetadata,
    typeIndex?: number,
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;

  /**
   * ## Send Message
   * @param args Message parameters
   * @param hexRegistry Registry in hex format
   * @param typeIndex Index of type in the registry.
   * @returns Submitable result
   *
   * _Note that parameter `prepaid` is not supported starting from `1010` runtime version._
   * @example
   * ```javascript
   * const programId = '0x..';
   * const hexRegistry = '0x...';
   *
   * const tx = api.message.send({
   *   destination: programId,
   *   payload: { amazingPayload: { ... } },
   *   gasLimit: 20_000_000
   * }, hexRegistry, 4)
   *
   * tx.signAndSend(account, (events) => {
   *   events.forEach(({event}) => console.log(event.toHuman()))
   * })
   * ```
   */
  send(
    args: MessageSendOptions,
    hexRegistry: HexString,
    typeIndex: number,
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;

  /**
   * ## Send Message
   * @param args Message parameters
   * @param metaOrHexRegistry (optional) Registry in hex format or ProgramMetadata
   * @param typeName payload type (one of the default rust types if metadata or registry don't specified)
   * @returns Submitable result
   *
   * _Note that parameter `prepaid` is not supported starting from `1010` runtime version._
   * @example
   * ```javascript
   * const programId = '0x..';
   *
   * const tx = api.message.send({
   *   destination: programId,
   *   payload: 'PING',
   *   gasLimit: 20_000_000
   * }, undefined, 'String')
   *
   * tx.signAndSend(account, (events) => {
   *   events.forEach(({event}) => console.log(event.toHuman()))
   * })
   * ```
   */
  send(
    args: MessageSendOptions,
    metaOrHexRegistry?: ProgramMetadata | HexString,
    typeName?: string,
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;

  /**
   * ## Send Message
   * @param message
   * @param metaOrHexRegistry Metadata
   * @param typeIndexOrTypeName type index in registry or type name
   * @returns Submitable result
   */
  send(
    { destination, value, gasLimit, payload, ...rest }: MessageSendOptions,
    metaOrHexRegistry?: ProgramMetadata | HexString,
    typeIndexOrTypeName?: number | string,
  ): SubmittableExtrinsic<'promise', ISubmittableResult> {
    validateValue(value, this._api);
    validateGasLimit(gasLimit, this._api);

    const _payload = encodePayload(payload, metaOrHexRegistry, 'handle', typeIndexOrTypeName);

    try {
      const txArgs: any[] = [destination, _payload, gasLimit, value || 0];

      if (this._api.specVersion >= SPEC_VERSION.V1010) {
        txArgs.push('keepAlive' in rest ? rest.keepAlive : true);
      } else {
        txArgs.push('prepaid' in rest ? rest.prepaid : false);
      }

      this.extrinsic = getExtrinsic(this._api, 'gear', 'sendMessage', txArgs);
      return this.extrinsic;
    } catch (error) {
      throw new SendMessageError(error.message);
    }
  }

  /**
   * ## Send reply message
   * @param args Message parameters
   * @param meta Program metadata obtained using `ProgramMetadata.from` method.
   * @param typeIndex (optional) Index of type in the registry. If not specified the type index from `meta.reply.input` will be used instead.
   * @returns Submitable result
   *
   * _Note that parameter `prepaid` is not supported starting from `1010` runtime version._
   * @example
   * ```javascript
   * const replyToMessage = '0x..';
   * const hexMeta = '0x...';
   * const meta = ProgramMetadata.from(hexMeta);
   *
   * const tx = api.message.send({
   *   replyToId: replyToMessage,
   *   payload: { amazingPayload: { } },
   *   gasLimit: 20_000_000
   * }, meta, meta.reply.input)
   *
   * tx.signAndSend(account, (events) => {
   *   events.forEach(({event}) => console.log(event.toHuman()))
   * })
   * ```
   */
  sendReply(
    args: MessageSendReplyOptions,
    meta?: ProgramMetadata,
    typeIndex?: number,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>;

  /**
   * ## Send reply message
   * @param args Message parameters
   * @param hexRegistry Registry in hex format
   * @param typeIndex Index of type in the registry.
   * @returns Submitable result
   *
   * _Note that parameter `prepaid` is not supported starting from `1010` runtime version._
   * @example
   * ```javascript
   * const replyToMessage = '0x..';
   * const hexRegistry = '0x...';
   *
   * const tx = api.message.send({
   *   replyToId: replyToMessage,
   *   payload: { amazingPayload: { } },
   *   gasLimit: 20_000_000
   * }, hexRegistry, 5)
   *
   * tx.signAndSend(account, (events) => {
   *   events.forEach(({event}) => console.log(event.toHuman()))
   * })
   * ```
   */
  sendReply(
    args: MessageSendReplyOptions,
    hexRegistry: HexString,
    typeIndex: number,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>;

  /**
   * ## Send reply message
   * @param args Message parameters
   * @param metaOrHexRegistry (optional) Registry in hex format or ProgramMetadata
   * @param typeName payload type (one of the default rust types if metadata or registry don't specified)
   * @returns Submitable extrinsic
   *
   * _Note that parameter `prepaid` is not supported starting from `1010` runtime version._
   * @example
   * ```javascript
   * const replyToMessage = '0x..';
   * const hexRegistry = '0x...';
   *
   * const tx = api.message.send({
   *   replyToId: replyToMessage,
   *   payload: { amazingPayload: { } },
   *   gasLimit: 20_000_000
   * }, hexRegistry, 5)
   *
   * tx.signAndSend(account, (events) => {
   *   events.forEach(({event}) => console.log(event.toHuman()))
   * })
   * ```
   */
  sendReply(
    args: MessageSendReplyOptions,
    metaOrHexRegistry?: ProgramMetadata | HexString,
    typeName?: string,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>;

  /**
   * Sends reply message
   * @param args Message parameters
   * @param metaOrHexRegistry Metadata
   * @param typeIndexOrTypeName type index in registry or type name
   * @returns Submittable result
   */

  async sendReply(
    { value, gasLimit, replyToId, payload, account, ...rest }: MessageSendReplyOptions,
    metaOrHexRegistry?: ProgramMetadata | HexString,
    typeIndexOrTypeName?: number | string,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> {
    validateValue(value, this._api);
    validateGasLimit(gasLimit, this._api);

    if (account) {
      await validateMailboxItem(account, replyToId, this._api);
    }

    const _payload = encodePayload(payload, metaOrHexRegistry, 'reply', typeIndexOrTypeName);

    try {
      const txArgs: any[] = [replyToId, _payload, gasLimit, value || 0];

      if (this._api.specVersion >= SPEC_VERSION.V1010) {
        txArgs.push('keepAlive' in rest ? rest.keepAlive : true);
      } else {
        txArgs.push('prepaid' in rest ? rest.prepaid : false);
      }

      this.extrinsic = getExtrinsic(this._api, 'gear', 'sendReply', txArgs);
      return this.extrinsic;
    } catch (error) {
      throw new SendReplyError();
    }
  }

  /**
   * ## Get event with reply message
   * @param msgId - id of sent message
   * @param txBlock - number or hash of block where the message was sent
   * @returns UserMessageSent event
   */
  async getReplyEvent(programId: HexString, msgId: HexString | null, txBlock: HexString | number) {
    let unsub: UnsubscribePromise;

    const replyEvent = new Promise<UserMessageSent>((resolve) => {
      unsub = this._api.gearEvents.subscribeToGearEvent(
        'UserMessageSent',
        (event) => {
          if (event.data.message.source.eq(programId) === false) return;

          if (msgId === null) {
            resolve(event);
          }

          if (event.data.message.details.isSome && event.data.message.details.unwrap().to.toHex() === msgId) {
            resolve(event);
          }
        },
        txBlock,
      );
    });

    (await unsub)();

    return replyEvent;
  }

  /** @deprecated */
  listenToReplies(programId: HexString, bufferSize = 5) {
    let unsub: VoidFn;
    const subject = new ReplaySubject<[HexString, UserMessageSentData]>(bufferSize);
    let messageId: HexString;

    this._api.gearEvents
      .subscribeToGearEvent('UserMessageSent', ({ data }) => {
        if (data.message.source.eq(programId)) {
          if (data.message.details.isSome) {
            const id = data.message.details.unwrap().to.toHex();
            if (!messageId || id === messageId) {
              subject.next([data.message.details.unwrap().to.toHex(), data]);
            }
          }
        }
      })
      .then((result) => {
        unsub = result;
      });

    return (messageId: HexString): Promise<UserMessageSentData> => {
      return new Promise((resolve) => {
        subject.subscribe({
          next: ([id, data]) => {
            if (id === messageId) {
              subject.complete();
              unsub();
              resolve(data);
            }
          },
        });
      });
    };
  }

  /**
   * ## Send message to the program and get the reply.
   * This method is immutable and doesn't send any extrinsic.
   * @param params Message parameters
   * @param meta (optional) Program metadata obtained using `ProgramMetadata.from` method.
   * @param typeIndexOrTypeName (optional) Index of type in the registry. If not specified the type index from `meta.handle.input` will be used instead.
   * @returns Reply info structure
   *
   * @example
   * ```javascript
   * const programId = '0x..';
   * const origin = '0x...';
   * const meta = ProgramMetadata.from('0x...');
   * const result = await api.message.calculateReply({
   *   origin,
   *   destination: programId,
   *   payload: { myPayload: [] },
   *   value: 0
   * }, meta);
   *
   * console.log(result.toJSON());
   * console.log('reply payload:', meta.createType(meta.types.handle.output, result.payload).toJSON());
   */
  async calculateReply(
    { payload, origin, destination, value, gasLimit, at }: ICalculateReplyForHandleOptions,
    meta?: ProgramMetadata,
    typeIndexOrTypeName?: number | string,
  ): Promise<ReplyInfo> {
    const _payload = encodePayload(payload, meta, 'handle', typeIndexOrTypeName);

    return await this._api.rpc.gear.calculateReplyForHandle(
      decodeAddress(origin),
      destination,
      _payload,
      gasLimit || this._api.blockGasLimit.toBigInt(),
      value || 0,
      at || null,
    );
  }
}
