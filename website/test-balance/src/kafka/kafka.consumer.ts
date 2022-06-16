import { initLogger, JSONRPC_ERRORS, kafkaLogger } from '@gear-js/common';

import { Consumer, Kafka, KafkaMessage, Producer } from 'kafkajs';
import config from '../config/config';
import { DbService } from '../database/db';
import { GearService } from '../domain/gear.service';

const log = initLogger('KafkaConsumer');

export class KafkaConsumer {
  kafka: Kafka;
  consumer: Consumer;
  gearService: GearService;
  dbService: DbService;
  producer: Producer;

  constructor(gearService: GearService, dbService: DbService) {
    this.gearService = gearService;
    this.dbService = dbService;
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

  async connect() {
    await this.consumer.connect();
    log.info(`Connected consumer to kafka`);
    await this.producer.connect();
    log.info(`Connected producer to kafka`);
  }

  sendReply(message: any, value: string) {
    this.producer.send({
      topic: message.headers.kafka_replyTopic.toString(),
      messages: [
        {
          value,
          partition: parseInt(message.headers.kafka_replyPartition.toString()),
          headers: { kafka_correlationId: message.headers.kafka_correlationId.toString() },
        },
      ],
    });
  }

  async messageProcessing(message: KafkaMessage) {
    let result: any;
    let payload: any;

    try {
      payload = JSON.parse(message.value.toString());
      console.log(payload);
    } catch (error) {
      log.error(error.message, error.stack);
      return { error: JSONRPC_ERRORS.InternalError.name };
    }

    if (payload.genesis === this.gearService.genesisHash) {
      try {
        if (await this.dbService.possibleToTransfer(payload.address, payload.genesis)) {
          result = { result: await this.gearService.transferBalance(payload.address) };
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

  async subscribe(topic: string) {
    await this.consumer.subscribe({ topic });
    log.info(`Subscribe to ${topic} topic`);
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        console.log(message);
        this.messageProcessing(message);
      },
    });
  }
}
