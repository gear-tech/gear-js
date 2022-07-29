import { Consumer, KafkaMessage } from 'kafkajs';
import { initLogger, JSONRPC_ERRORS, KAFKA_TOPICS } from '@gear-js/common';

import config from '../config/configuration';
import { initKafka } from './init-kafka';
import { gearService } from '../gear';
import { transferService } from '../services/transfer/transfer.service';
import { kafkaProducer } from './producer';

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
    eachMessage: async ({ message }) => {
      await messageProcessing(message);
    },
  });
}

async function messageProcessing(message: KafkaMessage): Promise<void | { error: string }> {
  const { payload, error } = await getPayloadFromMessage(message);

  if (error) {
    return { error };
  }

  if (payload.genesis === gearService.getGenesisHash()) {
    await getGenesisHashByPayload(message, payload);
    return;
  }

  await apiGenesisHash();
}

async function getGenesisHashByPayload(message: KafkaMessage, payload: any): Promise<void> {
  let result;

  try {
    const isPossibleToTransfer = await transferService.isPossibleToTransfer(payload.address, payload.genesis);
    if (isPossibleToTransfer) {
      const transferBalance = await gearService.transferBalance(payload.address);
      result = { result: transferBalance };
    } else {
      result = { error: JSONRPC_ERRORS.TransferLimitReached.name };
    }
  } catch (error) {
    logger.error(error.message, error.stack);
    result = { error: JSONRPC_ERRORS.InternalError.name };
  }

  await sendReply(message, JSON.stringify(result));
}

async function sendReply(message: KafkaMessage, value: string): Promise<void> {
  const topic = message.headers.kafka_replyTopic.toString();
  const correlationId = message.headers.kafka_correlationId.toString();

  await kafkaProducer.send(topic, value, correlationId);
}

async function apiGenesisHash(): Promise<void> {
  const genesisHash = gearService.getGenesisHash();

  await kafkaProducer.send(`${KAFKA_TOPICS.TEST_BALANCE_GET_API}.reply`, genesisHash);
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
