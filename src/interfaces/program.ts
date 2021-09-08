import { GearType } from '.';
import { Bytes, u64 } from '@polkadot/types';
import { BalanceOf } from '@polkadot/types/interfaces';
import { AnyNumber } from '@polkadot/types/types';

export interface Program {
  code: Buffer;
  salt?: string;
  initPayload?: Bytes | string | GearType | Uint8Array;
  gasLimit: u64 | AnyNumber;
  value?: BalanceOf | AnyNumber;
}
