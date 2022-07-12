import { Hex } from './common';
import { HumanMessage } from './interfaces';

export type HumanStoredDispatch = {
  kind: 'Init' | 'Handle' | 'Reply';
  message: HumanMessage;
  context: unknown;
};

export type WaitlistItem = {
  programId?: Hex;
  messageId?: Hex;
  blockNumber: number;
  storedDispatch: HumanStoredDispatch;
};
