import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meta } from 'src/metadata/entities/meta.entity';
import { Repository } from 'typeorm';
import { InitStatus, Program } from './entities/program.entity';
import { FindProgramParams, GetAllProgramsParams, GetAllProgramsResult } from 'src/interfaces';
import { PAGINATION_LIMIT } from 'src/config/configuration';

const logger = new Logger('ProgramDb');
@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepo: Repository<Program>,
  ) {}

  async save({ id, chain, genesis, owner, uploadedAt }): Promise<Program> {
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

  async addProgramInfo(
    id: string,
    genesis: string,
    name?: string,
    title?: string,
    meta?: Meta,
  ): Promise<Program> {
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
    const where = owner != null ? { id, genesis, owner } : { id, genesis };
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

  async setStatus(id: string, genesis: string, status: InitStatus): Promise<Program> {
    return new Promise((resolve) => {
      setTimeout(async () => {
        console.log(id, genesis, status);
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
