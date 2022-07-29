import { H256 } from '@polkadot/types/interfaces';

import { GasLimit, Hex, Value } from '../../common';
import { PayloadType } from '../../payload';

export interface IMessageSendOptions {
  destination: Hex | H256;
  payload: PayloadType;
  gasLimit: GasLimit;
  value?: Value;
}

export interface IMessageSendReplyOptions extends Omit<IMessageSendOptions, 'destination'> {
  replyToId: Hex;
}
