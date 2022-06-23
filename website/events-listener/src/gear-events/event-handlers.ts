import {
  CodeChangedData,
  IGearEvent,
  MessageEnqueuedData,
  MessagesDispatchedData,
  ProgramChangedData,
  UserMessageSentData,
} from '@gear-js/api';
import {
  ICodeChangedData,
  IMessage,
  IMessageEnqueuedData,
  IMessagesDispatchedData,
  IProgramChangedData,
  Keys,
  NewEventData,
} from '@gear-js/common';
import { GenericEventData } from '@polkadot/types';

function messageEnqueuedHandler(data: MessageEnqueuedData): NewEventData<Keys.MessageEnqueued, IMessageEnqueuedData> {
  const { id, source, destination, entry } = data;
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

function userMessageSentHandler(data: UserMessageSentData): NewEventData<Keys.UserMessageSent, IMessage> {
  const { id, source, destination, payload, reply } = data.message;
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

function programChangedHandler(
  data: ProgramChangedData,
): NewEventData<Keys.ProgramChanged, IProgramChangedData> | null {
  const { id, change } = data;
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
  data: MessagesDispatchedData,
): NewEventData<Keys.MessagesDispatched, IMessagesDispatchedData> | null {
  const { statuses } = data;
  if (statuses.size > 0) {
    return { key: Keys.MessagesDispatched, value: { statuses: statuses.toHuman() } as IMessagesDispatchedData };
  }
  return null;
}

function codeChangedHandler(data: CodeChangedData): NewEventData<Keys.CodeChanged, ICodeChangedData> | null {
  const { id, change } = data;
  return { key: Keys.CodeChanged, value: { id: id.toHex(), change: change.toHex() } };
}

function dataBaseWipedHandler(): NewEventData<Keys.DatabaseWiped, unknown> {
  return { key: Keys.DatabaseWiped, value: {} };
}

const handleEvent = (
  method: keyof IGearEvent | 'DatabaseWiped',
  data: GenericEventData,
): { key: Keys; value: any } | null => {
  switch (method) {
    case 'MessageEnqueued':
      return messageEnqueuedHandler(data as MessageEnqueuedData);
    case 'UserMessageSent':
      return userMessageSentHandler(data as UserMessageSentData);
    case 'ProgramChanged':
      return programChangedHandler(data as ProgramChangedData);
    case 'MessagesDispatched':
      return messagesDispatchedHandler(data as MessagesDispatchedData);
    case 'CodeChanged':
      return codeChangedHandler(data as CodeChangedData);
    case 'DatabaseWiped':
      return dataBaseWipedHandler();
    default:
      return null;
  }
};

export { handleEvent };
