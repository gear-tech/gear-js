import {
  CodeChangedData,
  MessageEnqueuedData,
  MessagesDispatchedData,
  ProgramChangedData,
  UserMessageReadData,
  UserMessageSentData,
} from '@gear-js/api';
import {
  ICodeChangedData,
  IMessage,
  IMessageEnqueuedData,
  IMessagesDispatchedData,
  IProgramChangedData,
  IUserMessageReadData,
  Keys,
  NewEventData,
} from '@gear-js/common';
import { GenericEventData } from '@polkadot/types';

import { getMessageReadStatus } from '../utils';

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
  const { id, source, destination, payload, value, reply } = data.message;
  return {
    key: Keys.UserMessageSent,
    value: {
      id: id.toHex(),
      source: source.toHex(),
      destination: destination.toHex(),
      payload: payload.toHex(),
      value: value.toString(),
      replyToMessageId: reply.isSome ? reply.unwrap().replyTo.toHex() : null,
      exitCode: reply.isSome ? reply.unwrap().exitCode.toNumber() : null,
    },
  };
}

function userMessageReadHandler(data: UserMessageReadData): NewEventData<Keys.UserMessageRead, IUserMessageReadData> {
  return {
    key: Keys.UserMessageRead,
    value: {
      id: data.id.toHex(),
      reason: getMessageReadStatus(data),
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
  const status = change.isActive ? 'Active' : change.isInactive ? 'Inactive' : null;
  const expiration = change.isActive ? change.asActive.expiration.toHuman() : null;
  if (!status) {
    return null;
  }
  return { key: Keys.CodeChanged, value: { id: id.toHex(), change: status, expiration } as ICodeChangedData };
}

function dataBaseWipedHandler(): NewEventData<Keys.DatabaseWiped, unknown> {
  return { key: Keys.DatabaseWiped, value: {} };
}

const handleEvent = (method: Keys, data: GenericEventData): { key: Keys; value: any } | null => {
  switch (method) {
    case Keys.MessageEnqueued:
      return messageEnqueuedHandler(data as MessageEnqueuedData);
    case Keys.UserMessageSent:
      return userMessageSentHandler(data as UserMessageSentData);
    case Keys.UserMessageRead:
      return userMessageReadHandler(data as UserMessageReadData);
    case Keys.ProgramChanged:
      return programChangedHandler(data as ProgramChangedData);
    case Keys.MessagesDispatched:
      return messagesDispatchedHandler(data as MessagesDispatchedData);
    case Keys.CodeChanged:
      return codeChangedHandler(data as CodeChangedData);
    case Keys.DatabaseWiped:
      return dataBaseWipedHandler();
    default:
      return null;
  }
};

export { handleEvent };
