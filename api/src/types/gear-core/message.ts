import { Hash } from '@polkadot/types/interfaces';
import { Null, Enum } from '@polkadot/types';
import { Reason } from './common';

export interface MessageId extends Hash {}

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

export interface UserMessageReadReason extends Reason<UserMessageReadRuntimeReason, UserMessageReadSystemReason> {}

export interface MessageWaitedRuntimeReason extends Enum {
  isWaitCalled: boolean;
  asWaitCalled: Null;
}

export interface MessageWaitedSystemReason extends Enum {
  isProgramIsNotInitialized: boolean;
  asProgramIsNotInitialized: Null;
}

export interface MessageWaitedReason extends Reason<MessageWaitedRuntimeReason, MessageWaitedSystemReason> {}

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

export interface MessageWokenReason extends Reason<MessageWokenRuntimeReason, MessageWokenSystemReason> {}
