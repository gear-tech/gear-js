import { Struct, u64 } from '@polkadot/types';

export interface GasInfo extends Struct {
  min_limit: u64;
  reserved: u64;
  burned: u64;
  may_be_returned: u64;
}
