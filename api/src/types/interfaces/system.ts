import { BN } from '@polkadot/util';
import { Codec } from '@polkadot/types/types';

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
