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
  isReplied: boolean;
  isClaimed: boolean;
  asReplied: Null;
  asClaimed: Null;
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
  isDidNotFinishInit: boolean;
  asDidNotFinishInit: Null;
}

export interface MessageWaitedReason extends Reason<MessageWaitedRuntimeReason, MessageWaitedSystemReason> {}

export interface MessageWakenRuntimeReason extends Enum {
  isWakeCalled: boolean;
  isTimeoutBecome: boolean;
  asWakeCalled: Null;
  asTimeoutBecome: Null;
}

export interface MessageWakenSystemReason extends Enum {
  isFailedInit: boolean;
  isOutOfRent: boolean;
  asFailedInit: Null;
  asOutOfRent: Null;
}

export interface MessageWakenReason extends Reason<MessageWakenRuntimeReason, MessageWakenSystemReason> {}
