import { Program } from 'gear-idea-indexer-db';
import { DataSource, Repository } from 'typeorm';
import { Pagination } from '../decorators/index.js';
import { ParamGetProgram, ParamGetPrograms, ParamSetProgramMeta, ResManyResult } from '../types/index.js';
import { ProgramNotFound } from '../errors/index.js';
import { RequiredParams } from '../decorators/required.js';
import { hexToBuffer } from '../utils.js';

export class ProgramService {
  private _repo: Repository<Program>;

  constructor(dataSource: DataSource) {
    this._repo = dataSource.getRepository(Program);
  }

  @RequiredParams(['id'])
  async getProgram({ id }: ParamGetProgram): Promise<Program> {
    const p = await this._repo.findOne({ where: { id } });

    if (!p) {
      throw new ProgramNotFound();
    }

    return p;
  }

  @Pagination()
  async getPrograms({
    query,
    owner,
    codeId,
    name,
    status,
    limit,
    offset,
  }: ParamGetPrograms): Promise<ResManyResult<Program>> {
    const qb = this._repo.createQueryBuilder('program');

    if (owner) {
      qb.andWhere('program.owner = :owner', { owner: hexToBuffer(owner) });
    }

    if (codeId) {
      qb.andWhere('program.codeId = :codeId', { codeId: hexToBuffer(codeId) });
    }

    if (name) {
      qb.andWhere('program.name = :name', { name });
    }

    if (status) {
      if (Array.isArray(status)) {
        qb.andWhere('program.status IN (:...status)', { status });
      } else {
        qb.andWhere('program.status = :status', { status });
      }
    }

    if (query) {
      qb.andWhere("(encode(program.id, 'hex') ILIKE :query OR program.name ILIKE :query)", { query: `%${query.toLowerCase().replace('0x', '')}%` });
    }

    qb.orderBy('program.timestamp', 'DESC').limit(limit).offset(offset);

    console.log(qb.getSql(), qb.getParameters());

    const [result, count] = await Promise.all([qb.getMany(), qb.getCount()]);

    return { result, count };
  }

  async setMeta({ id, metaType, name }: ParamSetProgramMeta) {
    const program = await this._repo.findOne({ where: { id } });

    if (!program) {
      throw new ProgramNotFound();
    }

    if (name && program.name === program.id) {
      program.name = name;
    }

    if (metaType && !program.metaType) {
      program.metaType = metaType;
    }

    await this._repo.save(program);
  }
}
