import { Injectable, Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import {
  FindProgramParams,
  GetAllProgramsParams,
  GetAllProgramsResult,
  IProgram,
} from '@gear-js/common';

import { ProgramNotFound } from '../common/errors';
import { Program } from '../database/entities';
import { CreateProgramInput, UpdateProgramDataInput } from './types';
import { ProgramRepo } from './program.repo';
import { ProgramStatus } from '../common/enums';

@Injectable()
export class ProgramService {
  private logger: Logger = new Logger(ProgramService.name);
  constructor(private programRepository: ProgramRepo) {}

  public async getAllPrograms(params: GetAllProgramsParams): Promise<GetAllProgramsResult> {
    const [programs, total] = await this.programRepository.listPaginationByGenesis(params);
    return {
      programs,
      count: total,
    };
  }

  public async createPrograms(createProgramsInput: CreateProgramInput[]): Promise<Program[]> {

    const createProgramsDBType = createProgramsInput.map((createProgramInput) => {
      return plainToClass(Program, {
        ...createProgramInput,
        name: createProgramInput.id,
        timestamp: new Date(createProgramInput.timestamp),
      });
    });

    try {
      return this.programRepository.save(createProgramsDBType);
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

    try {
      const programs = await this.programRepository.save([program]);

      return programs[0];
    } catch (error) {
      console.log(error);
      this.logger.error(error);
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
