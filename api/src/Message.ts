import { SubmittableExtrinsic, VoidFn } from '@polkadot/api/types';
import { HexString } from '@polkadot/util/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { ReplaySubject } from 'rxjs';

import {
  IMessageSendOptions,
  IMessageSendReplyOptions,
  IMessageSendReplyWithVoucherOptions,
  IMessageSendWithVoucherOptions,
} from './types';
import { SendMessageError, SendReplyError } from './errors';
import { encodePayload, validateGasLimit, validateMailboxItem, validateValue, validateVoucher } from './utils';
import { GearTransaction } from './Transaction';
import { ProgramMetadata } from './metadata';
import { UserMessageSentData } from './events';

export class GearMessage extends GearTransaction {
  /**
   * ## Send Message
   * @param args Message parameters
   * @param meta Program metadata obtained using `ProgramMetadata.from` method.
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
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;

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
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;

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
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;

  /**
   * ## Send Message
   * @param message
   * @param metaOrHexRegistry Metadata
   * @param typeIndexOrTypeName type index in registry or type name
   * @returns Submitted result
   */
  send(
    { destination, value, gasLimit, ...args }: IMessageSendOptions,
    metaOrHexRegistry?: ProgramMetadata | HexString,
    typeIndexOrTypeName?: number | string,
  ): SubmittableExtrinsic<'promise', ISubmittableResult> {
    validateValue(value, this._api);
    validateGasLimit(gasLimit, this._api);

    const payload = encodePayload(args.payload, metaOrHexRegistry, 'handle', typeIndexOrTypeName);

    try {
      this.extrinsic = this._api.tx.gear.sendMessage(destination, payload, gasLimit, value || 0);
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
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;

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
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;

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
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;

  /**
   * Sends reply message
   * @param args Message parameters
   * @param metaOrHexRegistry Metadata
   * @param typeIndexOrTypeName type index in registry or type name
   * @returns Submitted result
   */
  sendReply(
    { value, gasLimit, replyToId, ...args }: IMessageSendReplyOptions,
    metaOrHexRegistry?: ProgramMetadata | HexString,
    typeIndexOrTypeName?: number | string,
  ): SubmittableExtrinsic<'promise', ISubmittableResult> {
    validateValue(value, this._api);
    validateGasLimit(gasLimit, this._api);

    const payload = encodePayload(args.payload, metaOrHexRegistry, 'reply', typeIndexOrTypeName);

    try {
      this.extrinsic = this._api.tx.gear.sendReply(replyToId, payload, gasLimit, value);
      return this.extrinsic;
    } catch (error) {
      throw new SendReplyError();
    }
  }

  /**
   * ## Send Message with Voucher
   * @param args Message parameters
   * @param meta Program metadata obtained using `ProgramMetadata.from` method.
   * @param typeIndex (optional) Index of type in the registry. If not specified the type index from `meta.handle.input` will be used instead.
   * @returns Submittable result
   * @example
   * ```javascript
   * const programId = '0x..';
   * const hexMeta = '0x...';
   * const meta = ProgramMetadata.from(hexMeta);
   * const accountId = '0x...'
   *
   * const tx = await api.message.sendWithVoucher({
   *   destination: programId,
   *   payload: { amazingPayload: { } },
   *   gasLimit: 20_000_000,
   *   account: accountId,
   * }, meta, meta.handle.input)
   *
   * tx.signAndSend(account, (events) => {
   *   events.forEach(({event}) => console.log(event.toHuman()))
   * })
   * ```
   */
  sendWithVoucher(
    args: IMessageSendWithVoucherOptions,
    meta: ProgramMetadata,
    typeIndex?: number,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>;

  /**
   * ## Send Message with Voucher
   * @param args Message parameters
   * @param hexRegistry Registry in hex format
   * @param typeIndex Index of type in the registry.
   * @returns Submitted result
   * @example
   * ```javascript
   * const programId = '0x..';
   * const hexRegistry = '0x...';
   * const accountId = '0x...'
   *
   * const tx = await api.message.sendWithVoucher({
   *   destination: programId,
   *   payload: { amazingPayload: { ... } },
   *   gasLimit: 20_000_000
   *   account: accountId,
   * }, hexRegistry, 4)
   *
   * tx.signAndSend(account, (events) => {
   *   events.forEach(({event}) => console.log(event.toHuman()))
   * })
   * ```
   */
  sendWithVoucher(
    args: IMessageSendWithVoucherOptions,
    hexRegistry: HexString,
    typeIndex: number,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>;

  /**
   * ## Send Message with Voucher
   * @param args Message parameters
   * @param metaOrHexRegistry (optional) Registry in hex format or ProgramMetadata
   * @param typeName payload type (one of the default rust types if metadata or registry don't specified)
   * @returns Submitted result
   * @example
   * ```javascript
   * const programId = '0x..';
   * const accountId = '0x...'
   *
   * const tx = await api.message.sendWithVoucher({
   *   destination: programId,
   *   payload: 'PING',
   *   gasLimit: 20_000_000,
   *   account: accountId,
   * }, undefined, 'String')
   *
   * tx.signAndSend(account, (events) => {
   *   events.forEach(({event}) => console.log(event.toHuman()))
   * })
   * ```
   */
  sendWithVoucher(
    args: IMessageSendWithVoucherOptions,
    metaOrHexRegistry?: ProgramMetadata | HexString,
    typeName?: string,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>;

  async sendWithVoucher(
    { destination, value, gasLimit, payload, account }: IMessageSendWithVoucherOptions,
    metaOrHexRegistry?: ProgramMetadata | HexString,
    typeIndexOrTypeName?: number | string,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> {
    validateValue(value, this._api);
    validateGasLimit(gasLimit, this._api);
    await validateVoucher(destination, account, this._api);

    const _payload = encodePayload(payload, metaOrHexRegistry, 'handle', typeIndexOrTypeName);

    try {
      this.extrinsic = this._api.tx.gear.sendMessageWithVoucher(destination, _payload, gasLimit, value || 0);
      return this.extrinsic;
    } catch (error) {
      throw new SendMessageError(error.message);
    }
  }

  /**
   * ### Send reply message with voucher
   * @param args Message parameters
   * @param meta Program metadata obtained using `ProgramMetadata.from` method.
   * @param typeIndex (optional) Index of type in the registry. If not specified the type index from `meta.reply.input` will be used instead.
   * @returns Submitted result
   * @example
   * ```javascript
   * const replyToMessage = '0x..';
   * const hexMeta = '0x...';
   * const meta = ProgramMetadata.from(hexMeta);
   * const accountId = '0x...'
   *
   * const tx = await api.message.sendReplyWithVoucher({
   *   replyToId: replyToMessage,
   *   payload: { amazingPayload: { } },
   *   gasLimit: 20_000_000,
   *   account: accountId,
   * }, meta, meta.reply.input)
   *
   * tx.signAndSend(account, (events) => {
   *   events.forEach(({event}) => console.log(event.toHuman()))
   * })
   * ```
   */
  sendReplyWithVoucher(
    args: IMessageSendReplyWithVoucherOptions,
    meta?: ProgramMetadata,
    typeIndex?: number,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>;

  /**
   * ### Send reply message with voucher
   * @param args Message parameters
   * @param hexRegistry Registry in hex format
   * @param typeIndex Index of type in the registry.
   * @returns Submitted result
   * @example
   * ```javascript
   * const replyToMessage = '0x..';
   * const hexRegistry = '0x...';
   * const accountId = '0x...'
   *
   * const tx = await api.message.sendReplyWithVoucher({
   *   replyToId: replyToMessage,
   *   payload: { amazingPayload: { } },
   *   gasLimit: 20_000_000,
   *   account: accountId,
   * }, hexRegistry, 5)
   *
   * tx.signAndSend(account, (events) => {
   *   events.forEach(({event}) => console.log(event.toHuman()))
   * })
   * ```
   */
  sendReplyWithVoucher(
    args: IMessageSendReplyWithVoucherOptions,
    hexRegistry: HexString,
    typeIndex: number,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>;

  /**
   * ### Send reply message with voucher
   * @param args Message parameters
   * @param metaOrHexRegistry (optional) Registry in hex format or ProgramMetadata
   * @param typeName payload type (one of the default rust types if metadata or registry don't specified)
   * @returns Submitted result
   * @example
   * ```javascript
   * const replyToMessage = '0x..';
   * const hexRegistry = '0x...';
   * const accountId = '0x...'
   *
   * const tx = await api.message.sendReplyWithVoucher({
   *   replyToId: replyToMessage,
   *   payload: { amazingPayload: { } },
   *   gasLimit: 20_000_000,
   *   account: accountId,
   * }, hexRegistry, 5)
   *
   * tx.signAndSend(account, (events) => {
   *   events.forEach(({event}) => console.log(event.toHuman()))
   * })
   * ```
   */
  sendReplyWithVoucher(
    args: IMessageSendReplyWithVoucherOptions,
    metaOrHexRegistry?: ProgramMetadata | HexString,
    typeName?: string,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>;

  async sendReplyWithVoucher(
    { value, gasLimit, replyToId, payload, account }: IMessageSendReplyWithVoucherOptions,
    metaOrHexRegistry?: ProgramMetadata | HexString,
    typeIndexOrTypeName?: number | string,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> {
    validateValue(value, this._api);
    validateGasLimit(gasLimit, this._api);

    const { source } = await validateMailboxItem(account, replyToId, this._api);

    await validateVoucher(source.toHex(), account, this._api);

    const _payload = encodePayload(payload, metaOrHexRegistry, 'reply', typeIndexOrTypeName);

    try {
      this.extrinsic = this._api.tx.gear.sendReplyWithVoucher(replyToId, _payload, gasLimit, value);
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
