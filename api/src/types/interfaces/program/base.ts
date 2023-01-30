import { BTreeMap, BTreeSet, Enum, Map, u32 } from '@polkadot/types';
import { Hash } from '@polkadot/types/interfaces';

import { CodeId, MessageId, ProgramId } from '../ids';
import { DispatchKind } from '../message';
import { GasReservationSlot } from '../gas';
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
  pagesWithData: BTreeSet<u32>;
  gasReservationMap: BTreeMap<Hash, GasReservationSlot>;
  codeHash: CodeId;
  codeLengthBytes: u32;
  codeExports: BTreeSet<DispatchKind>;
  staticPages: WasmPageNumber;
  state: IProgramState;
}

export interface IProgramState {
  isUninitialized: boolean;
  asUninitialized: { messageId: MessageId };
  isInitialized: boolean;
  asInitialized: null;
}
