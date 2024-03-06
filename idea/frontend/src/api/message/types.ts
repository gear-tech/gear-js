import { HexString } from '@gear-js/api';

import { IMessage } from '@/entities/message';

type MessagePaginationModel = {
  count: number;
  messages: IMessage[];
  programNames?: Record<HexString, string>;
};

export type { MessagePaginationModel };
