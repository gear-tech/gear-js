import { GenericEvent, GenericEventData } from '@polkadot/types';

import {
  CodeChangedData,
  DebugData,
  DebugModeData,
  MessageQueuedData,
  MessageWaitedData,
  MessageWakenData,
  MessagesDispatchedData,
  ProgramChangedData,
  TransferData,
  UserMessageReadData,
  UserMessageSentData,
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

export type DebugDataSnapshot = GearEvent<DebugData>;

export type DebugMode = GearEvent<DebugModeData>;

export type Transfer = GearEvent<TransferData>;
