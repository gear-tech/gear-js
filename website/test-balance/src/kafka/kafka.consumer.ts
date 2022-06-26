import { initLogger, JSONRPC_ERRORS, kafkaLogger } from '@gear-js/common';

import { Consumer, Kafka, KafkaMessage, Producer } from 'kafkajs';
import config from '../config/configuration';
import { transferService } from '../services/transfer/transfer.service';
import { gearService } from '../gear';

const log = initLogger('KafkaConsumer');

export class KafkaConsumer {
  kafka: Kafka;
  consumer: Consumer;
  producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: config.kafka.clientId,
      brokers: config.kafka.brokers,
      logCreator: kafkaLogger,
      sasl: {
        mechanism: 'plain',
        username: config.kafka.sasl.username,
        password: config.kafka.sasl.password,
      },
    });
    this.consumer = this.kafka.consumer({ groupId: config.kafka.groupId });
    this.producer = this.kafka.producer();
  }

  public async connect() {
    await this.consumer.connect();
    log.info(`Connected consumer to kafka`);
    await this.producer.connect();
    log.info(`Connected producer to kafka`);
  }

  public async subscribe(topic: string) {
    await this.consumer.subscribe({ topic });
    log.info(`Subscribe to ${topic} topic`);
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        await this.messageProcessing(message);
      },
    });
  }

  private async messageProcessing(message: KafkaMessage) {
    let result: any;
    let payload: any;

    try {
      payload = JSON.parse(message.value.toString());
    } catch (error) {
      log.error(error.message, error.stack);
      return { error: JSONRPC_ERRORS.InternalError.name };
    }

    if (payload.genesis === gearService.getGenesisHash()) {
      try {
        if (await transferService.isPossibleToTransfer(payload.address, payload.genesis)) {
          result = { result: await gearService.transferBalance(payload.address) };
        } else {
          result = { error: JSONRPC_ERRORS.TransferLimitReached.name };
        }
      } catch (error) {
        log.error(error.message, error.stack);
        result = { error: JSONRPC_ERRORS.InternalError.name };
      }
      this.sendReply(message, JSON.stringify(result));
    }
  }

  private sendReply(message: any, value: string) {
    this.producer.send({
      topic: message.headers.kafka_replyTopic.toString(),
      messages: [
        {
          value,
          headers: { kafka_correlationId: message.headers.kafka_correlationId.toString() },
        },
      ],
    });
  }
}
