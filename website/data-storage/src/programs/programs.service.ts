import {
  IProgram,
  InitStatus,
  FindProgramParams,
  GetAllProgramsParams,
  GetAllProgramsResult,
  GetAllUserProgramsParams,
} from '@gear-js/interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meta } from '../entities/meta.entity';
import { Program } from '../entities/program.entity';
import { ErrorLogger, getPaginationParams, getWhere } from '../utils';

const logger = new Logger('ProgramDb');
const errorLog = new ErrorLogger('ProgramsService');

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
      errorLog.error(error, 29);
      return;
    }
  }

  async addProgramInfo(id: string, genesis: string, name?: string, title?: string, meta?: Meta): Promise<IProgram> {
    const program = await this.findProgram({ id, genesis });
    if (program) {
      program.name = name;
      program.title = title;
      program.meta = meta;
      return this.programRepo.save(program);
    }
  }

  async getAllUserPrograms(params: GetAllUserProgramsParams): Promise<GetAllProgramsResult> {
    const { genesis, owner, term } = params;
    const [result, total] = await this.programRepo.findAndCount({
      where: getWhere({ genesis, owner }, term, ['id', 'title', 'name']),
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
    const { term, genesis } = params;
    const [result, total] = await this.programRepo.findAndCount({
      where: getWhere({ genesis }, term, ['id', 'title', 'name']),
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

  async findProgram(params: FindProgramParams): Promise<IProgram> {
    const { id, genesis, owner } = params;
    const where = owner ? { id, genesis, owner } : { id, genesis };
    try {
      const program = await this.programRepo.findOne(where, {
        relations: ['meta'],
      });
      return program;
    } catch (error) {
      logger.error(error, error.stack, '');
      return null;
    }
  }

  async setStatus(id: string, genesis: string, status: InitStatus): Promise<IProgram> {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const program = await this.findProgram({ id, genesis });
        if (program) {
          program.initStatus = status;
          resolve(await this.programRepo.save(program));
        }
      }, 1000);
    });
  }

  async isInDB(id: string, genesis: string): Promise<boolean> {
    if (await this.findProgram({ id, genesis })) {
      return true;
    } else {
      return false;
    }
  }
}
