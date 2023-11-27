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
    const builder = this.repo
      .createQueryBuilder('program')
      .leftJoin('program.code', 'code')
      .addSelect(['code.id'])
      .where('program.genesis = :genesis', { genesis });

    if (owner) {
      builder.andWhere('program.owner = :owner', { owner });
    }

    if (status) {
      if (Array.isArray(status)) {
        builder.andWhere('program.status = IN(:status)', { status });
      } else {
        builder.andWhere('program.status = :status', { status });
      }
    }

    if (fromDate || toDate) {
      const parameters = getDatesFilter(fromDate, toDate);
      builder.andWhere('program.timestamp BETWEEN :fromDate AND :toDate', parameters);
    }

    if (query) {
      builder.andWhere('(program.id ILIKE :query OR program.name ILIKE :query)', { query: `%${query}%` });
    }

    const [programs, count] = await Promise.all([
      builder
        .take(limit || PAGINATION_LIMIT)
        .skip(offset || 0)
        .orderBy('program.timestamp', 'DESC')
        .getMany(),
      builder.getCount(),
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
