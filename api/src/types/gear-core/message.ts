import { Hash } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types-codec/types';
import { Null, Enum } from '@polkadot/types';
import { Reason } from './common';
import { u8, u128, Vec, Option } from '@polkadot/types';
import { Reply } from '../interfaces';
import { ProgramId } from './program';
import { UserId } from './user';

export type MessageId = Hash;
export interface UserMessageSentMessage extends Codec {
  id: MessageId;
  source: ProgramId;
  destination: UserId;
  payload: Vec<u8>;
  value: u128;
  reply: Option<Reply>;
}

export interface DispatchStatus extends Enum {
  isSuccess: boolean;
  isFailed: boolean;
  isNotExecuted: boolean;
  asSuccess: Null;
  asFailed: Null;
  asNotExecuted: Null;
}

export interface UserMessageReadRuntimeReason extends Enum {
  isMessageReplied: boolean;
  isMessageClaimed: boolean;
  asMessageReplied: Null;
  asMessageClaimed: Null;
}

export interface UserMessageReadSystemReason extends Enum {
  isOutOfRent: boolean;
  asOutOfRent: Null;
}

export type UserMessageReadReason = Reason<UserMessageReadRuntimeReason, UserMessageReadSystemReason>;

export interface MessageWaitedRuntimeReason extends Enum {
  isWaitCalled: boolean;
  asWaitCalled: Null;
}

export interface MessageWaitedSystemReason extends Enum {
  isProgramIsNotInitialized: boolean;
  asProgramIsNotInitialized: Null;
}

export type MessageWaitedReason = Reason<MessageWaitedRuntimeReason, MessageWaitedSystemReason>;

export interface MessageWokenRuntimeReason extends Enum {
  isWakeCalled: boolean;
  asWakeCalled: Null;
}

export interface MessageWokenSystemReason extends Enum {
  isProgramGotInitialized: boolean;
  isTimeoutHasCome: boolean;
  isOutOfRent: boolean;
  asProgramGotInitialized: Null;
  asTimeoutHasCome: Null;
  asOutOfRent: Null;
}

export type MessageWokenReason = Reason<MessageWokenRuntimeReason, MessageWokenSystemReason>;
