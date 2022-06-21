import { GenericEventData, GenericEvent } from '@polkadot/types';
import { Event } from '@polkadot/types/interfaces';
import {
  CodeChangedData,
  DebugData,
  MessageEnqueuedData,
  MessagesDispatchedData,
  MessageWaitedData,
  ProgramChangedData,
  TransferData,
  UserMessageReadData,
  UserMessageSentData,
  DebugModeData,
  MessageWakenData,
} from './GearEventData';

export interface GearEvent<D extends GenericEventData> extends GenericEvent {
  data: D;
}

export interface MessageEnqueued extends GearEvent<MessageEnqueuedData> {}

export interface UserMessageSent extends GearEvent<UserMessageSentData> {}

export interface UserMessageRead extends GearEvent<UserMessageReadData> {}

export interface MessagesDispatched extends GearEvent<MessagesDispatchedData> {}

export interface MessageWaited extends GearEvent<MessageWaitedData> {}

export interface MessageWaken extends GearEvent<MessageWakenData> {}

export interface CodeChanged extends GearEvent<CodeChangedData> {}

export interface ProgramChanged extends GearEvent<ProgramChangedData> {}

export interface DebugDataSnapshot extends GearEvent<DebugData> {}

export interface DebugMode extends GearEvent<DebugModeData> {}

export class Transfer extends GenericEvent {
  constructor(event: Event) {
    super(event.registry, event.toU8a());
  }

  public get data(): TransferData {
    return new TransferData(this.get('data') as GenericEventData);
  }
}
