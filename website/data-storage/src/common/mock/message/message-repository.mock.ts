import { GetMessagesParams } from '@gear-js/common';

import { Message } from '../../../database/entities';
import { MESSAGE_DB_MOCK } from './message-db.mock';

export const mockMessageRepository = {
  save: jest.fn().mockImplementation((message: Message): Promise<Message> => {
    return new Promise((resolve) => resolve(message));
  }),
  listByIdAndSource: jest.fn((params: GetMessagesParams) => {
    const { limit, genesis, destination } = params;
    const messages = MESSAGE_DB_MOCK.filter((message) => {
      if (message.genesis === genesis && message.destination === destination) {
        return message;
      }
    });

    return [messages, limit];
  }),
  listByIdAndDestination: jest.fn((params: GetMessagesParams) => {
    const { genesis, source, limit } = params;
    const messages = MESSAGE_DB_MOCK.filter((message) => {
      if (message.genesis === genesis && message.source === source) {
        return message;
      }
    });
    return [messages, limit];
  }),
  listByIdAndSourceAndDestination: jest.fn((params: GetMessagesParams) => {
    const { source, destination, limit } = params;
    const messages = MESSAGE_DB_MOCK.filter((message) => {
      if (message.source === source && message.destination === destination) {
        return message;
      }
    });
    return [messages, limit];
  }),
  getByIdAndGenesis: jest.fn((id: string, genesis: string) => {
    return MESSAGE_DB_MOCK.find((message) => {
      if (message.id === id && message.genesis === genesis) {
        return message;
      }
    });
  }),
  get: jest.fn((id: string) => {
    return MESSAGE_DB_MOCK.find((message) => {
      if (message.id === id) {
        return message;
      }
    });
  }),
  listByGenesis: jest.fn((genesis: string) => {
    return MESSAGE_DB_MOCK.filter((message) => {
      if (message.genesis === genesis) {
        return message;
      }
    });
  }),
  remove: jest.fn().mockImplementation((messagesToDelete: Message[]): Promise<Message[]> => {
    return new Promise((resolve) => resolve(messagesToDelete));
  }),
};
