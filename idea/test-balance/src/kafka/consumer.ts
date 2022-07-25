import { Consumer, KafkaMessage } from 'kafkajs';
import { initLogger, JSONRPC_ERRORS } from '@gear-js/common';

import config from '../config/configuration';
import { initKafka } from './init-kafka';
import { gearService } from '../gear';
import { transferService } from '../services/transfer/transfer.service';
import { kafkaProducer } from './producer';

const consumer: Consumer = initKafka.consumer({ groupId: config.kafka.groupId });

const logger = initLogger('KafkaConsumer');

async function subscribeConsumerTopic(topic: string): Promise<void> {
  await consumer.subscribe({ topic });
  logger.info(`Subscribe to ${topic} topic`);
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

async function messageProcessing(message: KafkaMessage) {
  let result;

  const { payload, error } = await getPayloadFromMessage(message);

  if (error) {
    return { error };
  }

  if (payload.genesis === gearService.getGenesisHash()) {
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
}

async function sendReply(message: any, value: string) {
  await kafkaProducer.send(message, value);
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

export const kafkaConsumer = { subscribeConsumerTopic, connect, run };
