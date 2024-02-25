import { filterEvents } from '@polkadot/api/util';
import { MessageQueued } from '@gear-js/api';

import { HandlerParams, MessageType, getExtrinsics, getMsgEntry, getPayloadAndValueAndReplyToId } from '../../common';

export const handleMsgTxs = async ({
  block,
  events,
  status,
  timestamp,
  blockHash,
  genesis,
  tempState,
}: HandlerParams) => {
  const extrinsics = getExtrinsics(block.block.extrinsics, [
    'sendMessage',
    'sendReply',
    'uploadProgram',
    'createProgram',
  ]);
  if (extrinsics.length === 0) {
    return;
  }

  extrinsics.forEach((tx) => {
    const foundEvent = filterEvents(tx.hash, block, events, status).events.find(
      ({ event }) => event.method === 'MessageQueued',
    );

    if (!foundEvent) {
      return;
    }

    const {
      data: { id, source, destination, entry },
    } = foundEvent.event as MessageQueued;

    const [payload, value] = getPayloadAndValueAndReplyToId(tx.args, tx.method.method);

    const messageEntry = getMsgEntry(entry);

    const msgId = id.toHex();
    const programId = destination.toHex();

    tempState.addMsg({
      id: msgId,
      blockHash,
      genesis,
      timestamp,
      destination: programId,
      source: source.toHex(),
      payload,
      value,
      type: MessageType.QUEUED,
      entry: messageEntry,
    });
  });
};
