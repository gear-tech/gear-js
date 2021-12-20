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
exports.MessagesService = void 0;
const common_1 = require('@nestjs/common');
const typeorm_1 = require('@nestjs/typeorm');
const typeorm_2 = require('typeorm');
const message_entity_1 = require('./entities/message.entity');
const api_1 = require('@gear-js/api');
const signature_1 = require('../errors/signature');
const message_1 = require('../errors/message');
const logger = new common_1.Logger('MessageService');
let MessagesService = class MessagesService {
  constructor(messageRepo) {
    this.messageRepo = messageRepo;
  }
  async save({ id, chain, genesis, destination, source, payload, date, replyTo, replyError, isRead }) {
    let message = await this.messageRepo.findOne({ id });
    if (message) {
      if (payload) {
        message.payload = payload;
      }
      if (replyTo) {
        message.replyTo = replyTo;
        message.replyError = replyError;
      }
    } else {
      message = this.messageRepo.create({
        id,
        chain,
        genesis,
        destination,
        source,
        payload,
        date: new Date(date),
        isRead,
        replyTo,
      });
    }
    return this.messageRepo.save(message);
  }
  async addPayload(params) {
    const { id, chain, genesis, signature, payload } = params;
    const message = await this.messageRepo.findOne({ id, genesis, chain });
    if (!message) {
      throw new message_1.MessageNotFound();
    }
    if (!api_1.GearKeyring.checkSign(message.source, signature, payload)) {
      throw new signature_1.SignNotVerified();
    }
    message.payload = payload;
    return this.messageRepo.save(message);
  }
  async getIncoming(params) {
    const [result, total] = await this.messageRepo.findAndCount({
      where: { chain: params.chain, destination: params.destination, genesis: params.genesis, isRead: params.isRead },
      take: params.limit | 20,
      skip: params.offset | 0,
    });
    return {
      messages: result,
      count: total,
    };
  }
  async getOutgoing(params) {
    const [result, total] = await this.messageRepo.findAndCount({
      where: { genesis: params.genesis, chain: params.chain, source: params.source },
      take: params.limit | 20,
      skip: params.offset | 0,
    });
    return {
      messages: result,
      count: total,
    };
  }
  async getAllMessages(params) {
    const [result, total] = await this.messageRepo.findAndCount({
      where: {
        genesis: params.genesis,
        chain: params.chain,
        destination: params.destination,
        source: params.source,
        isRead: params.isRead,
      },
      take: params.limit | 20,
      skip: params.offset | 0,
    });
    return {
      messages: result,
      count: total,
    };
  }
  async getCountUnread(destination) {
    const messages = await this.messageRepo.findAndCount({
      destination,
      isRead: false,
    });
    return messages[1];
  }
};
MessagesService = __decorate(
  [
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata('design:paramtypes', [typeorm_2.Repository]),
  ],
  MessagesService,
);
exports.MessagesService = MessagesService;
//# sourceMappingURL=messages.service.js.map
