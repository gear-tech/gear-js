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
exports.DbService = void 0;
const typeorm_1 = require('typeorm');
const config_1 = require('./config');
const transfer_entity_1 = require('./transfer.entity');
const logger_1 = require('./logger');
const log = (0, logger_1.Logger)('DbService');
class DbService {
  connect() {
    return __awaiter(this, void 0, void 0, function* () {
      this.connection = yield (0, typeorm_1.createConnection)({
        type: 'postgres',
        host: config_1.default.db.host,
        port: config_1.default.db.port,
        database: config_1.default.db.name,
        username: config_1.default.db.user,
        password: config_1.default.db.password,
        entities: [transfer_entity_1.TransferBalance],
        synchronize: true,
      });
      this.repo = (0, typeorm_1.getRepository)(transfer_entity_1.TransferBalance);
      log.info('Connected to database');
    });
  }
  setTransferDate(account, genesis) {
    return __awaiter(this, void 0, void 0, function* () {
      const transfer = this.repo.create({
        account: `${account}.${genesis}`,
        lastTransfer: new Date(),
      });
      return yield this.repo.save(transfer);
    });
  }
  possibleToTransfer(account, genesis) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(`${account}.${genesis}`);
      const transfer = yield this.repo.findOne({ account: `${account}.${genesis}` });
      console.log(transfer);
      if (!transfer) {
        return true;
      }
      console.log(transfer.lastTransfer.setHours(0, 0, 0, 0));
      console.log(new Date().setHours(0, 0, 0, 0));
      console.log(transfer.lastTransfer.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0));
      if (transfer.lastTransfer.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
        return true;
      }
      return false;
    });
  }
}
exports.DbService = DbService;
//# sourceMappingURL=db.js.map
