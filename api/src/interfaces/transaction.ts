import { AddressOrPair, SignerOptions } from '@polkadot/api/types';

export interface TransactionStatusCb {
  (data: any): void | Promise<void>;
}
