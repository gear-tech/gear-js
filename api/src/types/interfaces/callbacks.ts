import { Balance, Header } from '@polkadot/types/interfaces';
import { ISubmittableResult } from '@polkadot/types/types';

export interface IBlocksCallback {
  (event: Header): void | Promise<void>;
}

export interface IBalanceCallback {
  (event: Balance): void | Promise<void>;
}

export type TransactionStatusCb = (result: ISubmittableResult, extra: undefined) => void | Promise<void>;
