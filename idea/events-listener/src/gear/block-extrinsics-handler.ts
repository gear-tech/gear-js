import { filterEvents } from '@polkadot/api/util';
import { MessageEnqueuedData } from '@gear-js/api';
import { Keys, UpdateMessageData } from '@gear-js/common';

import { UpdateBlockExtrinsics } from './types';

export function handleBlockExtrinsics(data: UpdateBlockExtrinsics): UpdateMessageData[] {
  const { signedBlock, events, status, genesis } = data;

  const eventMethods = ['sendMessage', 'submitProgram', 'sendReply'];
  const extrinsics = signedBlock.block.extrinsics.filter(({ method: { method } }) => eventMethods.includes(method));

  const result = extrinsics.map((extrinsic) => {
    const {
      hash,
      args,
      method: { method },
    } = extrinsic;

    const filteredEvents = filterEvents(hash, signedBlock, events, status).events!.filter(
      ({ event: { method } }) => method === Keys.MessageEnqueued,
    );

    const eventData = filteredEvents[0].event.data as MessageEnqueuedData;

    const messageId = eventData.id.toHex();
    const [payload, value] = getUpdateMessageData(args, method);

    return { messageId, payload, genesis, value } as UpdateMessageData;
  });

  return result;
}

function getUpdateMessageData(args: any, method: string): [string, string] {
  const indexPayload = ['sendMessage', 'sendReply'].includes(method) ? 1 : 2;
  const indexValue = indexPayload + 2;

  const payload = args[indexPayload].toHuman() as string;
  const value = args[indexValue].toHuman() as string;

  return [payload, value];
}
