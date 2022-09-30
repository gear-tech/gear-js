import { Enum, u32, u64, Map, BTreeSet } from '@polkadot/types';

import { MessageId, ProgramId } from '../ids';
import { WasmPageNumber } from './pages';

export interface IProgram extends Enum {
  isActive: boolean;
  asActive: ActiveProgram;
  isTerminated: boolean;
  asTerminated: ProgramId;
  isExited: boolean;
  asExited: ProgramId;
}

export interface ActiveProgram extends Map {
  allocations: BTreeSet<WasmPageNumber>;
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
