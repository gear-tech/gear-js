import {
  DispatchMessageEnqueuedData,
  InitFailureData,
  InitMessageEnqueuedData,
  InitSuccessData,
  LogData,
} from '@gear-js/api';

import { logger } from './logger';

const log = logger('EventListener');

export const listen = async (api: any, callback: (arg: any) => void) => {
  api.allEvents((events: any) => {
    events.forEach(async ({ event: { data, method } }: any) => {
      try {
        switch (method) {
          case 'InitMessageEnqueued':
            data = new InitMessageEnqueuedData(data);
            callback({
              key: 'InitMessageEnqueued',
              value: {
                programId: data.programId.toHex(),
                messageId: data.messageId.toHex(),
                origin: data.origin.toHex(),
                date: Date.now(),
              },
            });
            break;
          case 'DispatchMessageEnqueued':
            data = new DispatchMessageEnqueuedData(data);
            callback({
              key: 'DispatchMessageEnqueued',
              value: {
                programId: data.programId.toHex(),
                messageId: data.messageId.toHex(),
                origin: data.origin.toHex(),
                date: Date.now(),
              },
            });
            break;
          case 'Log':
            data = new LogData(data);
            callback({
              key: 'Log',
              value: {
                id: data.id.toHex(),
                source: data.source.toHex(),
                dest: data.dest.toHex(),
                payload: data.payload.toHex(),
                reply: {
                  isExist: data.reply.isSome,
                  id: data.reply.isSome ? data.reply.unwrap()[0].toHex() : null,
                  error: data.reply.isSome ? data.reply.unwrap()[1].toNumber() : null,
                },
                date: Date.now(),
              },
            });
            break;
          case 'InitSuccess':
            data = new InitSuccessData(data);
            callback({
              key: 'InitSuccess',
              value: {
                programId: data.programId.toHex(),
                messageId: data.messageId.toHex(),
                origin: data.origin.toHex(),
              },
            });
            break;
          case 'InitFailure':
            data = new InitFailureData(data);
            callback({
              key: 'InitFailure',
              value: {
                programId: data.info.programId.toHex(),
                messageId: data.info.messageId.toHex(),
                origin: data.info.origin.toHex(),
              },
            });
            break;
        }
      } catch (error) {
        log.error({ method, data: data.toHuman() });
        log.error(error);
      }
    });
  });
};
