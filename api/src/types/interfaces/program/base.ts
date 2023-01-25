import { BTreeMap, BTreeSet, Enum, Map, u32 } from '@polkadot/types';
import { Hash } from '@polkadot/types/interfaces';

import { MessageId, ProgramId } from '../ids';
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
  pages_with_data: BTreeSet<u32>;
  gas_reservation_map: BTreeMap<Hash, GasReservationSlot>;
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
