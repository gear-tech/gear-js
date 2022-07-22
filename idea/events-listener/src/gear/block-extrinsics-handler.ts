import { filterEvents } from '@polkadot/api/util';
import { MessageEnqueuedData } from '@gear-js/api';
import { GEAR_EVENT, UpdateMessageData } from '@gear-js/common';

import { ExtrinsicsResult, UpdateBlockExtrinsics } from './types';

function handleBlockExtrinsics(data: UpdateBlockExtrinsics): ExtrinsicsResult {
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
      ({ event: { method } }) => method === GEAR_EVENT.MESSAGE_ENQUEUED,
    );

    const eventData = filteredEvents[0].event.data as MessageEnqueuedData;

    const messageId = eventData.id.toHex();
    const [payload, value] = getUpdateMessageData(args, method);

    return { messageId, payload, genesis, value } as UpdateMessageData;
  });

  return { params: result };
}

function getUpdateMessageData(args: any, method: string): [string, string] {
  const indexPayload = ['sendMessage', 'sendReply'].includes(method) ? 1 : 2;
  const indexValue = indexPayload + 2;

  const payload = args[indexPayload].toHuman() as string;
  const value = args[indexValue].toHuman() as string;

  return [payload, value];
}

export { handleBlockExtrinsics };
