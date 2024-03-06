import { Between, DataSource, FindOptionsWhere, ILike, In, Repository } from 'typeorm';
import { decodeAddress } from '@gear-js/api';
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
import { PAGINATION_LIMIT } from '../common';

export class ProgramService {
  private repo: Repository<Program>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Program);
  }

  public async get({ id, genesis }: FindProgramParams): Promise<Program> {
    const program = await this.repo.findOne({
      where: { id, genesis },
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
    const commonOptions: FindOptionsWhere<Program> = { genesis };
    let options: FindOptionsWhere<Program>[] | FindOptionsWhere<Program>;

    if (owner) {
      commonOptions.owner = decodeAddress(owner);
    }

    if (status) {
      if (Array.isArray(status)) {
        commonOptions.status = In(status);
      } else {
        commonOptions.status = status;
      }
    }

    if (fromDate || toDate) {
      commonOptions.timestamp = Between(new Date(fromDate), new Date(toDate));
    }

    if (query) {
      options = [
        { id: ILike(`%${query}%`), ...commonOptions },
        { name: ILike(`%${query}%`), ...commonOptions },
      ];
    } else {
      options = commonOptions;
    }

    const [programs, count] = await Promise.all([
      this.repo.find({
        where: options,
        take: limit || PAGINATION_LIMIT,
        skip: offset || 0,
        order: { timestamp: 'DESC' },
      }),
      this.repo.count({ where: options }),
    ]);

    return {
      programs,
      count,
    };
  }

  public async save(programs: Program[]) {
    if (programs.length === 0) return;

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
    await this.repo.update({ metahash: In(hashes) }, { hasState: true });
  }

  public async getMetahash(id: string, genesis: string): Promise<string> {
    const program = await this.repo.findOne({ where: { id, genesis }, select: { metahash: true } });

    if (!program) {
      return null;
    }

    return program.metahash;
  }

  public async getNames(ids: string[], genesis: string): Promise<Record<string, string>> {
    const programs = await this.repo.find({ where: { id: In(ids), genesis }, select: { name: true, id: true } });

    const result = {};

    programs.forEach((program) => {
      result[program.id] = program.name;
    });

    return result;
  }

  public getManyIds(ids: string[], genesis: string) {
    return this.repo.find({ where: { id: In(ids), genesis }, select: { id: true, _id: true } });
  }

  public async removeDuplicates(genesis: string) {
    const programs = await this.repo.find({ where: { genesis }, select: { id: true, _id: true } });

    const ids: [string, string][] = programs.map((program) => [program.id, program._id]);

    const map = new Map<string, string>(ids);

    if (ids.length === map.size) {
      logger.info('No duplicates found', { genesis });
      return;
    }

    const primaryKeysToKeep = new Set(map.values());

    const toRemove = programs.filter((program) => !primaryKeysToKeep.has(program._id)).map(({ _id }) => _id);

    logger.info('Removing duplicate programs', { genesis, size: toRemove.length });

    for (let i = 0; i < toRemove.length; i += 5_000) {
      await this.repo.delete({ _id: In(toRemove.slice(i, i + 5_000)), genesis });
    }
  }
}
