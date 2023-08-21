import { HexString } from '@polkadot/util/types';

import { GasLimit, Value } from '../../common';
import { PayloadType } from '../../payload';

export interface IMessageSendOptions {
  /**
   * The message destination
   */
  destination: HexString;
  /**
   * Payload to be sent
   */
  payload: PayloadType;
  /**
   * Maximum amount of gas the program can spend before it is halted.
   */
  gasLimit: GasLimit;
  /**
   * Balance to be transferred to the program once it's been created.
   */
  value?: Value;
  /**
   * A flag that indicates whether a voucher should be used.
   */
  prepaid?: boolean;
  /**
   * ID of the account sending the message
   */
  account?: HexString;
}

export interface IMessageSendReplyOptions extends Omit<IMessageSendOptions, 'destination'> {
  /**
   * Message ID to which the reply is sending
   */
  replyToId: HexString;
}
