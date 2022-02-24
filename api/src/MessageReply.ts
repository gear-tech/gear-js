import { GearApi } from './GearApi';
import { CreateType } from './create-type';
import { createPayload } from './utils';
import { Metadata } from './interfaces';
import { SendReplyError } from './errors';
import { u64 } from '@polkadot/types';
import { AnyNumber } from '@polkadot/types/types';
import { H256, BalanceOf } from '@polkadot/types/interfaces';

export class GearMessageReply {
  private api: GearApi;
  private createType: CreateType;
  reply: any;

  constructor(gearApi: GearApi) {
    this.api = gearApi;
    this.createType = new CreateType(gearApi);
  }

  /**
   * Sends reply message
   * @param message Message paramters
   * @param meta Metadata
   * @param messageType MessageType
   * @returns Submitted result
   * @example
   * ```javascript
   * const api = await GearApi.create()
   * const messageId = '0xd7540ae9da85e33b47276e2cb4efc2f0b58fef1227834f21ddc8c7cb551cced6'
   * api.reply.submit({
   *  toId: messageId,
   *  payload: 'Reply message',
   *  gasLimit: 20_000_000
   * }, undefiend, 'String')
   * api.reply.signAndSend(account, (events) => {
   *  events.forEach(({event}) => console.log(event.toHuman()))
   * })
   * ```
   */
  submitReply(
    message: {
      toId: H256 | string;
      payload: string | any;
      gasLimit: u64 | AnyNumber;
      value?: BalanceOf | AnyNumber;
    },
    meta?: Metadata,
    messageType?: string,
  ) {
    let payload = createPayload(this.createType, messageType || meta?.async_handle_input, message.payload, meta);

    try {
      this.reply = this.api.tx.gear.sendReply(message.toId, payload, message.gasLimit, message.value);
      return this.reply;
    } catch (error) {
      throw new SendReplyError();
    }
  }
}
