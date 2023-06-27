import { HexString } from '@polkadot/util/types';

import { GasLimit, Value } from '../../common';
import { PayloadType } from '../../payload';

export interface IMessageSendOptions {
  destination: HexString;
  payload: PayloadType;
  gasLimit: GasLimit;
  value?: Value;
}

export interface IMessageSendWithVoucherOptions extends IMessageSendOptions {
  account: HexString;
}

export interface IMessageSendReplyOptions extends Omit<IMessageSendOptions, 'destination'> {
  replyToId: HexString;
}

export interface IMessageSendReplyWithVoucherOptions extends IMessageSendReplyOptions {
  account: HexString;
}
