import { Metadata } from './interfaces';
import { SendMessageError } from './errors';
import { GearTransaction } from './types';
import { createPayload } from './utils';
import { H256 } from '@polkadot/types/interfaces';
import { AnyNumber } from '@polkadot/types/types';
export class GearMessage extends GearTransaction {
  submit(
    message: { destination: string | H256; payload: string | any; gasLimit: AnyNumber; value?: AnyNumber },
    meta?: Metadata,
    messageType?: string,
  ): any {
    let payload = createPayload(this.createType, messageType || meta?.handle_input, message.payload, meta);

    try {
      this.submitted = this.api.tx.gear.sendMessage(message.destination, payload, message.gasLimit, message.value || 0);
      return this.submitted;
    } catch (error) {
      throw new SendMessageError();
    }
  }
}
