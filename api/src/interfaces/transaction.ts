import { AddressOrPair, SignerOptions } from '@polkadot/api/types';
import { Event } from '@polkadot/types/interfaces';
import { ISubmittableResult } from '@polkadot/types/types';
// export interface TransactionStatusCb {
//   (event: Event): void | Promise<void>;
// }

export type TransactionStatusCb = (result: ISubmittableResult, extra: undefined) => void | Promise<void>;
