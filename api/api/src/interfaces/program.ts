import { u64 } from '@polkadot/types';
import { BalanceOf } from '@polkadot/types/interfaces';
import { AnyNumber } from '@polkadot/types/types';
import { GearType } from 'src';

export interface Program {
  code: Buffer;
  salt?: string;
  initPayload?: string | GearType;
  gasLimit: u64 | AnyNumber;
  value?: BalanceOf | AnyNumber;
}
