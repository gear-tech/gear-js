import {
  CodeChangedData,
  DebugData,
  MessageEnqueuedData,
  MessagesDispatchedData,
  MessageWaitedData,
  MessageWakenData,
  ProgramChangedData,
  UserMessageReadData,
  UserMessageSentData,
} from './GearEventData';
import {
  CodeChanged,
  DebugDataSnapshot,
  DebugMode,
  MessageEnqueued,
  MessagesDispatched,
  MessageWaited,
  MessageWaken,
  ProgramChanged,
  UserMessageRead,
  UserMessageSent,
} from './GearEvents';

export interface IGearEvent {
  MessageEnqueued: MessageEnqueued;
  UserMessageSent: UserMessageSent;
  UserMessageRead: UserMessageRead;
  MessagesDispatched: MessagesDispatched;
  MessageWaited: MessageWaited;
  MessageWaken: MessageWaken;
  CodeChanged: CodeChanged;
  ProgramChanged: ProgramChanged;
  DebugDataSnapshot: DebugDataSnapshot;
  DebugMode: DebugMode;
}
