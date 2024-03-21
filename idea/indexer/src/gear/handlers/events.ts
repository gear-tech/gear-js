import { filterEvents } from '@polkadot/api/util';
import { Option } from '@polkadot/types';

import { HandlerParams, MessageStatus, MessageType, getGearRunExtrinsic } from '../../common';
import { CodeStatus, EventNames, MessageReadReason, ProgramStatus } from '@gear-js/common';
import { TempState } from '../temp-state';
import {
  CodeChangedData,
  GearApi,
  GearCommonProgram,
  MessagesDispatchedData,
  ProgramChangedData,
  UserMessageReadData,
  UserMessageSentData,
} from '@gear-js/api';
import { Message, Program } from '../../database';

const programChanged = async (
  { id, change }: ProgramChangedData,
  blockHash: string,
  timestamp: Date,
  genesis: string,
  api: GearApi,
  tempState: TempState,
) => {
  let status: ProgramStatus;

  if (change.isActive) status = ProgramStatus.ACTIVE;
  else if (change.isInactive) status = ProgramStatus.EXITED;
  else if (change.isTerminated) status = ProgramStatus.TERMINATED;
  else if (change.isPaused) status = ProgramStatus.PAUSED;
  else if (change.isProgramSet) status = ProgramStatus.PROGRAM_SET;
  else status = ProgramStatus.UNKNOWN;

  let expiration: string;
  if (change.isActive) expiration = change.asActive.expiration.toString();
  else if (change.isExpirationChanged) change.asExpirationChanged.expiration.toString();

  if (change.isProgramSet) {
    const progStorage = (await api.query.gearProgram.programStorage(id)) as Option<GearCommonProgram>;
    if (progStorage.isSome) {
      if (progStorage.unwrap().isActive) {
        const { codeHash } = progStorage.unwrap().asActive;
        const programId = id.toHex();
        tempState.addProgram(
          new Program({
            id: programId,
            name: programId,
            blockHash,
            timestamp,
            genesis,
            codeId: codeHash.toHex(),
            status: ProgramStatus.PROGRAM_SET,
          }),
        );
      }
    }
  }

  return tempState.setProgramStatus(id.toHex(), status, expiration);
};

const codeChanged = ({ id, change }: CodeChangedData, tempState: TempState) => {
  const status = change.isActive ? CodeStatus.ACTIVE : change.isInactive ? CodeStatus.INACTIVE : CodeStatus.UNKNOWN;

  const expiration = change.isActive
    ? change.asActive.expiration.isSome
      ? change.asActive.expiration.unwrap().toString()
      : null
    : null;

  return tempState.setCodeStatus(id.toHex(), status, expiration);
};

const messagesDispatched = async ({ statuses }: MessagesDispatchedData, tempState: TempState) => {
  return tempState.setDispatchedStatus(statuses.toJSON() as { [key: string]: MessageStatus });
};

const userMessageSent = (
  { message: { id, destination, source, payload, value, details }, expiration }: UserMessageSentData,
  blockHash: string,
  genesis: string,
  timestamp: Date,
  tempState: TempState,
) => {
  const unwrappedDetails = details.isSome ? details.unwrap() : null;

  return tempState.addMsg(
    new Message({
      id: id.toHex(),
      blockHash,
      genesis,
      timestamp,
      destination: destination.toHex(),
      source: source.toHex(),
      payload: payload.toHex(),
      value: value.toString(),
      type: MessageType.MSG_SENT,
      exitCode: unwrappedDetails ? (unwrappedDetails.code.isSuccess ? 0 : 1) : null,
      expiration: expiration.isSome ? expiration.unwrap().toNumber() : null,
      replyToMessageId: unwrappedDetails ? unwrappedDetails.to.toHex() : null,
    }),
  );
};

const userMessageRead = ({ id, reason }: UserMessageReadData, tempState: TempState) => {
  let readReason: MessageReadReason;

  if (reason.isSystem && reason.asSystem.isOutOfRent) {
    readReason = MessageReadReason.OUT_OF_RENT;
  }
  if (reason.isRuntime && reason.asRuntime.isMessageClaimed) {
    readReason = MessageReadReason.CLAIMED;
  }
  if (reason.isRuntime && reason.asRuntime.isMessageReplied) {
    readReason = MessageReadReason.REPLIED;
  }
  return tempState.setReadStatus(id.toHex(), readReason);
};

export async function handleEvents({
  api,
  block,
  events,
  status,
  timestamp,
  genesis,
  blockHash,
  tempState,
}: HandlerParams) {
  const tx = getGearRunExtrinsic(block.block.extrinsics);

  if (!tx) {
    return;
  }

  const txEvents = filterEvents(tx.hash, block, events, status).events;
  const necessaryEvents = txEvents.filter(({ event: { method } }) =>
    Object.values(EventNames).includes(method as EventNames),
  );

  if (necessaryEvents.length === 0) {
    return;
  }

  const promises = [];

  for (const {
    event: { data, method },
  } of necessaryEvents) {
    switch (method) {
      case EventNames.ProgramChanged: {
        await programChanged(data as ProgramChangedData, blockHash, timestamp, genesis, api, tempState);
        continue;
      }
      case EventNames.CodeChanged: {
        promises.push(codeChanged(data as CodeChangedData, tempState));
        continue;
      }
      case EventNames.MessagesDispatched: {
        promises.push(messagesDispatched(data as MessagesDispatchedData, tempState));
        continue;
      }
      case EventNames.UserMessageSent: {
        userMessageSent(data as UserMessageSentData, blockHash, genesis, timestamp, tempState);
        continue;
      }
      case EventNames.UserMessageRead: {
        promises.push(userMessageRead(data as UserMessageReadData, tempState));
        continue;
      }
    }
  }

  await Promise.all(promises);
}
