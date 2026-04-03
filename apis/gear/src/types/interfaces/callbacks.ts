import type { Balance, Header } from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';

export type IBlocksCallback = (event: Header) => void | Promise<void>;

export type IBalanceCallback = (event: Balance) => void | Promise<void>;

export type TransactionStatusCb = (result: ISubmittableResult, extra: undefined) => void | Promise<void>;
