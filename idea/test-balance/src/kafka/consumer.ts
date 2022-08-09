import { Consumer, KafkaMessage } from 'kafkajs';
import { initLogger, JSONRPC_ERRORS, KAFKA_TOPICS } from '@gear-js/common';

import config from '../config/configuration';
import { initKafka } from './init-kafka';
import { gearService } from '../gear';
import { genesisHashService } from '../services/genesis-hash/genesis-hash.service';

const consumer: Consumer = initKafka.consumer({ groupId: config.kafka.groupId });

const logger = initLogger('KafkaConsumer');

async function subscribeConsumerTopics(topics: string[]): Promise<void> {
  const promises = topics.map((topic) => consumer.subscribe({ topic }));
  await Promise.all(promises);
}

async function connect(): Promise<void> {
  await consumer.connect();
}

async function run(): Promise<void> {
  await consumer.run({
    eachMessage: async ({ message, topic }) => {
      await messageProcessing(message, topic);
    },
  });
}

async function messageProcessing(message: KafkaMessage, topic: string): Promise<void | { error: string }> {
  const { payload, error } = await getPayloadFromMessage(message);

  if (error) {
    return { error };
  }

  if (payload.genesis === gearService.getGenesisHash()) {
    await genesisHashService.sendByPayload(message, payload);
    return;
  }

  if (topic === KAFKA_TOPICS.TEST_BALANCE_GENESIS_HASHES) {
    await genesisHashService.sendGenesis();
  }
}

async function getPayloadFromMessage(message: KafkaMessage): Promise<{ error: string; payload: any }> {
  const result: { error: string | null; payload: any } = {
    payload: null,
    error: null,
  };
  try {
    result.payload = JSON.parse(message.value.toString());
  } catch (error) {
    logger.error(error.message, error.stack);
    result.error = JSONRPC_ERRORS.InternalError.name;
  }
  return result;
}

export const kafkaConsumer = { subscribeConsumerTopics, connect, run };
