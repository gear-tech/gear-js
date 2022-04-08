import { GearType, Hex } from './gear-type';
import { i32, Bytes } from '@polkadot/types';
import { H256 } from '@polkadot/types/interfaces';
import { ApiOptions } from '@polkadot/api/types';
import { AccountId32 } from '@polkadot/types/interfaces';
export interface GearApiOptions extends ApiOptions {
  providerAddress?: string;
}

export interface ExitCode extends i32 {}

export declare interface MessageInfo extends Bytes {
  messageId: H256;
  programId: H256;
  origin: H256;
}

export declare type ProgramId = Hex | H256 | string;

export declare type MessageId = Hex;

export declare type AccountId = string | Hex;
