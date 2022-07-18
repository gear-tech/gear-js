import { filterEvents } from '@polkadot/api/util';
import { MessageEnqueuedData } from '@gear-js/api';

import { ExtrinsicsResult, UpdateBlockExtrinsics } from './types';
import { sleep } from '../utils';

async function handleBlockExtrinsics(data: UpdateBlockExtrinsics): Promise<ExtrinsicsResult> {
  const ONE_SECOND = 1000;
  await sleep(ONE_SECOND);
  const result: ExtrinsicsResult = { params: [] };
  const { signedBlock, events, status, genesis } = data;

  const eventMethods = ['sendMessage', 'submitProgram', 'sendReply'];
  const extrinsics = signedBlock.block.extrinsics.filter(({ method: { method } }) => eventMethods.includes(method));

  for (const {
    hash,
    args,
    method: { method },
  } of extrinsics) {
    const filteredEvents = filterEvents(hash, signedBlock, events, status).events!.filter(
      ({ event: { method } }) => method === 'MessageEnqueued',
    );
    const eventData = filteredEvents[0].event.data as MessageEnqueuedData;

    const messageId = eventData.id.toHex();
    const [payload, value] = getUpdateMessageData(args, method);

    result.params.push({ messageId, payload, genesis, value });
  }

  return result;
}

function getUpdateMessageData(args: any, method: string): [any, any] {
  const indexPayload = ['sendMessage', 'sendReply'].includes(method) ? 1 : 2;
  const indexValue = indexPayload + 2;

  const payload = args[indexPayload].toHuman();
  const value = args[indexValue].toHuman();

  return [payload, value];
}

export { handleBlockExtrinsics };
