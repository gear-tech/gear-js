import { GenericEvent, GenericEventData } from '@polkadot/types';

import {
  CodeChangedData,
  MessageQueuedData,
  MessagesDispatchedData,
  MessageWaitedData,
  MessageWakenData,
  ProgramChangedData,
  ProgramResumeSessionStartedData,
  TransferData,
  UserMessageReadData,
  UserMessageSentData,
  VoucherDeclinedData,
  VoucherIssuedData,
  VoucherRevokedData,
  VoucherUpdatedData,
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

export type VoucherUpdated = GearEvent<VoucherUpdatedData>;

export type VoucherRevoked = GearEvent<VoucherRevokedData>;

export type VoucherDeclined = GearEvent<VoucherDeclinedData>;
