import { CodeChanged, MessageQueued, generateCodeHash } from '@gear-js/api';
import { filterEvents } from '@polkadot/api/util';
import { GenericCall } from '@polkadot/types';

import {
  CodeStatus,
  HandlerParams,
  MessageEntryPoint,
  MessageType,
  ProgramStatus,
  getBatchExtrinsics,
  getMetahash,
  getPayloadAndValueAndReplyToId,
} from '../../common';
import { TempState } from '../temp-state';
import { Code, Program } from '../../database';

enum BatchCallMethods {
  SEND_MESSAGE = 'sendMessage',
  SEND_REPLY = 'sendReply',
  UPLOAD_PROGRAM = 'uploadProgram',
  CREATE_PROGRAM = 'createProgram',
  UPLOAD_CODE = 'uploadCode',
}

enum BatchEventMethods {
  MESSAGE_QUEUED = 'MessageQueued',
  CODE_CHANGED = 'CodeChanged',
  ITEM_COMPLETED = 'ItemCompleted',
  ITEM_FAILED = 'ItemFailed',
}

export const handleBatchTxs = async ({
  api,
  block,
  events,
  status,
  timestamp,
  blockHash,
  genesis,
  tempState,
}: HandlerParams) => {
  const extrinsics = getBatchExtrinsics(block.block.extrinsics);

  if (extrinsics.length === 0) {
    return;
  }

  for (const tx of extrinsics) {
    const txEvents = filterEvents(tx.hash, block, events, status).events;

    const itemCompletedIndexes = [];

    txEvents.forEach(({ event: { method } }, index) => {
      if (method === BatchEventMethods.ITEM_COMPLETED || method === BatchEventMethods.ITEM_FAILED) {
        itemCompletedIndexes.push(index);
      }
    });

    for (let i = 0; i < tx.args.length; i++) {
      const { method, args } = tx.args[i] as GenericCall;

      if (!Object.values(BatchCallMethods).includes(method as BatchCallMethods)) {
        continue;
      }

      const events = txEvents.slice(itemCompletedIndexes[i - 1] || 0, itemCompletedIndexes[i] + 1);

      if (events.at(-1).event.method === BatchEventMethods.ITEM_FAILED) {
        continue;
      }

      if (method === BatchCallMethods.UPLOAD_CODE) {
        const ccEvent = events.find(({ event: { method } }) => method === 'CodeChanged').event as CodeChanged;

        if (!ccEvent) {
          continue;
        }

        const {
          data: { id, change },
        } = ccEvent;

        const codeId = id.toHex();
        const metahash = await getMetahash(api.code, codeId);

        const codeStatus = change.isActive ? CodeStatus.ACTIVE : change.isInactive ? CodeStatus.INACTIVE : null;

        tempState.addCode(
          new Code({
            id: codeId,
            name: codeId,
            genesis,
            status: codeStatus,
            timestamp: new Date(timestamp),
            blockHash: block.block.header.hash.toHex(),
            expiration: change.isActive ? change.asActive.expiration.toString() : null,
            uploadedBy: tx.signer.inner.toHex(),
            metahash,
          }),
        );
      }

      const {
        data: { id, destination, source, entry },
      } = events.find(({ event }) => event.method === BatchEventMethods.MESSAGE_QUEUED).event as MessageQueued;

      const programId = destination.toHex();

      if ([BatchCallMethods.CREATE_PROGRAM, BatchCallMethods.UPLOAD_PROGRAM].includes(method as BatchCallMethods)) {
        const codeId = tx.method.method === 'uploadProgram' ? generateCodeHash(tx.args[0].toHex()) : tx.args[0].toHex();

        tempState.addProgram(
          new Program({
            id: programId,
            name: programId,
            owner: source.toHex(),
            blockHash,
            timestamp,
            codeId,
            genesis,
            status: ProgramStatus.PROGRAM_SET,
          }),
        );
      }

      if (
        [
          BatchCallMethods.CREATE_PROGRAM,
          BatchCallMethods.SEND_MESSAGE,
          BatchCallMethods.SEND_REPLY,
          BatchCallMethods.UPLOAD_PROGRAM,
        ].includes(method as BatchCallMethods)
      ) {
        const [payload, value, replyToId] = getPayloadAndValueAndReplyToId(args, method);

        const messageEntry = entry.isInit
          ? MessageEntryPoint.INIT
          : entry.isHandle
            ? MessageEntryPoint.HANDLE
            : MessageEntryPoint.REPLY;

        const msgId = id.toHex();

        tempState.addMsg({
          id: msgId,
          blockHash,
          genesis,
          timestamp,
          destination: destination.toHex(),
          source: source.toHex(),
          payload,
          value,
          type: MessageType.QUEUED,
          entry: messageEntry,
          replyToMessageId: replyToId,
        });
      }
    }
  }
};
