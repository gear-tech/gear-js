import { Bytes, u64, u128, Option, Tuple } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';

export declare interface InitSuccessData extends Codec {
  messageId: Bytes;
  programId: Bytes;
  origin: Bytes;
}

export declare interface InitFailureData extends Codec {
  messageId: Bytes;
  programId: Bytes;
  origin: Bytes;
}

export declare interface LogData extends Codec {
  id: Bytes;
  source: Bytes;
  dest: Bytes;
  payload: Bytes;
  gasLimit: u64;
  value: u128;
  reply: Option<Tuple>;
}
