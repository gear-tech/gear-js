import { Injectable, Logger } from '@nestjs/common';
import {
  FindProgramParams,
  GetAllProgramsParams,
  GetAllProgramsResult,
  GetMetaParams,
  IProgram,
  ProgramStatus,
} from '@gear-js/common';

import { MetadataNotFound, ProgramNotFound } from '../common/errors';
import { Meta, Program } from '../database/entities';
import { ProgramRepo } from './program.repo';

@Injectable()
export class ProgramService {
  private logger: Logger = new Logger(ProgramService.name);
  constructor(private programRepository: ProgramRepo) {}

  public async getAllPrograms(params: GetAllProgramsParams): Promise<GetAllProgramsResult> {
    const [programs, total] = await this.programRepository.list(params);
    return {
      programs,
      count: total,
    };
  }

  public async getProgramMeta(params: GetMetaParams): Promise<Meta> {
    const { id, genesis } = params;
    const program = await this.programRepository.getByIdMeta(id, genesis);

    if (program.meta === null) {
      throw new MetadataNotFound();
    }

    return program.meta;
  }

  public async createPrograms(programs: Program[]): Promise<Program[]> {
    try {
      return this.programRepository.save(programs);
    } catch (error) {
      this.logger.error(error, error.stack);
      return;
    }
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
    const program = await this.programRepository.getByIdAndGenesis(id, genesis);

    if (!program) {
      throw new ProgramNotFound();
    }
    program.status = status;

    try {
      const programs = await this.programRepository.save([program]);

      return programs[0];
    } catch (error) {
      console.log(error);
      this.logger.error(error);
    }
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
