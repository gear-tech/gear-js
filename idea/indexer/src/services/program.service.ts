import { DataSource, Repository } from 'typeorm';
import {
  AddProgramNameParams,
  FindProgramParams,
  GetAllProgramsParams,
  GetAllProgramsResult,
  IProgram,
  ProgramStatus,
} from '@gear-js/common';

import { ProgramNotFound } from '../common/errors';
import { Program } from '../database/entities';
import { constructQueryBuilder, PAGINATION_LIMIT } from '../common';

export class ProgramService {
  private repo: Repository<Program>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Program);
  }

  public async get({ id, genesis }: FindProgramParams): Promise<Program> {
    const program = await this.repo.findOne({
      where: { id, genesis },
      relations: ['meta', 'code'],
    });

    if (!program) {
      throw new ProgramNotFound();
    }
    return program;
  }

  public async getWithMessages({ id, genesis }: FindProgramParams): Promise<Program> {
    const program = await this.repo.findOne({
      where: { id, genesis },
      relations: ['meta', 'code', 'messages'],
    });

    if (!program) {
      throw new ProgramNotFound();
    }
    return program;
  }

  public async getAllPrograms({
    genesis,
    query,
    limit,
    offset,
    owner,
    toDate,
    fromDate,
    status,
  }: GetAllProgramsParams): Promise<GetAllProgramsResult> {
    const builder = constructQueryBuilder(
      this.repo,
      genesis,
      { owner, status },
      { fields: ['id', 'name', 'code.id'], value: query },
      { fromDate, toDate },
      offset || 0,
      limit || PAGINATION_LIMIT,
      ['code', { table: 'meta', columns: ['types'] }],
      { column: 'timestamp', sort: 'DESC' },
    );

    const [programs, count] = await builder.getManyAndCount();

    return {
      programs,
      count,
    };
  }

  public async save(programs: Program[]): Promise<Program[]> {
    return this.repo.save(programs);
  }

  async setStatus(id: string, genesis: string, status: ProgramStatus): Promise<IProgram> {
    const program = await this.get({ id, genesis });

    if (!program) {
      throw new ProgramNotFound();
    }

    program.status = status;

    try {
      const programs = await this.repo.save(program);

      return programs[0];
    } catch (error) {
      console.log(error);
    }
  }

  public async deleteRecords(genesis: string): Promise<void> {
    await this.repo.delete({ genesis });
  }

  public async setName({ id, genesis, name }: AddProgramNameParams): Promise<Program> {
    const program = await this.repo.findOneBy({ id, genesis });

    if (!program) throw new ProgramNotFound();

    if (program.name === program.id) {
      program.name = name;
      return this.repo.save(program);
    }
    return program;
  }
}
