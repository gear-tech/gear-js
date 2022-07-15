import { filterEvents } from '@polkadot/api/util';
import { API_METHODS, UpdateMessageParams } from '@gear-js/common';
import { MessageEnqueuedData } from '@gear-js/api';

import { API_HANDLE_METHODS, ApiResult, GenericApiData, UpdateMessageDataExtrinsic } from './types';

function updateMessageHandler(data: UpdateMessageDataExtrinsic): ApiResult {
  const result: UpdateMessageParams[] = [];
  const { signedBlock, events, status, genesis } = data;

  const eventMethods = ['sendMessage', 'submitProgram', 'sendReply'];
  const extrinsics = signedBlock.block.extrinsics.filter(({ method: { method } }: { method: { method: string } }) =>
    eventMethods.includes(method),
  );

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
    const [payload, value] = getUpdateMessageData(args, method); // return [payload, value]

    result.push({ messageId, payload, genesis, value });
  }

  return { method: API_METHODS.MESSAGE_UPDATE_DATA, params: result };
}

function getUpdateMessageData(args: any, method: string): [any, any] {
  const indexPayload = ['sendMessage', 'sendReply'].includes(method) ? 1 : 2;
  const indexValue = indexPayload + 2;

  const payload = args[indexPayload].toHuman();
  const value = args[indexValue].toHuman();

  return [payload, value];
}

function handleApiEvent(method: API_HANDLE_METHODS | string, data: GenericApiData): ApiResult | null {
  switch (method) {
    case API_HANDLE_METHODS.MessageEnqueued:
      return updateMessageHandler(data);
    default:
      return null;
  }
}

export { handleApiEvent };
