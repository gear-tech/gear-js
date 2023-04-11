import { EventNames, ProgramStatus, MessageReadReason } from '@gear-js/common';
import {
  CodeChangedData,
  MessagesDispatchedData,
  ProgramChangedData,
  UserMessageReadData,
  UserMessageSentData,
} from '@gear-js/api';
import { GenericEventData } from '@polkadot/types';

import { CodeStatus, MessageStatus } from '../enums';
import {
  GearEventPayload,
  ProgramChangedInput,
  UserMessageReadInput,
  UserMessageSentInput,
  MessagesDispatchedDataInput,
} from '../types';
import { CodeChangedInput } from '../types';

function userMessageSentPayload({ message, expiration }: UserMessageSentData): UserMessageSentInput {
  const { id, source, destination, payload, value, details } = message;

  return {
    id: id.toHex(),
    source: source.toHex(),
    destination: destination.toHex(),
    payload: payload.toHex(),
    value: value.toString(),
    replyToMessageId: details.isSome
      ? details.unwrap().isReply
        ? details.unwrap().asReply.replyTo.toHex()
        : null
      : null,
    exitCode: details.isSome
      ? details.unwrap().isReply
        ? details.unwrap().asReply.statusCode.toNumber()
        : null
      : null,
    expiration: expiration.isSome ? expiration.unwrap().toNumber() : null,
  };
}

function userMessageReadPayload({ id, reason }: UserMessageReadData): UserMessageReadInput {
  const res = { id: id.toHex(), reason: null };

  if (reason.isSystem && reason.asSystem.isOutOfRent) {
    res.reason = MessageReadReason.OUT_OF_RENT;
  }
  if (reason.isRuntime && reason.asRuntime.isMessageClaimed) {
    res.reason = MessageReadReason.CLAIMED;
  }
  if (reason.isRuntime && reason.asRuntime.isMessageReplied) {
    res.reason = MessageReadReason.REPLIED;
  }
  return res;
}

function programChangedPayload({ id, change }: ProgramChangedData): ProgramChangedInput {
  const status = change.isActive
    ? ProgramStatus.ACTIVE
    : change.isInactive
      ? ProgramStatus.EXITED
      : change.isPaused
        ? ProgramStatus.PAUSED
        : ProgramStatus.UNKNOWN;
  const expiration = change.isActive ? change.asActive.expiration.toString() : null;

  return { id: id.toHex(), status, expiration };
}

function codeChangedPayload({ id, change }: CodeChangedData): CodeChangedInput {
  const status = change.isActive ? CodeStatus.ACTIVE : change.isInactive ? CodeStatus.INACTIVE : CodeStatus.UNKNOWN;
  const expiration = change.isActive
    ? change.asActive.expiration.isSome
      ? change.asActive.expiration.unwrap().toString()
      : null
    : null;

  return { id: id.toHex(), status, expiration };
}

function messagesDispatchedPayload({ statuses }: MessagesDispatchedData): MessagesDispatchedDataInput | null {
  if (statuses.size > 0) {
    return { statuses: statuses.toHuman() as { [key: string]: MessageStatus } };
  }
  return null;
}

export const eventDataHandlers: Record<EventNames, (data: GenericEventData) => GearEventPayload> = {
  [EventNames.UserMessageSent]: (data: UserMessageSentData): UserMessageSentInput => userMessageSentPayload(data),
  [EventNames.UserMessageRead]: (data: UserMessageReadData): UserMessageReadInput => userMessageReadPayload(data),
  [EventNames.ProgramChanged]: (data: ProgramChangedData): ProgramChangedInput => programChangedPayload(data),
  [EventNames.MessagesDispatched]: (data: MessagesDispatchedData): MessagesDispatchedDataInput | null =>
    messagesDispatchedPayload(data),
  [EventNames.CodeChanged]: (data: CodeChangedData): CodeChangedInput => codeChangedPayload(data),
};
