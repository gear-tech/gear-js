import { filterEvents } from '@polkadot/api/util';
import { MessageEnqueuedData } from '@gear-js/api';
import { Keys, UpdateMessageData } from '@gear-js/common';

import { UpdateBlockExtrinsics } from './types';

export function handleBlockExtrinsics(data: UpdateBlockExtrinsics): UpdateMessageData[] {
  const { signedBlock, events, status, genesis } = data;

  const eventMethods = ['sendMessage', 'uploadProgram', 'createProgram', 'sendReply'];
  const extrinsics = signedBlock.block.extrinsics.filter(({ method: { method } }) => eventMethods.includes(method));

  const result: UpdateMessageData[] = [];

  for (const extrinsic of extrinsics) {
    const {
      hash,
      args,
      method: { method },
    } = extrinsic;

    const foundEvent = filterEvents(hash, signedBlock, events, status).events!.find(
      ({ event: { method } }) => method === Keys.MessageEnqueued,
    );

    if (!foundEvent) {
      console.log(`MessageEnquqed event related to ${method} extrinsic not found`);
      console.log(args.map((arg) => arg.toHuman()));
      continue;
    }

    const eventData = foundEvent.event.data as MessageEnqueuedData;

    const messageId = eventData.id.toHex();
    const [payload, value] = getUpdateMessageData(args, method);

    result.push({ messageId, payload, genesis, value });
  }

  return result;
}

function getUpdateMessageData(args: any, method: string): [string, string] {
  const indexPayload = ['sendMessage', 'sendReply'].includes(method) ? 1 : 2;
  const indexValue = indexPayload + 2;

  const payload = args[indexPayload].toHuman() as string;
  const value = args[indexValue].toHuman() as string;

  return [payload, value];
}
