import { GearType } from '@gear-js/interfaces';
import { Bytes, u64 } from '@polkadot/types';
import { BalanceOf } from '@polkadot/types/interfaces';
import { AnyNumber } from '@polkadot/types/types';

export interface Program {
  code: Buffer | Bytes | string | Uint8Array;
  salt?: Bytes | string | Uint8Array;
  initPayload?: Bytes | string | GearType | Uint8Array;
  gasLimit: u64 | AnyNumber;
  value?: BalanceOf | AnyNumber;
  initInputType?: GearType | string;
}
