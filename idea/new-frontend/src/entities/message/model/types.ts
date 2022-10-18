import { IBase } from 'shared/types';

import { Type, EntryPoint, ReadReason } from './consts';

interface IMessage extends IBase {
  id: string;
  destination: string;
  source: string;
  value: string;
  payload: string | null;
  exitCode: number | null;
  replyToMessageId: string | null;
  processedWithPanic: boolean | null;
  entry: EntryPoint | null;
  expiration: number | null;
  type: Type | null;
  readReason: ReadReason | null;
}

export type { IMessage };
