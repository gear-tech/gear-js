import { GearType, Metadata } from './interfaces';
import { SendMessageError } from './errors';
import { Bytes } from '@polkadot/types';
import { H256 } from '@polkadot/types/interfaces';
import { AnyNumber } from '@polkadot/types/types';
import { GearTransaction } from './types/Transaction';

export class GearMessage extends GearTransaction {
  submit(
    message: { destination: string | H256; payload: string | GearType; gasLimit: AnyNumber; value?: AnyNumber },
    meta: Metadata,
    messageType?: string,
  ): any {
    let payload: Bytes | Uint8Array | string;

    payload = this.createType.encode(messageType || meta.handle_input, message.payload, meta);

    try {
      this.submitted = this.api.tx.gear.sendMessage(message.destination, payload, message.gasLimit, message.value || 0);
      return this.submitted;
    } catch (error) {
      throw new SendMessageError();
    }
  }
}
