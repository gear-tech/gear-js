import { u8, u32, u64, BTreeMap, Vec } from '@polkadot/types';
import { H256 } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';
export interface ProgramDetails extends Codec {
  id: H256;
  static_pages: u32;
  persistent_pages: BTreeMap<u32, Vec<u8>>;
  code_hash: H256;
  nonce: u64;
}
