import { HexString } from '@gear-js/api';

import { IBase } from '@/shared/types';

import { Type, EntryPoint, ReadReason } from './consts';

interface IMessage extends IBase {
  id: HexString;
  destination: HexString;
  source: HexString;
  value: string;
  payload: HexString;
  entry: EntryPoint | null;
  replyToMessageId: HexString | null;
  exitCode: number | null;
  processedWithPanic: boolean;
  type: Type;
  readReason: ReadReason | null;
  metahash?: HexString | null;
}

export type { IMessage };
