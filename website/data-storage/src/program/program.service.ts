import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  FindProgramParams,
  GetAllProgramsParams,
  GetAllProgramsResult,
  GetAllUserProgramsParams,
  InitStatus,
  IProgram,
  ProgramDataResult,
} from '@gear-js/common';

import { Meta } from '../entities/meta.entity';
import { getPaginationParams, sqlWhereWithILike, sleep } from '../utils';
import { ProgramNotFound } from '../errors';
import { Program } from '../entities/program.entity';
import { CreateProgramInput } from './types';
import { plainToClass } from 'class-transformer';
import { ProgramRepo } from './program.repo';

const logger = new Logger('ProgramDb');

@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepo: Repository<Program>,
    private programRepository: ProgramRepo,
  ) {}

  async createProgram(createProgramInput: CreateProgramInput): Promise<IProgram | void> {
    const programTypeDB = plainToClass(Program, {
      ...createProgramInput,
      name: createProgramInput.id,
      timestamp: new Date(createProgramInput.timestamp),
    });

    try {
      return await this.programRepository.save(programTypeDB);
    } catch (error) {
      logger.error(error, error.stack);
      return;
    }
  }

  async addProgramInfo(id: string, genesis: string, name?: string, title?: string, meta?: Meta): Promise<IProgram> {
    const program = await this.findProgram({ id, genesis });
    program.name = name;
    program.title = title;
    program.meta = meta;
    return this.programRepo.save(program);
  }

  async getAllUserPrograms(params: GetAllUserProgramsParams): Promise<GetAllProgramsResult> {
    const [programs, total] = await this.programRepository.listByOwnerAndGenesis(params);
    return {
      programs,
      count: total,
    };
  }

  async getAllPrograms(params: GetAllProgramsParams): Promise<GetAllProgramsResult> {
    const { query, genesis } = params;
    const [result, total] = await this.programRepo.findAndCount({
      where: sqlWhereWithILike({ genesis }, query, ['id', 'title', 'name']),
      ...getPaginationParams(params),
      order: {
        timestamp: 'DESC',
      },
    });
    return {
      programs: result,
      count: total,
    };
  }

  async findProgram(params: FindProgramParams): Promise<ProgramDataResult> {
    const { id, genesis, owner } = params;
    const where = owner ? { id, genesis, owner } : { id, genesis };
    const program = await this.programRepo.findOne({
      where,
      select: {
        id: true,
        genesis: true,
        blockHash: true,
        timestamp: true,
        owner: true,
        name: true,
        initStatus: true,
        title: true,
        meta: { meta: true },
      },
      relations: ['meta'],
    });
    if (!program) {
      throw new ProgramNotFound();
    }
    return program;
  }

  async setStatus(id: string, genesis: string, status: InitStatus): Promise<IProgram> {
    await sleep(2000);
    const program = await this.findProgram({ id, genesis });
    program.initStatus = status;
    return this.programRepo.save(program);
  }

  async deleteRecords(genesis: string): Promise<any> {
    const programs = await this.programRepo.find({ where: { genesis } });
    await this.programRepo.remove(programs);
    return programs;
  }
}
