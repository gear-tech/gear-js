import { Bytes, u64, u128, Option, Tuple } from '@polkadot/types';

export declare type InitSuccessData = {
  messageId: Bytes;
  programId: Bytes;
  origin: Bytes;
};

export declare type InitFailureData = {
  messageId: Bytes;
  programId: Bytes;
  origin: Bytes;
};

export declare type LogData = {
  id: Bytes;
  source: Bytes;
  dest: Bytes;
  payload: Bytes;
  gasLimit: u64;
  value: u128;
  reply: Option<Tuple>;
};
