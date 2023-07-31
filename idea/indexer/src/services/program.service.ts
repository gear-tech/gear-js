import { DataSource, In, Repository } from 'typeorm';
import {
  AddProgramNameParams,
  FindProgramParams,
  GetAllProgramsParams,
  GetAllProgramsResult,
  IProgram,
  ProgramStatus,
} from '@gear-js/common';

import { ProgramNotFound } from '../common/errors';
import { Code, Program } from '../database/entities';
import { PAGINATION_LIMIT, constructQueryBuilder } from '../common';

export class ProgramService {
  private repo: Repository<Program>;
  private codeRepo: Repository<Code>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Program);
    this.codeRepo = dataSource.getRepository(Code);
  }

  public async get({ id, genesis }: FindProgramParams): Promise<Program> {
    const program = await this.repo.findOne({
      where: { id, genesis },
      relations: ['code'],
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
      ['code'],
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
    // TODO: remove this method if it's not needed
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

  public async hasState(hashes: Array<string>) {
    const [programs, codes] = await Promise.all([
      this.repo.find({ where: { metahash: In(hashes), hasState: false } }),
      this.codeRepo.find({ where: { metahash: In(hashes), hasState: false } }),
    ]);
    for (const p of programs) {
      p.hasState = true;
    }

    for (const c of codes) {
      c.hasState = true;
    }

    await this.codeRepo.save(codes);
    await this.repo.save(programs);
  }
}
