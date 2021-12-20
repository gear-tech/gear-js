'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function') return Reflect.metadata(k, v);
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.ApiGatewayService = void 0;
const common_1 = require('@nestjs/common');
const microservices_1 = require('@nestjs/microservices');
const handler_1 = require('../json-rpc/handler');
const common_2 = require('@nestjs/common');
const configuration_1 = require('../config/configuration');
const logger = new common_2.Logger('ApiGatewayService');
let ApiGatewayService = class ApiGatewayService extends handler_1.RpcMessageHandler {
  constructor() {
    super();
    this.patterns = [
      'meta.add',
      'program.data',
      'meta.get',
      'program.all',
      'message.all',
      'message.add.payload',
      'testBalance.get',
    ];
    this.methods = {
      program: {
        data: (params) => {
          return this.client.send('program.data', params);
        },
        addMeta: (params) => {
          return this.client.send('meta.add', params);
        },
        getMeta: (params) => {
          return this.client.send('meta.get', params);
        },
        meta: {
          add: (params) => {
            return this.client.send('meta.add', params);
          },
          get: (params) => {
            return this.client.send('meta.get', params);
          },
        },
        all: (params) => {
          return this.client.send('program.all', params);
        },
        allUser: (params) => {
          if (params.publicKeyRaw) {
            params.owner = params.publicKeyRaw;
          }
          return this.client.send('program.all', params);
        },
      },
      message: {
        all: (params) => {
          return this.client.send('message.all', params);
        },
        incoming: (params) => {
          return this.client.send('message.all', params);
        },
        outgoing: (params) => {
          return this.client.send('message.all', params);
        },
        savePayload: (params) => {
          return this.client.send('message.add.payload', params);
        },
        countUnread: () => {},
      },
      testBalance: {
        get: (params) => {
          return this.client.send('testBalance.get', params);
        },
      },
    };
    console.log((0, configuration_1.default)().kafka.brokers);
  }
  async onModuleInit() {
    this.patterns.forEach((key) => {
      this.client.subscribeToResponseOf(key);
    });
    await this.client.connect();
    logger.log('Connection initialized');
  }
};
__decorate(
  [
    (0, microservices_1.Client)({
      transport: microservices_1.Transport.KAFKA,
      options: {
        client: {
          clientId: (0, configuration_1.default)().kafka.clientId,
          brokers: (0, configuration_1.default)().kafka.brokers,
        },
        consumer: {
          groupId: (0, configuration_1.default)().kafka.groupId,
        },
      },
    }),
    __metadata('design:type', microservices_1.ClientKafka),
  ],
  ApiGatewayService.prototype,
  'client',
  void 0,
);
ApiGatewayService = __decorate([(0, common_1.Injectable)(), __metadata('design:paramtypes', [])], ApiGatewayService);
exports.ApiGatewayService = ApiGatewayService;
//# sourceMappingURL=api-gateway.service.js.map
