import { MessageModel } from 'entities/message';

type MessagePaginationModel = {
  count: number;
  messages: MessageModel[];
};

export type { MessagePaginationModel };
