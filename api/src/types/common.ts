import { u128, u64 } from '@polkadot/types';
import { AnyNumber } from '@polkadot/types/types';

export type Value = AnyNumber | u128;

export type GasLimit = AnyNumber | u64;
