import { ISubmittableResult } from '@polkadot/types/types';

export type TransactionStatusCb = (result: ISubmittableResult, extra: undefined) => void | Promise<void>;
