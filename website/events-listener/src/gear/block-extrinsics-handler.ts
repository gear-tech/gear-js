import { filterEvents } from '@polkadot/api/util';
import { MessageEnqueuedData } from '@gear-js/api';

import { ExtrinsicsResult, UpdateBlockExtrinsics } from './types';
import { UpdateMessageData } from '@gear-js/common';

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
      ({ event: { method } }) => method === 'MessageEnqueued',
    );

    const eventData = filteredEvents[0].event.data as MessageEnqueuedData;

    const messageId = eventData.id.toHex();
    const [payload, value] = getUpdateMessageData(args, method);

    return { messageId, payload, genesis, value } as UpdateMessageData;
  });

  return { params: result };
}

function getUpdateMessageData(args: any, method: string): [any, any] {
  const indexPayload = ['sendMessage', 'sendReply'].includes(method) ? 1 : 2;
  const indexValue = indexPayload + 2;

  const payload = args[indexPayload].toHuman();
  const value = args[indexValue].toHuman();

  return [payload, value];
}

export { handleBlockExtrinsics };
