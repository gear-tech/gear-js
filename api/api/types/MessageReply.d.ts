import { GearApi } from '.';
import { Metadata } from './interfaces';
import { u64 } from '@polkadot/types';
import { AnyNumber } from '@polkadot/types/types';
import { H256, BalanceOf } from '@polkadot/types/interfaces';
import { KeyringPair } from '@polkadot/keyring/types';
export declare class GearMessageReply {
  private api;
  private createType;
  reply: any;
  constructor(gearApi: GearApi);
  submitReply(
    message: {
      toId: H256 | string;
      payload: string | any;
      gasLimit: u64 | AnyNumber;
      value?: BalanceOf | AnyNumber;
    },
    meta?: Metadata,
    messageType?: string,
  ): any;
  signAndSend(keyring: KeyringPair, callback?: (data: any) => void): Promise<any>;
}
