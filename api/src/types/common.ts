import { i32 } from '@polkadot/types';
import { ISubmittableResult } from '@polkadot/types/types';

export declare type Hex = `0x${string}`;

export declare type ExitCode = i32;

export type TransactionStatusCb = (result: ISubmittableResult, extra: undefined) => void | Promise<void>;
