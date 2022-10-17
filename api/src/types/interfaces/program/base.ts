import { Enum, u32, Map, BTreeSet } from '@polkadot/types';

import { MessageId, ProgramId } from '../ids';
import { DispatchKind } from '../message';
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
  code_length_bytes: u32;
  code_exports: BTreeSet<DispatchKind>;
  static_pages: WasmPageNumber;
  state: IProgramState;
}

export interface IProgramState {
  isUninitialized: boolean;
  asUninitialized: { messageId: MessageId };
  isInitialized: boolean;
  asInitialized: null;
}
