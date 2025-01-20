import { Code } from 'gear-idea-indexer-db';
import { DataSource, Repository } from 'typeorm';
import { Pagination } from '../decorators';
import { ParamGetCode, ParamGetCodes, ParamSetCodeMeta, ResManyResult } from '../types';
import { CodeNotFound } from '../errors';
import { RequiredParams } from '../decorators/required';

export class CodeService {
  private _repo: Repository<Code>;

  constructor(dataSource: DataSource) {
    this._repo = dataSource.getRepository(Code);
  }

  @RequiredParams(['id'])
  async getCode({ id }: ParamGetCode): Promise<Code> {
    const c = await this._repo.findOne({ where: { id } });

    if (!c) {
      throw new CodeNotFound();
    }

    return c;
  }

  @Pagination()
  async getCodes({ uploadedBy, limit, offset, name, status, query }: ParamGetCodes): Promise<ResManyResult<Code>> {
    const qb = this._repo.createQueryBuilder('code');

    if (uploadedBy) {
      qb.andWhere('code.uploadedBy = :uploadedBy', { uploadedBy });
    }

    if (name) {
      qb.andWhere('code.name = :name', { name });
    }

    if (status) {
      if (Array.isArray(status)) {
        qb.andWhere('code.status IN (:...status)', { status });
      } else {
        qb.andWhere('code.status = :status', { status });
      }
    }

    if (query) {
      qb.andWhere('(code.id ILIKE :query OR code.name ILIKE :query)', { query: `%${query.toLowerCase()}%` });
    }

    qb.orderBy('code.timestamp', 'DESC').limit(limit).offset(offset);

    const [result, count] = await Promise.all([qb.getMany(), qb.getCount()]);

    return { result, count };
  }

  @RequiredParams(['id'])
  async setMeta({ id, metaType, name }: ParamSetCodeMeta): Promise<Code> {
    const code = await this._repo.findOne({ where: { id } });

    if (!code) {
      throw new CodeNotFound();
    }

    if (name) {
      code.name = name;
    }

    if (metaType) {
      code.metaType = metaType;
    }

    return this._repo.save(code);
  }
}
