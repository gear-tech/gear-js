import { SubmittableExtrinsic, VoidFn } from '@polkadot/api/types';
import { HexString } from '@polkadot/util/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { ReplaySubject } from 'rxjs';

import { IMessageSendOptions, IMessageSendReplyOptions } from './types';
import { SendMessageError, SendReplyError } from './errors';
import { encodePayload, validateGasLimit, validateMailboxItem, validateValue, validateVoucher } from './utils';
import { GearTransaction } from './Transaction';
import { ProgramMetadata } from './metadata';
import { UserMessageSentData } from './events';

export class GearMessage extends GearTransaction {
  /**
   * ## Send Message
   * @param args Message parameters.
   * @param meta Program metadata obtained using `getProgramMetadata` function.
   * @param typeIndex (optional) Index of type in the registry. If not specified the type index from `meta.handle.input` will be used instead.
   * @returns Submittable result
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
    args: IMessageSendOptions,
    meta: ProgramMetadata,
    typeIndex?: number,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>;

  /**
   * ## Send Message
   * @param args Message parameters
   * @param hexRegistry Registry in hex format
   * @param typeIndex Index of type in the registry.
   * @returns Submitted result
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
    args: IMessageSendOptions,
    hexRegistry: HexString,
    typeIndex: number,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>;

  /**
   * ## Send Message
   * @param args Message parameters
   * @param metaOrHexRegistry (optional) Registry in hex format or ProgramMetadata
   * @param typeName payload type (one of the default rust types if metadata or registry don't specified)
   * @returns Submitted result
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
    args: IMessageSendOptions,
    metaOrHexRegistry?: ProgramMetadata | HexString,
    typeName?: string,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>;

  /**
   * ## Send Message
   * @param message
   * @param metaOrHexRegistry Metadata
   * @param typeIndexOrTypeName type index in registry or type name
   * @returns Submitted result
   */
  async send(
    { destination, value, gasLimit, payload, prepaid, account }: IMessageSendOptions,
    metaOrHexRegistry?: ProgramMetadata | HexString,
    typeIndexOrTypeName?: number | string,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> {
    validateValue(value, this._api);
    validateGasLimit(gasLimit, this._api);

    if (prepaid && account) {
      await validateVoucher(destination, account, this._api);
    }

    const _payload = encodePayload(payload, metaOrHexRegistry, 'handle', typeIndexOrTypeName);

    try {
      this.extrinsic = this._api.tx.gear.sendMessage(destination, _payload, gasLimit, value || 0, prepaid || false);
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
   * @returns Submitted result
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
    args: IMessageSendReplyOptions,
    meta?: ProgramMetadata,
    typeIndex?: number,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>;

  /**
   * ## Send reply message
   * @param args Message parameters
   * @param hexRegistry Registry in hex format
   * @param typeIndex Index of type in the registry.
   * @returns Submitted result
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
    args: IMessageSendReplyOptions,
    hexRegistry: HexString,
    typeIndex: number,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>;

  /**
   * ## Send reply message
   * @param args Message parameters
   * @param metaOrHexRegistry (optional) Registry in hex format or ProgramMetadata
   * @param typeName payload type (one of the default rust types if metadata or registry don't specified)
   * @returns Submitted result
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
    args: IMessageSendReplyOptions,
    metaOrHexRegistry?: ProgramMetadata | HexString,
    typeName?: string,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>;

  /**
   * Sends reply message
   * @param args Message parameters
   * @param metaOrHexRegistry Metadata
   * @param typeIndexOrTypeName type index in registry or type name
   * @returns Submitted result
   */

  async sendReply(
    { value, gasLimit, replyToId, payload, prepaid, account }: IMessageSendReplyOptions,
    metaOrHexRegistry?: ProgramMetadata | HexString,
    typeIndexOrTypeName?: number | string,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> {
    validateValue(value, this._api);
    validateGasLimit(gasLimit, this._api);

    let source: HexString;
    if (account) {
      const msg = await validateMailboxItem(account, replyToId, this._api);
      source = msg.source.toHex();
    }

    if (prepaid && account && source) {
      await validateVoucher(source, account, this._api);
    }

    const _payload = encodePayload(payload, metaOrHexRegistry, 'reply', typeIndexOrTypeName);

    try {
      this.extrinsic = this._api.tx.gear.sendReply(replyToId, _payload, gasLimit, value, prepaid || false);
      return this.extrinsic;
    } catch (error) {
      throw new SendReplyError();
    }
  }

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
}
