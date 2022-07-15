import { Codec } from '@polkadot/types-codec/types';
import { H256 } from '@polkadot/types/interfaces';
import { u32 } from '@polkadot/types';

export interface CodeMetadata extends Codec {
  author: H256,
  blockNumber: u32
}