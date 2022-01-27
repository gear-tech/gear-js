import {
  IProgram,
  InitStatus,
  FindProgramParams,
  GetAllProgramsParams,
  GetAllProgramsResult,
} from '@gear-js/backend-interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Meta } from '../entities/meta.entity';
import { Program } from '../entities/program.entity';
import { ErrorLogger, getPaginationParams } from '../utils';

/** Add backslashes before special characters in SQL `LIKE` clause. */
const escapeSqlLike = (x: string) => x.replace('%', '\\%').replace('_', '\\_');

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

  async getAllUserPrograms(params: GetAllProgramsParams): Promise<GetAllProgramsResult> {
    const [result, total] = await this.programRepo.findAndCount({
      where: { owner: params.owner, genesis: params.genesis },
      ...getPaginationParams(params),
      order: {
        uploadedAt: 'DESC',
      },
    });

    return {
      programs: result,
      count: total,
    };
  }

  async getAllPrograms(params: GetAllProgramsParams): Promise<GetAllProgramsResult> {
    const { term, genesis } = params;
    const likeTerm = term != null ? ILike(`%${escapeSqlLike(term)}%`) : void null;
    const [result, total] = await this.programRepo.findAndCount({
      where: [
        { genesis, id: likeTerm },
        { genesis, title: likeTerm },
        { genesis, owner: likeTerm },
        { genesis, name: likeTerm },
        { genesis, title: likeTerm },
      ],
      ...getPaginationParams(params),
      order: {
        uploadedAt: 'DESC',
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
        let program = await this.findProgram({ id, genesis });
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
