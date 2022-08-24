import { Hex } from '@gear-js/api';

import { Entry } from './consts';

type MessageModel = {
  id: string;
  entry: Entry | null;
  value: string;
  source: string;
  payload: string;
  exitCode: number | null;
  timestamp: string;
  expiration: null | number;
  destination: string;
  replyToMessageId: Hex | null;
  processedWithPanic: boolean;
};

export type { MessageModel };
