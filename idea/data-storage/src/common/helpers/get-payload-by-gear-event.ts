import { Keys } from '@gear-js/common';
import {
  CodeChangedData,
  MessagesDispatchedData,
  ProgramChangedData,
  UserMessageReadData,
  UserMessageSentData,
} from '@gear-js/api';

import { GenericEventData } from '@polkadot/types';
import { getMessageReadStatus } from './get-message-read-status';
import { UserMessageSentInput } from '../../message/types/user-message-sent.input';
import { UserMessageReadInput } from '../../message/types/user-message-read.input';
import { ProgramChangedInput } from '../../program/types/program-changed.input';
import { MessageDispatchedDataInput } from '../../message/types/message-dispatched-data.input';
import { CodeStatus, MessageStatus } from '../enums';
import { GearEventPayload } from '../types';
import { CodeChangedInput } from '../../code/types';

function userMessageSentPayload(data: UserMessageSentData): UserMessageSentInput {
  const { id, source, destination, payload, value, details } = data.message;
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
    expiration: data.expiration.isSome ? data.expiration.unwrap().toNumber() : null,
  };
}

function userMessageReadPayload(data: UserMessageReadData): UserMessageReadInput {
  return {
    id: data.id.toHex(),
    reason: getMessageReadStatus(data),
  };
}

function programChangedPayload(data: ProgramChangedData): ProgramChangedInput | null {
  const { id, change } = data;
  if (change.isActive || change.isInactive) {
    return {
      id: id.toHex(),
      isActive: change.isActive ? true : false,
    };
  }
  return null;
}

function codeChangedPayload(data: CodeChangedData): CodeChangedInput | null {
  const { id, change } = data;
  const status = change.isActive ? CodeStatus.ACTIVE : change.isInactive ? CodeStatus.INACTIVE : null;
  const expiration = change.isActive ? change.asActive.expiration.toHuman() : null;

  if (!status) {
    return null;
  }
  return { id: id.toHex(), status, expiration };
}

function messagesDispatchedPayload(data: MessagesDispatchedData): MessageDispatchedDataInput | null {
  const { statuses } = data;
  if (statuses.size > 0) {
    return { statuses: statuses.toHuman() as { [key: string]: MessageStatus } };
  }
  return null;
}

export function getPayloadByGearEvent(method: string, data: GenericEventData): GearEventPayload {
  const payloads = {
    [Keys.UserMessageSent]: (data: UserMessageSentData): UserMessageSentInput => {
      return userMessageSentPayload(data);
    },
    [Keys.UserMessageRead]: (data: UserMessageReadData): UserMessageReadInput => {
      return userMessageReadPayload(data);
    },
    [Keys.ProgramChanged]: (data: ProgramChangedData): ProgramChangedInput | null => {
      return programChangedPayload(data);
    },
    [Keys.MessagesDispatched]: (data: MessagesDispatchedData): MessageDispatchedDataInput => {
      return messagesDispatchedPayload(data);
    },
    [Keys.CodeChanged]: (data: CodeChangedData): CodeChangedInput | null => {
      return codeChangedPayload(data);
    },
    [Keys.DatabaseWiped]: () => {
      return {};
    },
  };

  if (method in payloads) {
    return payloads[method](data);
  } else {
    return null;
  }
}
