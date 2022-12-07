import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic, VoidFn } from '@polkadot/api/types';
import { HexString } from '@polkadot/util/types';
import { ReplaySubject } from 'rxjs';

import { IMessageSendOptions, IMessageSendReplyOptions, OldMetadata } from './types';
import { SendMessageError, SendReplyError } from './errors';
import { validateGasLimit, validateValue } from './utils';
import { encodePayload } from './utils/create-payload';
import { GearTransaction } from './Transaction';
import { UserMessageSentData } from './events';
import { ProgramMetadata, isProgramMeta } from './metadata';

export class GearMessage extends GearTransaction {
  /**
   * ## Send Message
   * @param args Message parameters
   * @param meta Program metadata obtained using `getProgramMetadata` function.
   * @param typeIndex (optional) Index of type in the registry. If not specified the type index from `meta.handle.input` will be used instead.
   * @returns Submitted result
   * ```javascript
   * const programId = '0x..';
   * const hexMeta = '0x...';
   * const meta = getProgramMetadata(hexMeta);
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
    meta?: ProgramMetadata,
    typeIndex?: number,
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;

  /**
   * @deprecated This method will ber removed as soon as we move completely to the new metadata
   */
  send(
    args: IMessageSendOptions,
    meta?: OldMetadata,
    messageType?: string,
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;

  send(
    args: IMessageSendOptions,
    hexRegistry: HexString,
    typeIndex: number,
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;

  send(
    args: IMessageSendOptions,
    metaOrHexRegistry?: ProgramMetadata | HexString | OldMetadata,
    typeIndexOrMessageType?: number | string,
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;

  /**
   * ## Send Message
   * @param message
   * @param metaOrHexRegistry Metadata
   * @param typeIndexOrMessageType type index in registry or type name
   * @returns Submitted result
   */
  send(
    { destination, value, gasLimit, ...args }: IMessageSendOptions,
    metaOrHexRegistry?: ProgramMetadata | HexString | OldMetadata,
    typeIndexOrMessageType?: number | string,
  ): SubmittableExtrinsic<'promise', ISubmittableResult> {
    validateValue(value, this._api);
    validateGasLimit(gasLimit, this._api);

    const payload = encodePayload(
      args.payload,
      metaOrHexRegistry,
      isProgramMeta(metaOrHexRegistry) ? 'handle' : 'handle_input',
      typeIndexOrMessageType,
    );

    try {
      this.extrinsic = this._api.tx.gear.sendMessage(destination, payload, gasLimit, value || 0);
      return this.extrinsic;
    } catch (error) {
      throw new SendMessageError(error.message);
    }
  }

  /**
   * Sends reply message
   * @param args Message parameters
   * @param meta Program metadata obtained using `getProgramMetadata` function.
   * @param typeIndex (optional) Index of type in the registry. If not specified the type index from `meta.reply.input` will be used instead.
   * @returns Submitted result
   * ```javascript
   * const replyToMessage = '0x..';
   * const hexMeta = '0x...';
   * const meta = getProgramMetadata(hexMeta);
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
   * @deprecated This method will ber removed as soon as we move completely to the new metadata
   */
  sendReply(
    args: IMessageSendReplyOptions,
    meta?: OldMetadata,
    messageType?: string,
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;

  sendReply(
    args: IMessageSendReplyOptions,
    hexRegistry: HexString,
    typeIndex: number,
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;

  sendReply(
    args: IMessageSendReplyOptions,
    metaOrHexRegistry?: ProgramMetadata | HexString | OldMetadata,
    typeIndexOrMessageType?: number | string,
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;

  /**
   * Sends reply message
   * @param args Message parameters
   * @param metaOrHexRegistry Metadata
   * @param typeIndexOrMessageType type index in registry or type name
   * @returns Submitted result
   */
  sendReply(
    { value, gasLimit, replyToId, ...args }: IMessageSendReplyOptions,
    metaOrHexRegistry?: ProgramMetadata | HexString | OldMetadata,
    typeIndexOrMessageType?: number | string,
  ): SubmittableExtrinsic<'promise', ISubmittableResult> {
    validateValue(value, this._api);
    validateGasLimit(gasLimit, this._api);

    const payload = encodePayload(
      args.payload,
      metaOrHexRegistry,
      isProgramMeta(metaOrHexRegistry) ? 'reply' : 'async_handle_input',
      typeIndexOrMessageType,
    );

    try {
      this.extrinsic = this._api.tx.gear.sendReply(replyToId, payload, gasLimit, value);
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
          if (data.message.details.isSome && data.message.details.unwrap().isReply) {
            const id = data.message.details.unwrap().asReply.replyTo.toHex();
            if (!messageId || id === messageId) {
              subject.next([data.message.details.unwrap().asReply.replyTo.toHex(), data]);
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
