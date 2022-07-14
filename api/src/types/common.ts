import { AnyNumber } from '@polkadot/types/types';
import { u128, u64 } from '@polkadot/types';

export type Hex = `0x${string}`;

export type Value = AnyNumber | u128;

export type GasLimit = AnyNumber | u64;
