import { GenericEvent, GenericEventData } from '@polkadot/types';

import {
  CodeChangedData,
  MessageQueuedData,
  MessageWaitedData,
  MessageWakenData,
  MessagesDispatchedData,
  ProgramChangedData,
  ProgramResumeSessionStartedData,
  TransferData,
  UserMessageReadData,
  UserMessageSentData,
  VoucherIssuedData,
} from './GearEventData';

export interface GearEvent<D extends GenericEventData> extends GenericEvent {
  data: D;
}

export type MessageQueued = GearEvent<MessageQueuedData>;

export type UserMessageSent = GearEvent<UserMessageSentData>;

export type UserMessageRead = GearEvent<UserMessageReadData>;

export type MessagesDispatched = GearEvent<MessagesDispatchedData>;

export type MessageWaited = GearEvent<MessageWaitedData>;

export type MessageWaken = GearEvent<MessageWakenData>;

export type CodeChanged = GearEvent<CodeChangedData>;

export type ProgramChanged = GearEvent<ProgramChangedData>;

export type Transfer = GearEvent<TransferData>;

export type ProgramResumeSessionStarted = GearEvent<ProgramResumeSessionStartedData>;

export type VoucherIssued = GearEvent<VoucherIssuedData>;
