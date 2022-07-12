import { Enum, Null } from '@polkadot/types';

import { Reason } from './common';

export interface MessageWaitedRuntimeReason extends Enum {
  isWaitCalled: boolean;
  asWaitCalled: Null;
}

export interface MessageWaitedSystemReason extends Enum {
  isProgramIsNotInitialized: boolean;
  asProgramIsNotInitialized: Null;
}

export type MessageWaitedReason = Reason<MessageWaitedRuntimeReason, MessageWaitedSystemReason>;
