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
const gear_1 = require('./gear');
const kafka_consumer_1 = require('./kafka.consumer');
const db_1 = require('./db');
const main = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const db = new db_1.DbService();
    yield db.connect();
    const gear = new gear_1.GearService(db);
    yield gear.connect();
    const kafka = new kafka_consumer_1.KafkaConsumer(gear, db);
    yield kafka.connect();
    kafka.subscribe(`testBalance.get`);
  });
main();
//# sourceMappingURL=index.js.map
