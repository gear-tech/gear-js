/// <reference types="bn.js" />
import { GearApi } from '.';
import { Balance } from '@polkadot/types/interfaces';
import { KeyringPair } from '@polkadot/keyring/types';
import { BN } from '@polkadot/util';
export declare class GearBalance {
  private api;
  constructor(gearApi: GearApi);
  findOut(publicKey: string): Promise<Balance>;
  transferFromAlice(to: string, value: number | BN, eventsCallback?: (event: any, data: any) => void): Promise<any>;
  transferBalance(
    keyring: KeyringPair,
    to: string,
    value: number | BN,
    eventsCallback?: (event: any, data: any) => void,
  ): Promise<any>;
}
