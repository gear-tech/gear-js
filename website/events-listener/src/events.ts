import {
  DispatchMessageEnqueuedData,
  GearApi,
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
} from '@gear-js/interfaces';

import { logger } from './logger';

const log = logger('EventListener');

type EventType =
  | 'InitMessageEnqueued'
  | 'DispatchMessageEnqueued'
  | 'Log'
  | 'InitSuccess'
  | 'InitFailure'
  | 'MessageDispatched'
  | 'DatabaseWiped';

const handleEvent = (method: EventType, data: any): { key: Keys; value: any } | null => {
  let eventData:
    | InitMessageEnqueuedData
    | DispatchMessageEnqueuedData
    | LogData
    | InitSuccessData
    | InitFailureData
    | MessageDispatchedData;

  switch (method) {
    case 'InitMessageEnqueued':
      eventData = new InitMessageEnqueuedData(data);
      return {
        key: Keys.initMessage,
        value: {
          programId: eventData.programId.toHex(),
          messageId: eventData.messageId.toHex(),
          origin: eventData.origin.toHex(),
        },
      } as AddEventKafkaPayload<Keys.initMessage, InitMessageEnqueued>;
    case 'DispatchMessageEnqueued':
      eventData = new DispatchMessageEnqueuedData(data);
      return {
        key: Keys.dispatchMessage,
        value: {
          programId: eventData.programId.toHex(),
          messageId: eventData.messageId.toHex(),
          origin: eventData.origin.toHex(),
        },
      } as AddEventKafkaPayload<Keys.dispatchMessage, DispatchMessageEnqueud>;
    case 'Log':
      eventData = new LogData(data);
      return {
        key: Keys.log,
        value: {
          id: eventData.id.toHex(),
          source: eventData.source.toHex(),
          destination: eventData.destination.toHex(),
          payload: eventData.payload.toHex(),
          replyTo: eventData.reply.isSome ? eventData.reply.unwrap()[0].toHex() : null,
          replyError: eventData.reply.isSome ? `${eventData.reply.unwrap()[1].toNumber()}` : null,
        },
      } as AddEventKafkaPayload<Keys.log, Log>;
    case 'InitSuccess':
      eventData = new InitSuccessData(data);
      return {
        key: Keys.initSuccess,
        value: {
          programId: eventData.programId.toHex(),
          messageId: eventData.messageId.toHex(),
          origin: eventData.origin.toHex(),
        },
      } as AddEventKafkaPayload<Keys.initSuccess, InitSuccess>;
    case 'InitFailure':
      eventData = new InitFailureData(data);
      return {
        key: Keys.initFailure,
        value: {
          programId: eventData.info.programId.toHex(),
          messageId: eventData.info.messageId.toHex(),
          origin: eventData.info.origin.toHex(),
        },
      } as AddEventKafkaPayload<Keys.initFailure, InitFailure>;
    case 'MessageDispatched':
      eventData = new MessageDispatchedData(data);
      return {
        key: Keys.messageDispatched,
        value: {
          messageId: eventData.messageId.toHex(),
          outcome: eventData.outcome.isFailure ? eventData.outcome.asFailure.toHuman() : 'success',
        },
      } as AddEventKafkaPayload<Keys.messageDispatched, MessageDispatched>;
    case 'DatabaseWiped':
      return {
        key: Keys.dbWiped,
        value: {},
      };
    default:
      return null;
  }
};

export const listen = (api: GearApi, genesis: string, callback: (arg: { key: string; value: any }) => void) =>
  api.query.system.events(async (events: any) => {
    const blockHash = events.createdAtHash.toHex();
    const timestamp = await api.blocks.getBlockTimestamp(blockHash);
    const base = {
      genesis,
      blockHash,
      timestamp: timestamp.toNumber(),
    };

    events.forEach(async ({ event: { data, method } }: any) => {
      try {
        const addEvent = handleEvent(method, data);
        addEvent !== null && callback({ key: addEvent.key, value: { ...addEvent.value, ...base } });
      } catch (error) {
        log.error({ method, data: data.toHuman() });
        log.error(error);
      }
    });
  });
