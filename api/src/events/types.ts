import {
  CodeChanged,
  DebugDataSnapshot,
  DebugMode,
  MessageEnqueued,
  MessageWaited,
  MessageWaken,
  MessagesDispatched,
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
