import {
  CodeChanged,
  DebugDataSnapshot,
  DebugMode,
  MessageQueued,
  MessageWaited,
  MessageWaken,
  MessagesDispatched,
  ProgramChanged,
  UserMessageRead,
  UserMessageSent,
} from './GearEvents';

export interface IGearEvent {
  MessageQueued: MessageQueued;
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
