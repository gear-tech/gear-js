import { GearType } from '.';
import { i32, Bytes } from '@polkadot/types';
import { H256 } from '@polkadot/types/interfaces';
import { ApiOptions } from '@polkadot/api/types';
export interface GearApiOptions extends ApiOptions {
  providerAddress?: string;
  customTypes?: GearType;
}
export interface ExitCode extends i32 {}
export declare interface MessageInfo extends Bytes {
  messageId: H256;
  programId: H256;
  origin: H256;
}
export declare type ProgramId = `0x${string}`;
