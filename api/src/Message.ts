import { Metadata } from './types/interfaces';
import { SendMessageError } from './errors';
import { createPayload } from './utils';
import { GearTransaction } from './Transaction';
import { H256 } from '@polkadot/types/interfaces';
import { AnyNumber, ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { PayloadType } from './types';
export class GearMessage extends GearTransaction {
  /**
   * Send message
   * @param message Message parameters
   * @param meta Metadata
   * @param messageType MessageType
   * @returns Submitted result
   * ```javascript
   * const api = await GearApi.create()
   * const programId = '0xd7540ae9da85e33b47276e2cb4efc2f0b58fef1227834f21ddc8c7cb551cced6'
   * api.message.submit({
   *  destination: messageId,
   *  payload: 'Hello, World!',
   *  gasLimit: 20_000_000
   * }, undefiend, 'String')
   * api.message.signAndSend(account, (events) => {
   *  events.forEach(({event}) => console.log(event.toHuman()))
   * })
   * ```
   */
  submit(
    message: { destination: string | H256; payload: PayloadType; gasLimit: AnyNumber; value?: AnyNumber },
    meta?: Metadata,
    messageType?: string,
  ): SubmittableExtrinsic<'promise', ISubmittableResult> {
    let payload = createPayload(this.createType, messageType || meta?.handle_input, message.payload, meta);

    try {
      this.submitted = this.api.tx.gear.sendMessage(message.destination, payload, message.gasLimit, message.value || 0);
      return this.submitted;
    } catch (error) {
      throw new SendMessageError();
    }
  }
}
