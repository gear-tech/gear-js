import { MessageId, ProgramId } from './ids';
import { HumanedMessage } from './interfaces';

export type StoredDispatch = {
  kind: 'Init' | 'Handle' | 'Reply';
  message: HumanedMessage;
  context: unknown;
};

export type WaitlistItem = {
  programId?: ProgramId;
  messageId?: MessageId;
  blockNumber: number;
  storedDispatch: StoredDispatch;
};
