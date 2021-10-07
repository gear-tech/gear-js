import { Vec, u64, u128, Option, u8, i32, Tuple, Bytes } from '@polkadot/types';
import { H256 } from '@polkadot/types/interfaces';

export declare interface MessageInfo extends Bytes {
  messageId: H256;
  programId: H256;
  origin: H256;
}

export declare interface InitSuccessData extends MessageInfo {}

export declare interface InitFailureData extends MessageInfo {}

export declare interface InitMessageEnqueuedData extends MessageInfo {}

export declare interface DispatchMessageEnqueuedData extends MessageInfo {}

export declare interface Reply extends Tuple {
  0: H256;
  1: i32;
}

export declare interface LogData extends Bytes {
  id: H256;
  source: H256;
  dest: H256;
  payload: Vec<u8>;
  gasLimit: u64;
  value: u128;
  reply: Option<Reply>;
}
