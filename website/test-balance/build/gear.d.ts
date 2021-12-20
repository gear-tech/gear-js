/// <reference types="bn.js" />
import { GearApi } from '@gear-js/api';
import { BN } from '@polkadot/util';
import { KeyringPair } from '@polkadot/keyring/types';
import { DbService } from './db';
export declare class GearService {
  api: GearApi;
  account: KeyringPair;
  rootAccount: KeyringPair;
  accountBalance: BN;
  balanceToTransfer: BN;
  dbService: DbService;
  constructor(dbService: DbService);
  connect(): Promise<void>;
  get genesisHash(): string;
  accountBalanceIsSmall(): Promise<boolean>;
  transferBalance(
    to: string,
    from?: KeyringPair,
    value?: BN,
  ): Promise<
    | {
        status: string;
        transferedBalance: string;
        error?: undefined;
      }
    | {
        error: any;
        status?: undefined;
        transferedBalance?: undefined;
      }
  >;
}
