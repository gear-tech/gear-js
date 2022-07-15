import { filterEvents } from '@polkadot/api/util';
import { KAFKA_TOPICS } from '@gear-js/common';
import { ExtrinsicStatus, SignedBlock } from '@polkadot/types/interfaces';
import { MessageEnqueuedData } from '@gear-js/api';

import { eventListenerLogger } from '../common/event-listener.logger';
import { kafkaProducer } from '../kafka/producer';
import { SendByKafkaTopicInput } from '../kafka/types';
import { sleep } from '../utils';

async function updateMessagePayload(
  signedBlock: SignedBlock,
  genesis: string,
  events: any,
  status: ExtrinsicStatus,
): Promise<void> {
  await sleep(1000);
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
    const payload = getPayload(args, method); // return [payload, value]

    try {
      const sendByKafkaTopicInput: SendByKafkaTopicInput = {
        topic: KAFKA_TOPICS.MESSAGE_UPDATE_DATA,
        //TODO add
        params: { messageId, payload, genesis },
      };
      await kafkaProducer.send(sendByKafkaTopicInput);
    } catch (error) {
      eventListenerLogger.error(error);
      console.log(error);
    }
  }
}

function getPayload(args: any, method: string) {
  const indexPayload = ['sendMessage', 'sendReply'].includes(method) ? 1 : 2;
  //TODO return args[indexValue]
  const indexValue = indexPayload + 2;
  return args[indexPayload].toHuman();
}

export const gearService = { updateMessagePayload };
