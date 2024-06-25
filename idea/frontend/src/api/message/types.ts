import { HexString } from '@gear-js/api';

import { Message } from '@/features/message';

type MessagePaginationModel = {
  count: number;
  messages: Message[];
  programNames?: Record<HexString, string>;
};

export type { MessagePaginationModel };
