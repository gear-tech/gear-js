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
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.ConsumerController = void 0;
const common_1 = require('@nestjs/common');
const microservices_1 = require('@nestjs/microservices');
const consumer_service_1 = require('./consumer.service');
const logger = new common_1.Logger('ConsumerController');
let ConsumerController = class ConsumerController {
  constructor(consumerService) {
    this.consumerService = consumerService;
  }
  async addEvent(payload) {
    logger.log(payload.value, 'AddEvent');
    const chain = payload.headers.chain;
    const genesis = payload.headers.genesis;
    const key = payload.key;
    const value = payload.value;
    try {
      await this.consumerService.events[key](genesis, chain, value);
    } catch (error) {
      logger.error(error.message, error.stack);
    }
  }
  async programData(payload) {
    const result = await this.consumerService.programData(payload.value);
    return JSON.stringify(result);
  }
  async allPrograms(payload) {
    const result = await this.consumerService.allPrograms(payload.value);
    return JSON.stringify(result);
  }
  async addMeta(payload) {
    const result = await this.consumerService.addMeta(payload.value);
    return JSON.stringify(result);
  }
  async getMeta(payload) {
    const result = await this.consumerService.getMeta(payload.value);
    return JSON.stringify(result);
  }
  async allMessages(payload) {
    const result = await this.consumerService.allMessages(payload.value);
    return JSON.stringify(result);
  }
  async savePayload(payload) {
    const result = await this.consumerService.addPayload(payload.value);
    return JSON.stringify(result);
  }
};
__decorate(
  [
    (0, microservices_1.MessagePattern)('events'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  ConsumerController.prototype,
  'addEvent',
  null,
);
__decorate(
  [
    (0, microservices_1.MessagePattern)('program.data'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  ConsumerController.prototype,
  'programData',
  null,
);
__decorate(
  [
    (0, microservices_1.MessagePattern)('program.all'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  ConsumerController.prototype,
  'allPrograms',
  null,
);
__decorate(
  [
    (0, microservices_1.MessagePattern)('meta.add'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  ConsumerController.prototype,
  'addMeta',
  null,
);
__decorate(
  [
    (0, microservices_1.MessagePattern)('meta.get'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  ConsumerController.prototype,
  'getMeta',
  null,
);
__decorate(
  [
    (0, microservices_1.MessagePattern)('message.all'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  ConsumerController.prototype,
  'allMessages',
  null,
);
__decorate(
  [
    (0, microservices_1.MessagePattern)('message.add.payload'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  ConsumerController.prototype,
  'savePayload',
  null,
);
ConsumerController = __decorate(
  [(0, common_1.Controller)(), __metadata('design:paramtypes', [consumer_service_1.ConsumerService])],
  ConsumerController,
);
exports.ConsumerController = ConsumerController;
//# sourceMappingURL=consumer.controller.js.map
