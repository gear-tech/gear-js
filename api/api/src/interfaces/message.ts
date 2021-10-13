import { u64 } from '@polkadot/types';
import { BalanceOf, H256 } from '@polkadot/types/interfaces';
import { AnyNumber } from '@polkadot/types/types';
import { GearType } from 'src';

export interface Message {
  destination: H256 | string;
  payload?: string | GearType;
  gasLimit: u64 | AnyNumber;
  value?: BalanceOf | AnyNumber;
}
