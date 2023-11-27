import { HexString } from '@polkadot/util/types';

import { GasLimit, Value } from '../../common';
import { PayloadType } from '../../payload';

export interface V1010MessageSendOptions {
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
   * A flag that indicates whether the account should be kept alive after the value is sent to the program.
   */
  keepAlive?: boolean;
  /**
   * ID of the account sending the message
   */
  account?: HexString;
}

export interface V1010MessageSendReplyOptions extends Omit<V1010MessageSendOptions, 'destination'> {
  /**
   * Message ID to which the reply is sending
   */
  replyToId: HexString;
}

export interface V1000MessageSendOptions extends Omit<V1010MessageSendOptions, 'keepAlive'> {
  /**
   * A flag that indicates whether a voucher should be used
   */
  prepaid?: boolean;
}

export interface V1000MessageSendReplyOptions extends Omit<V1010MessageSendReplyOptions, 'keepAlive'> {
  /**
   * Message ID to which the reply is sending
   */
  replyToId: HexString;
}
