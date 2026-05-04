import type { u32 } from '@polkadot/types';
import type { H256 } from '@polkadot/types/interfaces';

export interface PausedProgramBlockAndHash {
  blockNumber: u32;
  hash: H256;
}
