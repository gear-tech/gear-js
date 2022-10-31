import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';

import { IMessageSendOptions, IMessageSendReplyOptions, Metadata } from './types';
import { SendMessageError, SendReplyError } from './errors';
import { validateGasLimit, validateValue } from './utils';
import { GearTransaction } from './Transaction';
import { createPayload } from './create-type';

export class GearMessage extends GearTransaction {
  /**
   * ## Send Message
   * @param message
   * @param meta Metadata
   * @param messageType MessageType
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
    message: IMessageSendOptions,
    meta?: Metadata,
    messageType?: string,
  ): SubmittableExtrinsic<'promise', ISubmittableResult> {
    validateValue(message.value, this._api);
    validateGasLimit(message.gasLimit, this._api);

    const payload = createPayload(message.payload, messageType || meta?.handle_input, meta?.types);
    try {
      this.extrinsic = this._api.tx.gear.sendMessage(
        message.destination,
        payload,
        message.gasLimit,
        message.value || 0,
      );
      return this.extrinsic;
    } catch (error) {
      throw new SendMessageError(error.message);
    }
  }

  /**
   * Sends reply message
   * @param message Message parameters
   * @param meta Metadata
   * @param messageType MessageType
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
    message: IMessageSendReplyOptions,
    meta?: Metadata,
    messageType?: string,
  ): SubmittableExtrinsic<'promise', ISubmittableResult> {
    validateValue(message.value, this._api);
    validateGasLimit(message.gasLimit, this._api);

    const payload = createPayload(
      message.payload,
      messageType || meta?.async_handle_input || meta?.async_init_input,
      meta?.types,
    );

    try {
      this.extrinsic = this._api.tx.gear.sendReply(message.replyToId, payload, message.gasLimit, message.value);
      return this.extrinsic;
    } catch (error) {
      throw new SendReplyError();
    }
  }
}
