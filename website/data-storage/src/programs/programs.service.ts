import {
  IProgram,
  InitStatus,
  FindProgramParams,
  GetAllProgramsParams,
  GetAllProgramsResult,
  GetAllUserProgramsParams,
  ProgramDataResult,
} from '@gear-js/interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meta } from '../entities/meta.entity';
import { getPaginationParams, getWhere, sleep } from '../utils';
import { ProgramNotFound } from '../errors';
import { Program } from '../entities/program.entity';

const logger = new Logger('ProgramDb');

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepo: Repository<Program>,
  ) {}

  async save({ id, genesis, owner, timestamp, blockHash }): Promise<IProgram> {
    const program = this.programRepo.create({
      id,
      owner,
      name: id,
      genesis,
      blockHash,
      timestamp: new Date(timestamp),
    });
    try {
      return await this.programRepo.save(program);
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
    const { genesis, owner, query } = params;
    const [result, total] = await this.programRepo.findAndCount({
      where: getWhere({ genesis, owner }, query, ['id', 'title', 'name']),
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

  async getAllPrograms(params: GetAllProgramsParams): Promise<GetAllProgramsResult> {
    const { query, genesis } = params;
    const [result, total] = await this.programRepo.findAndCount({
      where: getWhere({ genesis }, query, ['id', 'title', 'name']),
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
