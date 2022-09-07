import { Injectable, Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import {
  FindProgramParams,
  GetAllProgramsParams,
  GetAllProgramsResult,
  GetAllUserProgramsParams,
  ProgramStatus,
  IProgram,
} from '@gear-js/common';

import { sleep } from '../utils/sleep';
import { ProgramNotFound } from '../common/errors';
import { Program } from '../database/entities';
import { CreateProgramInput, UpdateProgramDataInput } from './types';
import { ProgramRepo } from './program.repo';

@Injectable()
export class ProgramService {
  private logger: Logger = new Logger('ProgramService');
  constructor(private programRepository: ProgramRepo) {}

  public async createProgram(createProgramInput: CreateProgramInput): Promise<IProgram> {
    const programTypeDB = plainToClass(Program, {
      ...createProgramInput,
      name: createProgramInput.id,
      timestamp: new Date(createProgramInput.timestamp),
    });

    try {
      return await this.programRepository.save(programTypeDB);
    } catch (error) {
      this.logger.error(error, error.stack);
      return;
    }
  }

  public async updateProgramData(updateProgramDataInput: UpdateProgramDataInput): Promise<IProgram> {
    const { meta, id, genesis, name, title } = updateProgramDataInput;
    const program = await this.programRepository.getByIdAndGenesis(id, genesis);

    if (!program) {
      throw new ProgramNotFound();
    }

    program.name = name;
    program.title = title;
    program.meta = meta;
    return this.programRepository.save(program);
  }

  public async getAllUserPrograms(params: GetAllUserProgramsParams): Promise<GetAllProgramsResult> {
    const [programs, total] = await this.programRepository.listByOwnerAndGenesis(params);
    return {
      programs,
      count: total,
    };
  }

  public async getAllPrograms(params: GetAllProgramsParams): Promise<GetAllProgramsResult> {
    const [programs, total] = await this.programRepository.listPaginationByGenesis(params);
    return {
      programs,
      count: total,
    };
  }

  public async findProgram(params: FindProgramParams): Promise<Program> {
    const { id, genesis, owner } = params;
    let program: Program;

    if (this.isExistOwnerInParams(params)) {
      program = await this.programRepository.getByIdAndGenesisAndOwner(id, genesis, owner);
    } else {
      program = await this.programRepository.getByIdAndGenesis(id, genesis);
    }

    if (!program) {
      throw new ProgramNotFound();
    }
    return program;
  }

  async setStatus(id: string, genesis: string, status: ProgramStatus): Promise<IProgram> {
    await sleep(2000);
    const program = await this.programRepository.getByIdAndGenesis(id, genesis);
    program.status = status;
    return this.programRepository.save(program);
  }

  public async deleteRecords(genesis: string): Promise<Program[]> {
    const programs = await this.programRepository.listByGenesis(genesis);
    await this.programRepository.remove(programs);
    return programs;
  }

  private isExistOwnerInParams(findProgramParamInput: FindProgramParams): boolean {
    return findProgramParamInput.owner ? true : false;
  }
}
