import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { HexString } from '@polkadot/util/types';

import { HumanProgramMetadata, IMessageSendOptions, IMessageSendReplyOptions, OldMetadata } from './types';
import { SendMessageError, SendReplyError } from './errors';
import { validateGasLimit, validateValue } from './utils';
import { GearTransaction } from './Transaction';
import { encodePayload } from './create-type';
import { isProgramMeta } from './metadata';

export class GearMessage extends GearTransaction {
  send(
    args: IMessageSendOptions,
    meta?: HumanProgramMetadata,
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
    hexRegistry?: HexString,
    typeIndex?: number,
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;

  send(
    args: IMessageSendOptions,
    metaOrHexRegistry?: HumanProgramMetadata | HexString | OldMetadata,
    typeIndexOrMessageType?: number | string,
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;

  /**
   * ## Send Message
   * @param message
   * @param metaOrHexRegistry Metadata
   * @param typeIndexOrMessageType type index in registry or type name
   * @returns Submitted result
   * ```javascript
   * const api = await GearApi.create()
   * const programId = '0xd7540ae9da85e33b47276e2cb4efc2f0b58fef1227834f21ddc8c7cb551cced6'
   * const tx = api.message.send({
   *  destination: messageId,
   *  payload: 'Hello, World!',
   *  gasLimit: 20_000_000
   * }, undefiend, 'String')
   * tx.signAndSend(account, (events) => {
   *  events.forEach(({event}) => console.log(event.toHuman()))
   * })
   * ```
   */
  send(
    { destination, value, gasLimit, ...args }: IMessageSendOptions,
    metaOrHexRegistry?: HumanProgramMetadata | HexString | OldMetadata,
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

  sendReply(
    args: IMessageSendReplyOptions,
    meta?: HumanProgramMetadata,
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
    hexRegistry?: HexString,
    typeIndex?: number,
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;

  sendReply(
    args: IMessageSendReplyOptions,
    metaOrHexRegistry?: HumanProgramMetadata | HexString | OldMetadata,
    typeIndexOrMessageType?: number | string,
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;

  /**
   * Sends reply message
   * @param args Message parameters
   * @param metaOrHexRegistry Metadata
   * @param typeIndexOrMessageType type index in registry or type name
   * @returns Submitted result
   * @example
   * ```javascript
   * const api = await GearApi.create()
   * const messageId = '0xd7540ae9da85e33b47276e2cb4efc2f0b58fef1227834f21ddc8c7cb551cced6'
   * const tx = api.message.sendReply({
   *  replyToId: messageId,
   *  payload: 'Reply message',
   *  gasLimit: 20_000_000
   * }, undefiend, 'String')
   * tx.signAndSend(account, (events) => {
   *  events.forEach(({event}) => console.log(event.toHuman()))
   * })
   * ```
   */
  sendReply(
    { value, gasLimit, replyToId, ...args }: IMessageSendReplyOptions,
    metaOrHexRegistry?: HumanProgramMetadata | HexString | OldMetadata,
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
}
