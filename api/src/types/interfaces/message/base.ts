import { Enum, u8, u32, u64, u128, i32, Option, Vec, Struct, BTreeMap, BTreeSet } from '@polkadot/types';
import { AccountId32 } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';

import { MessageId, ProgramId } from '../ids';
import { DispatchKind } from './entry';

export type StatusCode = i32;

export type Payload = Vec<u8>;

export interface ReplyDetails extends Struct {
  replyTo: MessageId;
  statusCode: StatusCode;
}

export interface SignalDetails extends Struct {
  from: MessageId;
  statusCode: StatusCode;
}

export interface MessageDetails extends Enum {
  isReply: boolean;
  asReply: ReplyDetails;
  isSignal: boolean;
  asSignal: SignalDetails;
}

export interface Message extends Codec {
  id: MessageId;
  source: ProgramId;
  destination: AccountId32;
  payload: Vec<u8>;
  gas_limit: u64;
  value: u128;
  details: Option<MessageDetails>;
}

export type UserMessageSentMessage = Omit<Message, 'gas_limit'>;

export type StoredMessage = Omit<Message, 'gas_limit'>;

export interface ContextStore extends Struct {
  outgoing: BTreeMap<u32, Option<Payload>>;
  reply: Option<Payload>;
  initialized: BTreeSet<ProgramId>;
  awaken: BTreeSet<MessageId>;
  reply_sent: boolean;
}

export interface StoredDispatch extends Struct {
  kind: DispatchKind;
  message: StoredMessage;
  context: Option<ContextStore>;
}

export interface Interval<T extends Codec> extends Struct {
  start: T;
  finish: T;
}
