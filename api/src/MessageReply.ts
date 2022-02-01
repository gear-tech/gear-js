import { GearApi } from './GearApi';
import { CreateType } from './CreateType';
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
    let payload: string = createPayload(
      this.createType,
      messageType || meta?.async_handle_input,
      message.payload,
      meta,
    );

    try {
      this.reply = this.api.tx.gear.sendReply(message.toId, payload, message.gasLimit, message.value);
      return this.reply;
    } catch (error) {
      throw new SendReplyError();
    }
  }
}
