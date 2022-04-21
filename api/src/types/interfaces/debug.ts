import { u8, u32, Null, BTreeMap, Vec } from '@polkadot/types';
import { H256 } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';

export interface ProgramInfo extends Codec {
  staticPages: u32;
  persistentPages: BTreeMap<u32, Vec<u8>>;
  codeHash: H256;
}

export interface ProgramState extends Codec {
  isActive: boolean;
  asActive: ProgramInfo;
  isTerminated: boolean;
  asTerminated: Null;
}

export interface ProgramDetails extends Codec {
  id: H256;
  state: ProgramState;
}
