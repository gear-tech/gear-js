import { AnyJson, ISubmittableResult } from '@polkadot/types/types';
import { H256 } from '@polkadot/types/interfaces';
import { SubmittableExtrinsic } from '@polkadot/api/types';

import { Metadata, GasLimit, Value } from './types';
import { GearTransaction } from './Transaction';
import { SendReplyError } from './errors';
import { createPayload, validateGasLimit, validateValue } from './utils';

export class GearMessageReply extends GearTransaction {
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
   * api.reply.submit({
   *  replyToId: messageId,
   *  payload: 'Reply message',
   *  gasLimit: 20_000_000
   * }, undefiend, 'String')
   * api.reply.signAndSend(account, (events) => {
   *  events.forEach(({event}) => console.log(event.toHuman()))
   * })
   * ```
   */
  submit(
    message: {
      replyToId: H256 | string;
      payload: AnyJson;
      gasLimit: GasLimit;
      value?: Value;
    },
    meta?: Metadata,
    messageType?: string,
  ): SubmittableExtrinsic<'promise', ISubmittableResult> {
    validateValue(message.value, this.api);
    validateGasLimit(message.gasLimit, this.api);

    const payload = createPayload(
      this.createType,
      messageType || meta?.async_handle_input || meta?.async_init_input,
      message.payload,
      meta,
    );

    try {
      this.submitted = this.api.tx.gear.sendReply(message.replyToId, payload, message.gasLimit, message.value);
      return this.submitted;
    } catch (error) {
      throw new SendReplyError();
    }
  }
}
