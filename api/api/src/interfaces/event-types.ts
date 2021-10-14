import { Vec, Bytes, u8, i32, Tuple, Null } from '@polkadot/types';
import { H256 } from '@polkadot/types/interfaces';

export declare interface MessageInfo extends Bytes {
  messageId: H256;
  programId: H256;
  origin: H256;
}

export declare interface Reason extends Bytes {
  isError: Boolean;
  asError: Null;
  isValueTransfer: Boolean;
  asValueTransfer: Null;
  isDispatch: Boolean;
  asDispatch: Vec<u8>;
}

export declare interface Reply extends Tuple {
  0: H256;
  1: i32;
}
