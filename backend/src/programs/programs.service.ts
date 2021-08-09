import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from './entities/program.entity';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
  ) {}

  parseWASM(file) {
    if (file instanceof Buffer) {
      return file;
    } else {
      return file.buffer;
    }
  }

  async saveProgram({
    user,
    hash,
    blockHash,
    name,
    uploadedAt,
    title,
    initType,
    initOutType,
    incomingType,
    expectedType,
  }) {
    const program = this.programRepository.create({
      hash: hash,
      blockHash: blockHash,
      name: name,
      user: user,
      uploadedAt: uploadedAt,
      programNumber: (await this.getLastProgramNumber(user)) + 1,
      title,
      initType,
      initOutType,
      incomingType,
      expectedType,
    });
    return this.programRepository.save(program);
  }

  async getLastProgramNumber(user) {
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
    user,
    limit?, offset?
  ): Promise<{ programs: Program[]; count: number }> {
    const [result, total] = await this.programRepository.findAndCount({
      where: { user: user },
      take: limit || 13,
      skip: offset || 0,
      order: {
        uploadedAt: 'DESC'
      }
    })
    
    return {
      programs: result,
      count: total,
    };
  }

  async getAllPrograms(
    limit?, offset?
  ): Promise<{ programs: Program[]; count: number }> {
    const [result, total] = await this.programRepository.findAndCount({
      take: limit || 13,
      skip: offset || 0,
      order: {
        uploadedAt: 'DESC'
      }
    });

    return {
      programs: result,
      count: total,
    };
  }

  async getProgram(hash) {
    const program = await this.programRepository.findOne(
      { hash: hash },
      { relations: ['user'] },
    );
    return program;
  }

  async removeProgram(hash) {
    setTimeout(async () => {
      const program = await this.getProgram(hash);
      if (program) {
        this.programRepository.remove(program);
      }
    }, 10000);
  }
}
