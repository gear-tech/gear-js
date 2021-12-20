'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.KafkaConsumer = void 0;
const kafkajs_1 = require('kafkajs');
const config_1 = require('./config');
const logger_1 = require('./logger');
const log = (0, logger_1.Logger)('KafkaConsumer');
class KafkaConsumer {
  constructor(gearService, dbService) {
    this.gearService = gearService;
    this.dbService = dbService;
    this.kafka = new kafkajs_1.Kafka({
      clientId: config_1.default.kafka.clientId,
      brokers: config_1.default.kafka.brokers,
      logCreator: logger_1.KafkaLogger,
    });
    this.consumer = this.kafka.consumer({ groupId: config_1.default.kafka.groupId });
    this.producer = this.kafka.producer();
  }
  connect() {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.consumer.connect();
      log.info(`Connected consumer to kafka`);
      yield this.producer.connect();
      log.info(`Connected producer to kafka`);
    });
  }
  sendReply(message, value) {
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
  messageProcessing(message) {
    return __awaiter(this, void 0, void 0, function* () {
      let result;
      let payload;
      try {
        payload = JSON.parse(message.value.toString());
      } catch (error) {
        log.error(error.message);
        console.log(error);
        return;
      }
      if (payload.genesis === this.gearService.genesisHash) {
        try {
          if (yield this.dbService.possibleToTransfer(payload.address, payload.genesis)) {
            result = yield this.gearService.transferBalance(payload.address);
          } else {
            result = { error: 'Limit to transfer balance is reached for today' };
          }
        } catch (error) {
          log.error(error.message);
          console.log(error);
          result = { error: error.message };
        }
        this.sendReply(message, JSON.stringify(result));
      }
    });
  }
  subscribe(topic) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.consumer.subscribe({ topic });
      log.info(`Subscribe to ${topic} topic`);
      yield this.consumer.run({
        eachMessage: ({ message }) =>
          __awaiter(this, void 0, void 0, function* () {
            this.messageProcessing(message);
          }),
      });
    });
  }
}
exports.KafkaConsumer = KafkaConsumer;
//# sourceMappingURL=kafka.consumer.js.map
