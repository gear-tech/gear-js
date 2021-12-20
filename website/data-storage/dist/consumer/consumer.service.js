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
exports.ConsumerService = void 0;
const common_1 = require('@nestjs/common');
const messages_service_1 = require('../messages/messages.service');
const metadata_service_1 = require('../metadata/metadata.service');
const program_entity_1 = require('../programs/entities/program.entity');
const programs_service_1 = require('../programs/programs.service');
const errors_1 = require('../errors');
let ConsumerService = class ConsumerService {
  constructor(programService, messageService, metaService) {
    this.programService = programService;
    this.messageService = messageService;
    this.metaService = metaService;
    this.events = {
      Log: (genesis, chain, value) => {
        var _a, _b;
        this.messageService.save({
          genesis,
          chain,
          id: value.id,
          destination: value.dest,
          source: value.source,
          isRead: true,
          date: value.date,
          payload: value.payload,
          replyTo: ((_a = value.reply) === null || _a === void 0 ? void 0 : _a.isExist) ? value.reply.id : null,
          replyError: ((_b = value.reply) === null || _b === void 0 ? void 0 : _b.isExist) ? value.reply.error : null,
        });
      },
      InitMessageEnqueued: async (genesis, chain, value) => {
        await this.programService.save({
          id: value.programId,
          genesis,
          chain,
          owner: value.origin,
          uploadedAt: value.date,
        });
        this.messageService.save({
          genesis,
          chain,
          id: value.messageId,
          destination: value.programId,
          source: value.origin,
          isRead: true,
          date: value.date,
          payload: null,
          replyTo: null,
          replyError: null,
        });
      },
      DispatchMessageEnqueued: (genesis, chain, value) => {
        this.messageService.save({
          genesis,
          chain,
          id: value.messageId,
          destination: value.programId,
          source: value.origin,
          isRead: true,
          date: value.date,
          payload: null,
          replyTo: null,
          replyError: null,
        });
      },
      InitSuccess: (genesis, chain, value) => {
        this.programService.setStatus(value.programId, chain, genesis, program_entity_1.InitStatus.SUCCESS);
      },
      InitFailure: (genesis, chain, value) => {
        this.programService.setStatus(value.programId, chain, genesis, program_entity_1.InitStatus.FAILED);
      },
    };
  }
  async programData(params) {
    try {
      return (await this.programService.findProgram(params)) || { error: new errors_1.ProgramNotFound().message };
    } catch (error) {
      return { error: error.message };
    }
  }
  async allPrograms(params) {
    try {
      if (params.owner) {
        return await this.programService.getAllUserPrograms(params);
      }
      return await this.programService.getAllPrograms(params);
    } catch (error) {
      return { error: error.message };
    }
  }
  async addMeta(params) {
    try {
      return await this.metaService.addMeta(params);
    } catch (error) {
      return { error: error.message };
    }
  }
  async getMeta(params) {
    try {
      console.log(params);
      return await this.metaService.getMeta(params);
    } catch (error) {
      return { error: error.message };
    }
  }
  async addPayload(params) {
    try {
      return await this.messageService.addPayload(params);
    } catch (error) {
      return { error: error.message };
    }
  }
  async allMessages(params) {
    try {
      if (params.destination && params.source) {
        return await this.messageService.getAllMessages(params);
      }
      if (params.destination) {
        return await this.messageService.getIncoming(params);
      }
      return await this.messageService.getOutgoing(params);
    } catch (error) {
      return { error: error.message };
    }
  }
};
ConsumerService = __decorate(
  [
    (0, common_1.Injectable)(),
    __metadata('design:paramtypes', [
      programs_service_1.ProgramsService,
      messages_service_1.MessagesService,
      metadata_service_1.MetadataService,
    ]),
  ],
  ConsumerService,
);
exports.ConsumerService = ConsumerService;
//# sourceMappingURL=consumer.service.js.map
