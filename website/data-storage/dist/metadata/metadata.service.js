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
exports.MetadataService = void 0;
const typeorm_1 = require('typeorm');
const api_1 = require('@gear-js/api');
const common_1 = require('@nestjs/common');
const typeorm_2 = require('@nestjs/typeorm');
const errors_1 = require('../errors');
const programs_service_1 = require('../programs/programs.service');
const meta_entity_1 = require('./entities/meta.entity');
let MetadataService = class MetadataService {
  constructor(metaRepo, programService) {
    this.metaRepo = metaRepo;
    this.programService = programService;
  }
  async addMeta(params) {
    const program = await this.programService.findProgram({
      id: params.programId,
      chain: params.chain,
      genesis: params.genesis,
    });
    if (!program) {
      throw new errors_1.ProgramNotFound();
    }
    if (!api_1.GearKeyring.checkSign(program.owner, params.signature, params.meta)) {
      throw new errors_1.SignNotVerified();
    } else {
      const metadata = this.metaRepo.create({
        owner: program.owner,
        meta: typeof params.meta === 'string' ? params.meta : JSON.stringify(params.meta),
        metaFile: params.metaFile,
        program: program.id,
      });
      const savedMeta = await this.metaRepo.save(metadata);
      try {
        await this.programService.addProgramInfo(
          params.programId,
          params.chain,
          params.genesis,
          params.name,
          params.title,
          savedMeta,
        );
      } catch (error) {
        throw error;
      }
      return { status: 'Metadata added' };
    }
  }
  async getMeta(params) {
    const program = await this.programService.findProgram({
      id: params.programId,
      chain: params.chain,
      genesis: params.genesis,
    });
    if (!program) {
      throw new errors_1.ProgramNotFound();
    }
    const meta = await this.metaRepo.findOne({ program: params.programId });
    if (meta) {
      return { program: meta.program, meta: meta.meta, metaFile: meta.metaFile };
    } else {
      throw new errors_1.MetadataNotFound();
    }
  }
};
MetadataService = __decorate(
  [
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(meta_entity_1.Meta)),
    __metadata('design:paramtypes', [typeorm_1.Repository, programs_service_1.ProgramsService]),
  ],
  MetadataService,
);
exports.MetadataService = MetadataService;
//# sourceMappingURL=metadata.service.js.map
