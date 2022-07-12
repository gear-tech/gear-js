import { Enum, u32, u64, Map, BTreeSet } from '@polkadot/types';

import { MessageId } from '../ids';

export interface IProgram extends Enum {
  isActive: boolean;
  asActive: IActiveProgram;
  isTerminated: boolean;
  asTerminated: null;
}

export interface IActiveProgram extends Map {
  allocations: BTreeSet<u32>;
  pages_with_data: BTreeSet<u32>;
  code_hash: Uint8Array;
  nonce: u64;
  state: IProgramState;
}

export interface IProgramState {
  isUninitialized: boolean;
  asUninitialized: { messageId: MessageId };
  isInitialized: boolean;
  asInitialized: null;
}
