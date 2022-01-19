import { AddressOrPair, SignerOptions, SubmittableExtrinsic } from '@polkadot/api/types';
import { CreateType, GearApi, TransactionStatusCb } from '../';
export declare class GearTransaction {
  protected api: GearApi;
  protected createType: CreateType;
  protected method: string;
  submitted: SubmittableExtrinsic<'promise'>;
  constructor(gearApi: GearApi, method: string);
  signAndSend(account: AddressOrPair, callback: TransactionStatusCb): Promise<0>;
  signAndSend(account: AddressOrPair, options: Partial<SignerOptions>): Promise<0>;
  signAndSend(account: AddressOrPair, options: Partial<SignerOptions>, callback: TransactionStatusCb): Promise<0>;
}
