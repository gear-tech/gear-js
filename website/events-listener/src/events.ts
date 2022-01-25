import {
  DispatchMessageEnqueuedData,
  InitFailureData,
  InitMessageEnqueuedData,
  InitSuccessData,
  LogData,
  MessageDispatchedData,
} from '@gear-js/api';

import { logger } from './logger';

const log = logger('EventListener');

export const listen = async (api: any, callback: (arg: { key: string; value: any }) => void) => {
  api.allEvents((events: any) => {
    events.forEach(async ({ event: { data, method } }: any) => {
      let eventData:
        | InitMessageEnqueuedData
        | DispatchMessageEnqueuedData
        | LogData
        | InitSuccessData
        | InitFailureData
        | MessageDispatchedData;
      try {
        switch (method) {
          case 'InitMessageEnqueued':
            eventData = new InitMessageEnqueuedData(data) as InitMessageEnqueuedData;
            callback({
              key: 'InitMessageEnqueued',
              value: {
                programId: eventData.programId.toHex(),
                messageId: eventData.messageId.toHex(),
                origin: eventData.origin.toHex(),
                date: Date.now(),
              },
            });
            break;
          case 'DispatchMessageEnqueued':
            eventData = new DispatchMessageEnqueuedData(data);
            callback({
              key: 'DispatchMessageEnqueued',
              value: {
                programId: eventData.programId.toHex(),
                messageId: eventData.messageId.toHex(),
                origin: eventData.origin.toHex(),
                date: Date.now(),
              },
            });
            break;
          case 'Log':
            eventData = new LogData(data);
            callback({
              key: 'Log',
              value: {
                id: eventData.id.toHex(),
                source: eventData.source.toHex(),
                dest: eventData.dest.toHex(),
                payload: eventData.payload.toHex(),
                reply: {
                  isExist: eventData.reply.isSome,
                  id: eventData.reply.isSome ? eventData.reply.unwrap()[0].toHex() : null,
                  error: eventData.reply.isSome ? eventData.reply.unwrap()[1].toNumber() : null,
                },
                date: Date.now(),
              },
            });
            break;
          case 'InitSuccess':
            eventData = new InitSuccessData(data);
            callback({
              key: 'InitSuccess',
              value: {
                programId: eventData.programId.toHex(),
                messageId: eventData.messageId.toHex(),
                origin: eventData.origin.toHex(),
              },
            });
            break;
          case 'InitFailure':
            eventData = new InitFailureData(data);
            callback({
              key: 'InitFailure',
              value: {
                programId: eventData.info.programId.toHex(),
                messageId: eventData.info.messageId.toHex(),
                origin: eventData.info.origin.toHex(),
              },
            });
            break;
          case 'MessageDispatched':
            eventData = new MessageDispatchedData(data);
            callback({
              key: 'MessageDispatched',
              value: {
                messageId: eventData.messageId.toHex(),
                outcome: eventData.outcome.isFailure ? eventData.outcome.asFailure.toHuman() : 'success',
              },
            });
        }
      } catch (error) {
        log.error({ method, data: data.toHuman() });
        log.error(error);
      }
    });
  });
};
