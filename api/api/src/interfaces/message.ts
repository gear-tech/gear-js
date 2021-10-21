import { u8, u64, u128, i32, Option, Vec, Tuple } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';
import { H256 } from '@polkadot/types/interfaces';
import { ExitCode } from '.';

export declare interface Reply extends Tuple {
  0: H256;
  1: ExitCode;
}

export declare interface Reply extends Tuple {
  0: H256;
  1: i32;
}
export declare interface Message extends Codec {
  id: H256;
  source: H256;
  dest: H256;
  payload: Vec<u8>;
  gas_limit: u64;
  value: u128;
  reply: Option<Reply>;
}
