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
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
exports.__esModule = true;
exports.nodeApi = void 0;
var api_1 = require('@gear-js/api');
var consts_1 = require('../consts');
var NodeApi = /** @class */ (function () {
  function NodeApi(address) {
    if (address === void 0) {
      address = 'ws://localhost:9944';
    }
    this._api = null;
    this.subscriptions = {};
    this.address = address;
    this.subscriptions = {};
  }
  Object.defineProperty(NodeApi.prototype, 'api', {
    get: function () {
      return this._api;
    },
    enumerable: false,
    configurable: true,
  });
  NodeApi.prototype.init = function () {
    return __awaiter(this, void 0, void 0, function () {
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            _a = this;
            return [4 /*yield*/, api_1.GearApi.create({ providerAddress: this.address })];
          case 1:
            _a._api = _b.sent();
            this.chain = this._api.chain().then(function (res) {
              return localStorage.setItem('chain', res);
            });
            return [2 /*return*/];
        }
      });
    });
  };
  NodeApi.prototype.subscribeProgramEvents = function (cb) {
    if (this._api && !('programEvents' in this.subscriptions)) {
      this.subscriptions.programEvents = this._api.gearEvents.subscribeProgramEvents(function (event) {
        cb(event);
      });
    }
  };
  NodeApi.prototype.unsubscribeProgramEvents = function () {
    var _this = this;
    if ('programEvents' in this.subscriptions) {
      (function () {
        return __awaiter(_this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, this.subscriptions.programEvents];
              case 1:
                _a.sent()();
                return [2 /*return*/];
            }
          });
        });
      })();
    }
  };
  NodeApi.prototype.subscribeLogEvents = function (cb) {
    if (this._api && !('logEvents' in this.subscriptions)) {
      this.subscriptions.logEvents = this._api.gearEvents.subscribeLogEvents(function (event) {
        cb(event);
      });
    }
  };
  NodeApi.prototype.unsubscribeLogEvents = function () {
    var _this = this;
    if ('logEvents' in this.subscriptions) {
      (function () {
        return __awaiter(_this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, this.subscriptions.logEvents];
              case 1:
                _a.sent()();
                return [2 /*return*/];
            }
          });
        });
      })();
    }
  };
  NodeApi.prototype.subscribeTransferEvents = function (cb) {
    if (this._api && !('subscribeTransferEvents' in this.subscriptions)) {
      this.subscriptions.subscribeTransferEvents = this._api.gearEvents.subscribeTransferEvents(function (event) {
        cb(event);
      });
    }
  };
  NodeApi.prototype.unsubscribeTransferEvents = function () {
    var _this = this;
    if ('subscribeTransferEvents' in this.subscriptions) {
      (function () {
        return __awaiter(_this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, this.subscriptions.subscribeTransferEvents];
              case 1:
                _a.sent()();
                return [2 /*return*/];
            }
          });
        });
      })();
    }
  };
  return NodeApi;
})();
exports.nodeApi = new NodeApi(consts_1.API_CONNECTION_ADDRESS);
