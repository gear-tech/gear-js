import { BTreeMap, BTreeSet, Option, Struct, Vec, u128, u32, u64, u8 } from '@polkadot/types';
import { AccountId32 } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';

import { MessageId, ProgramId } from '../ids';
import { DispatchKind } from './entry';
import { ReplyDetails } from './details';

export type Payload = Vec<u8>;

export interface UserMessage extends Struct {
  id: MessageId;
  source: ProgramId;
  destination: AccountId32;
  payload: Vec<u8>;
  gasLimit: u64;
  value: u128;
  details: Option<ReplyDetails>;
}

export type UserStoredMessage = Omit<UserMessage, 'details' | 'gasLimit'>;

export type UserMessageSentMessage = Omit<UserMessage, 'gas_limit'>;

export interface ContextStore extends Struct {
  outgoing: BTreeMap<u32, Option<Payload>>;
  reply: Option<Payload>;
  initialized: BTreeSet<ProgramId>;
  awaken: BTreeSet<MessageId>;
  reply_sent: boolean;
}

export interface StoredDispatch extends Struct {
  kind: DispatchKind;
  message: UserStoredMessage;
  context: Option<ContextStore>;
}

export interface Interval<T extends Codec> extends Struct {
  start: T;
  finish: T;
}
