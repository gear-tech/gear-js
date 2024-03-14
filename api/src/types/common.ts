import { Struct, Vec, u128, u64, u8 } from '@polkadot/types';
import { AnyNumber } from '@polkadot/types/types';
import { GearCoreErrorsSimpleReplyCode } from './lookup';
import { Perquintill } from '@polkadot/types/interfaces';

export type Value = AnyNumber | u128;

export type GasLimit = AnyNumber | u64;

export interface InflationInfo extends Struct {
  inflation: Perquintill;
  roi: Perquintill;
}
