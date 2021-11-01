import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meta } from 'src/metadata/entities/meta.entity';
import { Repository } from 'typeorm';
import { InitStatus, Program } from './entities/program.entity';

const logger = new Logger('ProgramDb');
@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepo: Repository<Program>,
  ) {}

  async save({ id, chain, owner, uploadedAt }): Promise<Program> {
    const program = this.programRepo.create({
      id,
      chain,
      owner,
      name: id,
      uploadedAt: new Date(uploadedAt),
    });
    return await this.programRepo.save(program);
  }

  async addProgramInfo(
    id: string,
    chain: string,
    name?: string,
    title?: string,
    meta?: Meta,
  ): Promise<Program> {
    const program = await this.programRepo.preload({
      id,
      chain,
      name,
      title,
      meta,
    });
    return this.programRepo.save(program);
  }

  async getAllUserPrograms(
    owner: string,
    chain: string,
    limit?: number,
    offset?: number,
  ): Promise<{ programs: Program[]; count: number }> {
    owner;
    const [result, total] = await this.programRepo.findAndCount({
      where: { owner, chain },
      take: limit || 20,
      skip: offset || 0,
      order: {
        uploadedAt: 'DESC',
      },
    });

    return {
      programs: result,
      count: total,
    };
  }

  async getAllPrograms(
    chain: string,
    limit?: number,
    offset?: number,
  ): Promise<{ programs: Program[]; count: number }> {
    const [result, total] = await this.programRepo.findAndCount({
      where: { chain },
      take: limit || 20,
      skip: offset || 0,
      order: {
        uploadedAt: 'DESC',
      },
    });

    return {
      programs: result,
      count: total,
    };
  }

  async findProgram(
    id: string,
    chain: string,
    owner?: string,
  ): Promise<Program> {
    const where = owner ? { id, chain, owner } : { id, chain };
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

  async removeProgram(id: string, chain: string) {
    const program = await this.findProgram(id, chain);
    if (program) {
      this.programRepo.remove(program);
    }
  }

  async setStatus(
    id: string,
    chain: string,
    status: InitStatus,
  ): Promise<Program> {
    const program = await this.findProgram(id, chain);
    if (program) {
      program.initStatus = status;
      return this.programRepo.save(program);
    }
  }

  async isInDB(id: string, chain: string): Promise<boolean> {
    if (await this.findProgram(id, chain)) {
      return true;
    } else {
      return false;
    }
  }
}
