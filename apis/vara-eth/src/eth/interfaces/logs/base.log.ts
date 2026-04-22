import type { Hash } from 'viem';

export interface LogCallbackParams<Data = undefined> {
  readonly blockNumber: bigint;
  readonly blockHash: Hash;
  readonly transactionIndex: number;
  readonly transactionHash: Hash;
  readonly data?: Data;
}
