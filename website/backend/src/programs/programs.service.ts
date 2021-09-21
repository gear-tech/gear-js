import { Metadata } from '@gear-js/api/types/src/interfaces/metadata';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
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

  async saveProgram({ user, hash, blockHash, name, uploadedAt, title, meta }) {
    let program = await this.findProgram(hash);
    if (program) {
      program = await this.programRepository.preload({
        hash: program.hash,
        name: name,
        title,
        meta,
      });
      return this.programRepository.save(program);
    }
    program = this.programRepository.create({
      hash: hash,
      blockHash: blockHash,
      name: name,
      user: user,
      uploadedAt: uploadedAt,
      programNumber: (await this.getLastProgramNumber(user)) + 1,
      title,
      meta,
    });

    return await this.programRepository.save(program);
  }

  updateProgram(program: Program) {
    this.programRepository.save(program);
  }

  async getLastProgramNumber(user: User) {
    const userPrograms = await this.programRepository.find({
      where: { user: user },
      select: ['programNumber'],
      order: { programNumber: 'ASC' },
    });
    if (userPrograms.length === 0) {
      return 0;
    }
    return userPrograms[userPrograms.length - 1].programNumber;
  }

  async getAllUserPrograms(
    user: User,
    limit?: number,
    offset?: number,
  ): Promise<{ programs: Program[]; count: number }> {
    const [result, total] = await this.programRepository.findAndCount({
      where: { user: user },
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
    limit?: number,
    offset?: number,
  ): Promise<{ programs: Program[]; count: number }> {
    const [result, total] = await this.programRepository.findAndCount({
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

  async findProgram(hash: string, user?: User): Promise<Program> {
    const where = user ? { hash, user } : { hash };
    try {
      const program = await this.programRepository.findOne(where, {
        relations: ['user'],
      });
      return program;
    } catch (error) {
      logger.error(error);
      return undefined;
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

  async initStatus(hash: string, status: string): Promise<Program> {
    const program = await this.findProgram(hash);
    if (program) {
      program.initStatus =
        status === 'InitSuccess' ? InitStatus.SUCCESS : InitStatus.FAILED;
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

  addMeta(program: Program, meta: Metadata): Promise<Program> {
    program.meta = meta;
    return this.programRepository.save(program);
  }
}
