import { Struct, Vec, u128, u8 } from '@polkadot/types-codec';
import { AnyNumber } from '@polkadot/types-codec/types';
import { HexString } from '@polkadot/util/types';

import { GearCoreErrorsSimpleReplyCode } from '../../lookup';

export interface ICalculateReplyForHandleOptions {
  /** Origin of the message */
  origin: string;
  /** Destination of the message */
  destination: string;
  /** Payload of the message */
  payload: any;
  /** Gas limit of the message (optional) */
  gasLimit?: AnyNumber;
  /** Value of the message (optional) */
  value?: AnyNumber;
  /** Hash of the block at wich rpc call should be executed */
  at?: HexString;
}

/** The struct contains results of `calculateReplyForHandle` RPC call. */
export interface ReplyInfo extends Struct {
  /** Payload of the reply. */
  payload: Vec<u8>;
  /** Value sent with reply. */
  value: u128;
  /** Reply code of the reply. */
  code: GearCoreErrorsSimpleReplyCode;
}
