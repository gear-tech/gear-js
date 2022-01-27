import {
  DispatchMessageEnqueuedData,
  InitFailureData,
  InitMessageEnqueuedData,
  InitSuccessData,
  LogData,
  MessageDispatchedData,
} from '@gear-js/api';
import {
  AddEventKafkaPayload,
  DispatchMessageEnqueud,
  InitFailure,
  InitMessageEnqueued,
  InitSuccess,
  Keys,
  Log,
  MessageDispatched,
} from '@gear-js/backend-interfaces';

import { logger } from './logger';

const log = logger('EventListener');

export const listen = async (api: any, genesis: string, callback: (arg: { key: string; value: any }) => void) => {
  api.allEvents((events: any) => {
    const base = {
      genesis,
      blockHash: events.createdAtHash.toHex(),
      timestamp: Date.now(),
    };

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
              key: Keys.initMessage,
              value: {
                ...base,
                programId: eventData.programId.toHex(),
                messageId: eventData.messageId.toHex(),
                origin: eventData.origin.toHex(),
              },
            } as AddEventKafkaPayload<Keys.initMessage, InitMessageEnqueued>);
            break;
          case 'DispatchMessageEnqueued':
            eventData = new DispatchMessageEnqueuedData(data);
            callback({
              key: Keys.dispatchMessage,
              value: {
                ...base,
                programId: eventData.programId.toHex(),
                messageId: eventData.messageId.toHex(),
                origin: eventData.origin.toHex(),
              },
            } as AddEventKafkaPayload<Keys.dispatchMessage, DispatchMessageEnqueud>);
            break;
          case 'Log':
            eventData = new LogData(data);
            callback({
              key: Keys.log,
              value: {
                ...base,
                id: eventData.id.toHex(),
                source: eventData.source.toHex(),
                destination: eventData.dest.toHex(),
                payload: eventData.payload.toHex(),
                replyTo: eventData.reply.isSome ? eventData.reply.unwrap()[0].toHex() : null,
                replyError: eventData.reply.isSome ? `${eventData.reply.unwrap()[1].toNumber()}` : null,
              },
            } as AddEventKafkaPayload<Keys.log, Log>);
            break;
          case 'InitSuccess':
            eventData = new InitSuccessData(data);
            callback({
              key: Keys.initSuccess,
              value: {
                ...base,
                programId: eventData.programId.toHex(),
                messageId: eventData.messageId.toHex(),
                origin: eventData.origin.toHex(),
              },
            } as AddEventKafkaPayload<Keys.initSuccess, InitSuccess>);
            break;
          case 'InitFailure':
            eventData = new InitFailureData(data);
            callback({
              key: Keys.initFailure,
              value: {
                ...base,
                programId: eventData.info.programId.toHex(),
                messageId: eventData.info.messageId.toHex(),
                origin: eventData.info.origin.toHex(),
              },
            } as AddEventKafkaPayload<Keys.initFailure, InitFailure>);
            break;
          case 'MessageDispatched':
            eventData = new MessageDispatchedData(data);
            callback({
              key: Keys.messageDispatched,
              value: {
                ...base,
                messageId: eventData.messageId.toHex(),
                outcome: eventData.outcome.isFailure ? eventData.outcome.asFailure.toHuman() : 'success',
              },
            } as AddEventKafkaPayload<Keys.messageDispatched, MessageDispatched>);
            break;
        }
      } catch (error) {
        log.error({ method, data: data.toHuman() });
        log.error(error);
      }
    });
  });
};
