import type { DataCache } from 'gear-idea-common';
import { cacheKey, MetaType, Program } from 'gear-idea-indexer-db';
import type { DataSource, Repository } from 'typeorm';
import { Pagination } from '../decorators/index.js';
import { RequiredParams } from '../decorators/required.js';
import { ProgramNotFound } from '../errors/index.js';
import { PROGRAM_STATUS_REVERSE, serializeProgram } from '../serializers.js';
import type { ParamGetProgram, ParamGetPrograms, ParamSetProgramMeta, ResManyResult } from '../types/index.js';
import { hexToBuffer } from '../utils.js';

const $24_HOURS = 24 * 60 * 1000;

export class ProgramService {
  private _repo: Repository<Program>;
  private readonly _genesis: string;
  private readonly _dataCache: DataCache;

  constructor(dataSource: DataSource, genesis: string, dataCache: DataCache) {
    this._repo = dataSource.getRepository(Program);
    this._genesis = genesis;
    this._dataCache = dataCache;
  }

  @RequiredParams(['id'])
  async getProgram({ id }: ParamGetProgram): Promise<Program> {
    const p = await this._findById(id);

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
    if (owner || codeId || name || status || query) {
      return this._queryPrograms({ query, owner, codeId, name, status, limit, offset });
    }

    const pageOffset = offset ?? 0;
    const isFirstPages = pageOffset <= 80;

    if (!isFirstPages) {
      return this._queryPrograms({ limit, offset });
    }

    return this._dataCache.getVersioned(
      cacheKey.programsPage(this._genesis, pageOffset),
      cacheKey.programsVersion(this._genesis),
      () => this._queryPrograms({ limit, offset }),
    );
  }

  private async _findById(id: string): Promise<Program | null> {
    const key = cacheKey.programData(this._genesis, id);
    const cached = await this._dataCache.get(key, () => this._repo.findOne({ where: { id } }), $24_HOURS);

    return cached ? (serializeProgram(cached) as Program) : null;
  }

  private async _queryPrograms(params: Partial<ParamGetPrograms>): Promise<ResManyResult<Program>> {
    const qb = this._repo.createQueryBuilder('program');

    if (params.owner) {
      qb.andWhere('program.owner = :owner', { owner: hexToBuffer(params.owner) });
    }

    if (params.codeId) {
      qb.andWhere('program.codeId = :codeId', { codeId: hexToBuffer(params.codeId) });
    }

    if (params.name) {
      qb.andWhere('program.name = :name', { name: params.name });
    }

    if (params.status) {
      const toNumeric = (s: string) => PROGRAM_STATUS_REVERSE[s] ?? s;
      if (Array.isArray(params.status)) {
        qb.andWhere('program.status IN (:...status)', { status: params.status.map(toNumeric) });
      } else {
        qb.andWhere('program.status = :status', { status: toNumeric(params.status) });
      }
    }

    if (params.query) {
      qb.andWhere('(program.id ILIKE :query OR program.name ILIKE :query)', {
        query: `%${params.query.toLowerCase()}%`,
      });
    }

    qb.orderBy('program.timestamp', 'DESC').limit(params.limit).offset(params.offset);

    const [result, count] = await Promise.all([qb.getMany(), qb.getCount()]);

    return { result: result.map(serializeProgram) as Program[], count };
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
      program.metaType = metaType === 'sails' ? MetaType.Sails : MetaType.Meta;
    }

    await this._repo.save(program);
  }
}
