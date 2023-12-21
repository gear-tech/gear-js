import {
  CodeChanged,
  MessageQueued,
  MessageWaited,
  MessageWaken,
  MessagesDispatched,
  ProgramChanged,
  ProgramResumeSessionStarted,
  UserMessageRead,
  UserMessageSent,
  VoucherIssued,
  VoucherRevoked,
  VoucherUpdated,
} from './GearEvents';

export interface IGearVoucherEvent {
  VoucherIssued: VoucherIssued;
  VoucherUpdated: VoucherUpdated;
  VoucherRevoked: VoucherRevoked;
}

export interface IGearEvent {
  MessageQueued: MessageQueued;
  UserMessageSent: UserMessageSent;
  UserMessageRead: UserMessageRead;
  MessagesDispatched: MessagesDispatched;
  MessageWaited: MessageWaited;
  MessageWaken: MessageWaken;
  CodeChanged: CodeChanged;
  ProgramChanged: ProgramChanged;
  ProgramResumeSessionStarted: ProgramResumeSessionStarted;
}
