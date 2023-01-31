import { H256 } from '@polkadot/types/interfaces';
import { HexString } from '@polkadot/util/types';

import { GasLimit, Value } from '../../common';
import { PayloadType } from '../../payload';

export interface IMessageSendOptions {
  destination: HexString | H256;
  payload: PayloadType;
  gasLimit: GasLimit;
  value?: Value;
}

export interface IMessageSendReplyOptions extends Omit<IMessageSendOptions, 'destination'> {
  replyToId: HexString;
}
