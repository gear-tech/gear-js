import { Hex } from '@gear-js/api';

import { Type, Entry, ReadReason } from './consts';

interface IMessage {
  id: string;
  type: Type;
  entry: Entry | null;
  value: string;
  source: string;
  genesis: string;
  payload: string;
  exitCode: number | null;
  blockHash: string;
  timestamp: string;
  readStatus: ReadReason;
  expiration: null | number;
  destination: string;
  replyToMessageId: Hex | null;
  processedWithPanic: boolean | null;
}

export type { IMessage };
