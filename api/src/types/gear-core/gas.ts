import { Struct, u64 } from '@polkadot/types';

export interface GasInfo extends Struct {
  min_limit: u64;
  to_send: u64;
  burned: u64;
}
