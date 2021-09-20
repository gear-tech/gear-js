import { GearType } from '.';
import { Bytes, u64 } from '@polkadot/types';
import { BalanceOf, H256 } from '@polkadot/types/interfaces';
import { AnyNumber } from '@polkadot/types/types';

export type Message = {
  destination: H256 | string;
  payload?: Bytes | string | GearType | Uint8Array;
  gasLimit: u64 | AnyNumber;
  value?: BalanceOf | AnyNumber;
};
