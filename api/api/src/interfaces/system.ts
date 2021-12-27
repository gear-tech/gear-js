import { Codec } from '@polkadot/types/types';
import { BN } from '@polkadot/util';

export interface ISystemAccountInfo extends Codec {
  nonce: Codec;
  consumers: Codec;
  providers: Codec;
  sufficients: Codec;
  data: {
    free: BN;
    reserved: BN;
    miscFrozen: BN;
    feeFrozen: BN;
  };
}
