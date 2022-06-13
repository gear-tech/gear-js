import {
  GearApi,
  IGearEvent,
  MessageEnqueuedData,
  MessagesDispatchedData,
  ProgramChangedData,
  UserMessageSentData,
} from '@gear-js/api';
import { GenericEventData } from '@polkadot/types';
import {
  IMessage,
  IMessageEnqueuedData,
  IMessagesDispatchedData,
  IProgramChangedData,
  Keys,
  NewEventData,
} from '@gear-js/common';
import { eventListenerLogger } from './common/event-listener.logger';

function messageEnqueuedHandler(data: GenericEventData): NewEventData<Keys.MessageEnqueued, IMessageEnqueuedData> {
  const { id, destination, source, entry } = new MessageEnqueuedData(data);
  return {
    key: Keys.MessageEnqueued,
    value: {
      id: id.toHex(),
      destination: destination.toHex(),
      source: source.toHex(),
      entry: entry.isInit ? 'Init' : entry.isHandle ? 'Handle' : 'Reply',
    },
  };
}

function userMessageSentHandler(data: GenericEventData): NewEventData<Keys.UserMessageSent, IMessage> {
  const { id, source, destination, payload, reply } = new UserMessageSentData(data);
  return {
    key: Keys.UserMessageSent,
    value: {
      id: id.toHex(),
      source: source.toHex(),
      destination: destination.toHex(),
      payload: payload.toHex(),
      replyTo: reply.isSome ? reply.unwrap()[0].toHex() : null,
      replyError: reply.isSome ? reply.unwrap()[1].toString() : null,
    },
  };
}
function programChangedHandler(data: GenericEventData): NewEventData<Keys.ProgramChanged, IProgramChangedData> | null {
  const { id, change } = new ProgramChangedData(data);
  if (change.isActive || change.isInactive) {
    return {
      key: Keys.ProgramChanged,
      value: {
        id: id.toHex(),
        isActive: change.isActive ? true : false,
      },
    };
  }
  return null;
}

function messagesDispatchedHandler(
  data: GenericEventData,
): NewEventData<Keys.MessagesDispatched, IMessagesDispatchedData> | null {
  const { statuses } = new MessagesDispatchedData(data);
  if (statuses.size > 0) {
    return { key: Keys.MessagesDispatched, value: { statuses: statuses.toHuman() } as IMessagesDispatchedData };
  }
  return null;
}

const handleEvent = (
  method: keyof IGearEvent | 'DatabaseWiped',
  data: GenericEventData,
): { key: Keys; value: any } | null => {
  switch (method) {
    case 'MessageEnqueued':
      return messageEnqueuedHandler(data);
    case 'UserMessageSent':
      return userMessageSentHandler(data);
    case 'ProgramChanged':
      return programChangedHandler(data);
    case 'MessagesDispatched':
      return messagesDispatchedHandler(data);
    case 'DatabaseWiped':
      return {
        key: Keys.DatabaseWiped,
        value: {},
      };
    default:
      return null;
  }
};

export const listen = (api: GearApi, genesis: string, callback: (arg: { key: string; value: any }) => void) =>
  api.query.system.events(async (events) => {
    const blockHash = events.createdAtHash!.toHex();
    const timestamp = await api.blocks.getBlockTimestamp(blockHash!);
    const base = {
      genesis,
      blockHash,
      timestamp: timestamp.toNumber(),
    };

    events.forEach(async ({ event: { data, method } }) => {
      try {
        const eventData = handleEvent(method as keyof IGearEvent, data);
        eventData !== null && callback({ key: eventData.key, value: { ...eventData.value, ...base } });
      } catch (error) {
        eventListenerLogger.error({ method, data: data.toHuman() });
        eventListenerLogger.error(error);
      }
    });
  });
