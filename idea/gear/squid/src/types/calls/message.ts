import { Calls } from '../../common/index.js';
import type { Call } from '../../processor.js';

export interface ASendMessage {
  destination: string;
  payload: string;
  gasLimit: string;
  value: string;
}

export type CSendMessage = Omit<Call, 'args'> & { args: ASendMessage };

export const isSendMessageCall = (obj: any): obj is CSendMessage => obj.name === Calls.SendMessage;

export interface ASendReply extends Omit<ASendMessage, 'destination'> {
  replyToId: string;
}

export type CSendReply = Omit<Call, 'args'> & { args: ASendReply };

export const isSendReplyCall = (obj: any): obj is CSendReply => obj.name === Calls.SendReply;
