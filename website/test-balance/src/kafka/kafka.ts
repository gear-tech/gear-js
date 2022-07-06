import { initLogger, JSONRPC_ERRORS, KAFKA_TOPICS, kafkaLogger } from '@gear-js/common';
import { Consumer, Kafka, KafkaMessage, Producer } from 'kafkajs';

import config from '../config/configuration';
import { transferService } from '../services/transfer/transfer.service';
import { gearService } from '../gear';

const logger = initLogger('KafkaConsumer');

const kafka = new Kafka({
  clientId: config.kafka.clientId,
  brokers: config.kafka.brokers,
  logCreator: kafkaLogger,
  sasl: {
    mechanism: 'plain',
    username: config.kafka.sasl.username,
    password: config.kafka.sasl.password,
  },
});

const kafkaConsumer: Consumer = kafka.consumer({ groupId: config.kafka.groupId });
const kafkaProducer: Producer = kafka.producer();

async function connectKafka() {
  try {
    await Promise.all([
      kafkaProducer.connect(),
      kafkaConsumer.connect(),
      subscribeConsumerTopic(KAFKA_TOPICS.TEST_BALANCE_GET),
    ]);
    await kafkaConsumer.run({
      eachMessage: async ({ message }) => {
        await messageProcessing(message);
      },
    });
  } catch (err) {
    console.log(err);
  }
}

async function subscribeConsumerTopic(topic: string): Promise<void> {
  await kafkaConsumer.subscribe({ topic });
  logger.info(`Subscribe to ${topic} topic`);
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
  await kafkaProducer.send({
    topic: message.headers.kafka_replyTopic.toString(),
    messages: [
      {
        value,
        headers: { kafka_correlationId: message.headers.kafka_correlationId.toString() },
      },
    ],
  });
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

export { connectKafka };
