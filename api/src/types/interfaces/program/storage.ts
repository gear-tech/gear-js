import { BTreeMap, BTreeSet, Enum, Map, Tuple, u32 } from '@polkadot/types';
import { BlockNumber, H256, Hash } from '@polkadot/types/interfaces';

import { CodeId, MessageId, ProgramId } from '../ids';
import { DispatchKind } from '../message';
import { GasReservationSlot } from '../gas';
import { WasmPageNumber } from './pages';

export interface PausedProgramMapValue extends Tuple {
  0: u32;
  1: H256;
}

export interface PausedProgramBlockAndHash {
  blockNumber: u32;
  hash: H256;
}

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
  pagesWithData: BTreeSet<u32>;
  gasReservationMap: BTreeMap<Hash, GasReservationSlot>;
  codeHash: CodeId;
  codeExports: BTreeSet<DispatchKind>;
  staticPages: WasmPageNumber;
  state: IProgramState;
  expirationBlock: BlockNumber;
}

export interface IProgramState {
  isUninitialized: boolean;
  asUninitialized: { messageId: MessageId };
  isInitialized: boolean;
  asInitialized: null;
}
