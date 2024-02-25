import { CodeChanged, MessageQueued } from '@gear-js/api';
import { filterEvents } from '@polkadot/api/util';

import { CodeStatus, HandlerParams, MessageType, getMetahash, getMsgEntry, getVoucherExtrinsics } from '../../common';
import { Code } from '../../database';

export const handleVoucherTxs = async ({
  api,
  block,
  events,
  status,
  timestamp,
  blockHash,
  genesis,
  tempState,
}: HandlerParams) => {
  const extrinsics = getVoucherExtrinsics(block.block.extrinsics);

  if (extrinsics.length === 0) {
    return;
  }

  const promises = [];

  for (const tx of extrinsics) {
    const txEvents = filterEvents(tx.hash, block, events, status).events;

    const call = tx.args[0].call;

    if (call.isSendMessage) {
      const mqEvent = txEvents.find(({ event }) => event.method === 'MessageQueued');
      if (!mqEvent) {
        continue;
      }
      const {
        data: { id, source, destination, entry },
      } = mqEvent.event as MessageQueued;

      const programId = destination.toHex();

      tempState.addMsg({
        id: id.toHex(),
        source: source.toHex(),
        blockHash,
        destination: programId,
        entry: getMsgEntry(entry),
        type: MessageType.QUEUED,
        payload: call.asSendMessage.payload.toHex(),
        value: call.asSendMessage.value.toHex(),
        timestamp,
        genesis,
      });
    }

    if (call.isSendReply) {
      const mqEvent = txEvents.find(({ event }) => event.method === 'MessageQueued');
      if (!mqEvent) {
        continue;
      }
      const {
        data: { id, source, destination, entry },
      } = mqEvent.event as MessageQueued;

      const programId = destination.toHex();

      tempState.addMsg({
        id: id.toHex(),
        source: source.toHex(),
        blockHash,
        destination: programId,
        entry: getMsgEntry(entry),
        type: MessageType.QUEUED,
        payload: call.asSendReply.payload.toHex(),
        value: call.asSendReply.value.toHex(),
        timestamp,
        genesis,
        replyToMessageId: call.asSendReply.replyToId.toHex(),
      });
    }

    if (call.isUploadCode) {
      const ccEvent = txEvents.find(({ event }) => event.method === 'CodeChanged');
      if (!ccEvent) {
        continue;
      }

      const {
        data: { id, change },
      } = ccEvent.event as CodeChanged;
      const codeId = id.toHex();
      const metahash = await getMetahash(api.code, codeId);

      const codeStatus = change.isActive ? CodeStatus.ACTIVE : change.isInactive ? CodeStatus.INACTIVE : null;

      tempState.addCode(
        new Code({
          id: codeId,
          name: codeId,
          genesis,
          status: codeStatus,
          timestamp,
          blockHash,
          expiration: change.isActive ? change.asActive.expiration.toString() : null,
          uploadedBy: tx.signer.inner.toHex(),
          metahash,
        }),
      );
    }
  }

  await Promise.all(promises);
};
