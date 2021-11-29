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
    private readonly programRepository: Repository<Program>,
  ) {}

  parseWASM(file: any) {
    if (file instanceof Buffer) {
      return file;
    } else {
      return file.buffer;
    }
  }

  async saveProgram({ owner, uploadedAt, hash, chain }) {
    const program = this.programRepository.create({
      hash,
      owner,
      chain,
      name: hash,
      uploadedAt: uploadedAt,
      programNumber: (await this.getLastProgramNumber(owner)) + 1,
    });
    return await this.programRepository.save(program);
  }

  async addProgramInfo(programId: string, name?: string, title?: string, meta?: Meta) {
    let program = await this.findProgram(programId);
    if (program) {
      program.meta = meta;
      program.title = title;
      program.name = name;
      return this.programRepository.save(program);
    }
    return this.programRepository.save(program);
  }

  async getLastProgramNumber(owner: string) {
    const userPrograms = await this.programRepository.find({
      where: { owner },
      select: ['programNumber'],
      order: { programNumber: 'ASC' },
    });
    if (userPrograms.length === 0) {
      return 0;
    }
    return userPrograms[userPrograms.length - 1].programNumber;
  }

  async getAllUserPrograms(
    owner: string,
    chain: string,
    limit?: number,
    offset?: number,
  ): Promise<{ programs: Program[]; count: number }> {
    owner;
    const [result, total] = await this.programRepository.findAndCount({
      where: { owner, chain },
      take: limit || 13,
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
    const [result, total] = await this.programRepository.findAndCount({
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

  async findProgram(hash: string, owner?: string): Promise<Program> {
    const where = owner ? { hash, owner } : { hash };
    try {
      const program = await this.programRepository.findOne(where, {
        relations: ['meta'],
      });
      return program;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  async removeProgram(hash: string) {
    setTimeout(async () => {
      const program = await this.findProgram(hash);
      if (program) {
        this.programRepository.remove(program);
      }
    }, 10000);
  }

  async initStatus(hash: string, status: InitStatus): Promise<Program> {
    const program = await this.findProgram(hash);
    if (program) {
      program.initStatus = status;
      return this.programRepository.save(program);
    }
  }

  async isInDB(hash) {
    if (await this.findProgram(hash)) {
      return true;
    } else {
      return false;
    }
  }
}
