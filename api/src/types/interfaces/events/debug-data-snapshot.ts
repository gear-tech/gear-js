import { BTreeMap, Enum, Null, Option, Struct, Vec, u32, u64, u8 } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';

import { CodeId, ProgramId } from '../ids';

import { DispatchKind, Payload, StoredMessage } from '../message';

export interface PayloadStore extends Struct {
  outgoing: BTreeMap<u64, Option<Payload>>;
  new_programs: Vec<Codec>;
  reply: Option<Payload>;
  awaken: Vec<Codec>;
  reply_was_sent: boolean;
}

export declare interface QueuedDispatch extends Struct {
  kind: DispatchKind;
  message: StoredMessage;
  payload_store: Option<PayloadStore>;
}

export interface ProgramInfo extends Struct {
  staticPages: u32;
  persistentPages: BTreeMap<u32, Vec<u8>>;
  codeHash: CodeId;
}

export interface ProgramState extends Enum {
  isActive: boolean;
  asActive: ProgramInfo;
  isTerminated: boolean;
  asTerminated: Null;
}

export interface ProgramDetails extends Struct {
  id: ProgramId;
  state: ProgramState;
}
