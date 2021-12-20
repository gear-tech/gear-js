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
exports.ProgramsService = void 0;
const common_1 = require('@nestjs/common');
const typeorm_1 = require('@nestjs/typeorm');
const typeorm_2 = require('typeorm');
const program_entity_1 = require('./entities/program.entity');
const logger = new common_1.Logger('ProgramDb');
let ProgramsService = class ProgramsService {
  constructor(programRepo) {
    this.programRepo = programRepo;
  }
  async save({ id, chain, genesis, owner, uploadedAt }) {
    const program = this.programRepo.create({
      id,
      chain,
      genesis,
      owner,
      name: id,
      uploadedAt: new Date(uploadedAt),
    });
    return await this.programRepo.save(program);
  }
  async addProgramInfo(id, chain, genesis, name, title, meta) {
    const program = await this.findProgram({ id, chain, genesis });
    program.name = name;
    program.title = title;
    program.meta = meta;
    console.log(program);
    return this.programRepo.save(program);
  }
  async getAllUserPrograms(params) {
    const [result, total] = await this.programRepo.findAndCount({
      where: { owner: params.owner, chain: params.chain, genesis: params.genesis },
      take: params.limit || 20,
      skip: params.offset || 0,
      order: {
        uploadedAt: 'DESC',
      },
    });
    return {
      programs: result,
      count: total,
    };
  }
  async getAllPrograms(params) {
    const [result, total] = await this.programRepo.findAndCount({
      where: { chain: params.chain, genesis: params.genesis },
      take: params.limit || 20,
      skip: params.offset || 0,
      order: {
        uploadedAt: 'DESC',
      },
    });
    return {
      programs: result,
      count: total,
    };
  }
  async findProgram(params) {
    const { id, chain, genesis, owner } = params;
    const where = owner ? { id, chain, genesis, owner } : { id, chain, genesis };
    try {
      const program = await this.programRepo.findOne(where, {
        relations: ['meta'],
      });
      return program;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }
  async setStatus(id, chain, genesis, status) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        console.log(id, chain, genesis, status);
        let program = await this.findProgram({ id, chain, genesis });
        if (program) {
          program.initStatus = status;
          resolve(await this.programRepo.save(program));
        }
      }, 1000);
    });
  }
  async isInDB(id, chain, genesis) {
    if (await this.findProgram({ id, chain, genesis })) {
      return true;
    } else {
      return false;
    }
  }
};
ProgramsService = __decorate(
  [
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(program_entity_1.Program)),
    __metadata('design:paramtypes', [typeorm_2.Repository]),
  ],
  ProgramsService,
);
exports.ProgramsService = ProgramsService;
//# sourceMappingURL=programs.service.js.map
