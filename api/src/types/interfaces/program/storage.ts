import { H256 } from '@polkadot/types/interfaces';
import { u32 } from '@polkadot/types';

export interface PausedProgramBlockAndHash {
  blockNumber: u32;
  hash: H256;
}
