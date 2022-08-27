import { IMessage } from 'entities/message';

type MessagePaginationModel = {
  count: number;
  messages: IMessage[];
};

export type { MessagePaginationModel };
