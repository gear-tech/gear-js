import { Enum, Null } from '@polkadot/types';

import { Reason } from './common';

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
