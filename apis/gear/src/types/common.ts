import { Struct, u128, u64, Vec } from '@polkadot/types';
import { AnyNumber } from '@polkadot/types/types';
import { H256, Perquintill } from '@polkadot/types/interfaces';

export type Value = AnyNumber | u128;

export type GasLimit = AnyNumber | u64;

export interface InflationInfo extends Struct {
  inflation: Perquintill;
  roi: Perquintill;
}

export interface Proof extends Struct {
  root: H256;
  proof: Vec<H256>;
  number_of_leaves: u64;
  leaf_index: u64;
  leaf: H256;
}
