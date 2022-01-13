import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meta } from 'src/metadata/entities/meta.entity';
import { Repository } from 'typeorm';
import { InitStatus, Program } from './entities/program.entity';
import { FindProgramParams, GetAllProgramsParams, GetAllProgramsResult } from 'src/interfaces';
import { PAGINATION_LIMIT } from 'src/config/configuration';
import { ErrorLogger } from 'src/utils';

const logger = new Logger('ProgramDb');
const errorLog = new ErrorLogger('ProgramsService');

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepo: Repository<Program>,
  ) {}

  async save({ id, genesis, owner, uploadedAt }): Promise<Program> {
    const program = this.programRepo.create({
      id,
      genesis,
      owner,
      name: id,
      uploadedAt: new Date(uploadedAt),
    });
    try {
      return await this.programRepo.save(program);
    } catch (error) {
      errorLog.error(error, 29);
      return;
    }
  }

  async addProgramInfo(id: string, genesis: string, name?: string, title?: string, meta?: Meta): Promise<Program> {
    const program = await this.findProgram({ id, genesis });
    program.name = name;
    program.title = title;
    program.meta = meta;
    console.log(program);
    return this.programRepo.save(program);
  }

  async getAllUserPrograms(params: GetAllProgramsParams): Promise<GetAllProgramsResult> {
    const [result, total] = await this.programRepo.findAndCount({
      where: { owner: params.owner, genesis: params.genesis },
      take: params.limit || PAGINATION_LIMIT,
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

  async getAllPrograms(params: GetAllProgramsParams): Promise<GetAllProgramsResult> {
    const [result, total] = await this.programRepo.findAndCount({
      where: { genesis: params.genesis },
      take: params.limit || PAGINATION_LIMIT,
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

  async findProgram(params: FindProgramParams): Promise<Program> {
    const { id, genesis, owner } = params;
    try {
      const program = await this.programRepo.findOne(
        {
          id,
          genesis,
          owner: owner || void owner,
        },
        {
          relations: ['meta'],
        },
      );
      return program;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  async setStatus(id: string, genesis: string, status: InitStatus): Promise<Program> {
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
