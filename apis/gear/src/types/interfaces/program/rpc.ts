import { Struct, Vec } from '@polkadot/types';
import { H256 } from '@polkadot/types/interfaces';

export interface ProgramStateChange extends Struct {
  readonly block_hash: H256;
  readonly program_ids: Vec<H256>;
}
