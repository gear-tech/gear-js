import { DataSource, In, Repository } from 'typeorm';
import {
  AddProgramNameParams,
  FindProgramParams,
  GetAllProgramsParams,
  GetAllProgramsResult,
  IProgram,
  ProgramStatus,
  logger,
} from '@gear-js/common';

import { ProgramNotFound } from '../common/errors';
import { Code, Program } from '../database/entities';
import { PAGINATION_LIMIT, getDatesFilter } from '../common';

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
    const commonWhere = {
      genesis,
      owner,
      status: Array.isArray(status) ? In(status) : status,
      timestamp: getDatesFilter(fromDate, toDate),
    };

    const orWhere = [];

    if (query) {
      orWhere.push({ ...commonWhere, id: query });
      orWhere.push({ ...commonWhere, name: query });
      orWhere.push({ ...commonWhere, code: { id: query } });
    }

    const where = orWhere.length > 0 ? orWhere : commonWhere;

    const [programs, count] = await Promise.all([
      this.repo.find({
        where,
        take: limit || PAGINATION_LIMIT,
        skip: offset || 0,
        relations: ['code'],
        select: { code: { id: true } },
        order: { timestamp: 'DESC' },
      }),
      this.repo.count({ where }),
    ]);

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
      logger.error('Unable to set program status', { error });
    }
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
