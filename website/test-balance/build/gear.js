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
exports.GearService = void 0;
const api_1 = require('@gear-js/api');
const config_1 = require('./config');
const util_1 = require('@polkadot/util');
const logger_1 = require('./logger');
const log = (0, logger_1.Logger)('GearService');
class GearService {
  constructor(dbService) {
    this.dbService = dbService;
  }
  connect() {
    return __awaiter(this, void 0, void 0, function* () {
      this.api = yield api_1.GearApi.create({ providerAddress: config_1.default.gear.providerAddress });
      log.info(`Connected to ${yield this.api.chain()} with genesis ${this.genesisHash}`);
      this.account = yield api_1.GearKeyring.fromSeed(config_1.default.gear.accountSeed);
      this.rootAccount =
        config_1.default.gear.rootAccountSeed === '//Alice'
          ? api_1.GearKeyring.fromSuri('//Alice')
          : yield api_1.GearKeyring.fromSeed(config_1.default.gear.rootAccountSeed);
      this.accountBalance = new util_1.BN(config_1.default.gear.accountBalance);
      this.balanceToTransfer = new util_1.BN(config_1.default.gear.balanceToTransfer);
      if (yield this.accountBalanceIsSmall()) {
        this.transferBalance(this.account.address, this.rootAccount, this.accountBalance);
      }
    });
  }
  get genesisHash() {
    return this.api.genesisHash.toHex();
  }
  accountBalanceIsSmall() {
    return __awaiter(this, void 0, void 0, function* () {
      const balance = yield this.api.balance.findOut(this.account.address);
      if (balance.lt(this.accountBalance)) {
        return true;
      }
      return false;
    });
  }
  transferBalance(to, from = this.account, value = this.balanceToTransfer) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        console.log(from.address, to, value);
        yield this.api.balance.transferBalance(from, to, value);
        if (to !== this.account.address) {
          yield this.dbService.setTransferDate(to, this.genesisHash);
        }
        return { status: 'ok', transferedBalance: value.toString() };
      } catch (error) {
        log.error(error.message);
        return { error: error.message };
      }
    });
  }
}
exports.GearService = GearService;
//# sourceMappingURL=gear.js.map
