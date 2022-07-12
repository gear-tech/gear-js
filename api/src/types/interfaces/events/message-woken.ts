import { Enum, Null } from '@polkadot/types';
import { Reason } from './common';

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
