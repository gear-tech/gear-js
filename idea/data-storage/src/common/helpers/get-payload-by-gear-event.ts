import {
  IMessage,
  IMessageEnqueuedData, IMessagesDispatchedData,
  IProgramChangedData,
  IUserMessageReadData,
  Keys,
  NewEventData,
} from '@gear-js/common';

import {
  MessageEnqueuedData,
  MessagesDispatchedData,
  ProgramChangedData,
  UserMessageReadData,
  UserMessageSentData,
} from '@gear-js/api';
import { GenericEventData } from '@polkadot/types';
import { getMessageReadStatus } from './get-message-read-status';

function messageEnqueuedPayload(data: MessageEnqueuedData): NewEventData<Keys.MessageEnqueued, IMessageEnqueuedData> {
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

function userMessageSentPayload(data: UserMessageSentData): NewEventData<Keys.UserMessageSent, IMessage> {
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

function userMessageReadPayload(data: UserMessageReadData): NewEventData<Keys.UserMessageRead, IUserMessageReadData> {
  return {
    key: Keys.UserMessageRead,
    value: {
      id: data.id.toHex(),
      reason: getMessageReadStatus(data),
    },
  };
}

function programChangedPayload(
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

function messagesDispatchedPayload(
  data: MessagesDispatchedData,
): NewEventData<Keys.MessagesDispatched, IMessagesDispatchedData> | null {
  const { statuses } = data;
  if (statuses.size > 0) {
    return { key: Keys.MessagesDispatched, value: { statuses: statuses.toHuman() } as IMessagesDispatchedData };
  }
  return null;
}

function dataBaseWipedPayload(): NewEventData<Keys.DatabaseWiped, unknown> {
  return { key: Keys.DatabaseWiped, value: {} };
}

export const getPayloadByGearEvent = (method: string, data: GenericEventData): { key: Keys; value: any } | null => {
  switch (method) {
    case Keys.MessageEnqueued:
      return messageEnqueuedPayload(data as MessageEnqueuedData);
    case Keys.UserMessageSent:
      return userMessageSentPayload(data as UserMessageSentData);
    case Keys.UserMessageRead:
      return userMessageReadPayload(data as UserMessageReadData);
    case Keys.ProgramChanged:
      return programChangedPayload(data as ProgramChangedData);
    case Keys.MessagesDispatched:
      return messagesDispatchedPayload(data as MessagesDispatchedData);
    case Keys.DatabaseWiped:
      return dataBaseWipedPayload();
    default:
      return null;
  }
};
