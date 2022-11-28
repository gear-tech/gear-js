import { Enum, Null } from '@polkadot/types';
import { MessageId } from '../ids';

export interface Entry extends Enum {
  isInit: boolean;
  isHandle: boolean;
  isReply: boolean;
  isSignal: boolean;
  asInit: Null;
  asHandle: Null;
  asReply: MessageId;
  asSignal: Null;
}

export type DispatchKind = Entry;
