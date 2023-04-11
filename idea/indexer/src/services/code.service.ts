import {
  AddCodeNameParams,
  CodeStatus,
  GetAllCodeParams,
  GetAllCodeResult,
  GetCodeParams,
  GetMetaByCodeParams,
} from '@gear-js/common';
import { DataSource, Repository } from 'typeorm';

import { Code, Meta } from '../database/entities';
import { CodeNotFound, MetadataNotFound, constructQueryBuilder, PAGINATION_LIMIT } from '../common';

export class CodeService {
  private repo: Repository<Code>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Code);
  }

  public save(codes: Code[]) {
    return this.repo.save(codes);
  }

  public async getMany(params: GetAllCodeParams): Promise<GetAllCodeResult> {
    const { genesis, query, limit, offset, name, toDate, fromDate, uploadedBy } = params;

    const builder = constructQueryBuilder(
      this.repo,
      genesis,
      { uploadedBy, name },
      { fields: ['id', 'name'], value: query },
      { fromDate, toDate },
      offset || 0,
      limit || PAGINATION_LIMIT,
      [{ table: 'meta', columns: ['types', 'hex'] }],
      { column: 'timestamp', sort: 'DESC' },
    );

    const [listCode, count] = await builder.getManyAndCount();

    return {
      listCode,
      count,
    };
  }

  public async get({ id, genesis }: GetCodeParams): Promise<Code> {
    const code = await this.repo.findOne({
      where: {
        id,
        genesis,
      },
      relations: ['programs', 'meta'],
      select: ['meta'],
    });

    if (!code) {
      throw new CodeNotFound();
    }
    return code;
  }

  public async getMeta(params: GetMetaByCodeParams): Promise<Meta> {
    const code = await this.get(params);

    if (!code.meta?.hex) throw new MetadataNotFound();

    return code.meta;
  }

  public async setStatus(id: string, genesis: string, status: CodeStatus, expiration: string): Promise<Code> {
    const code = await this.get({ id, genesis });
    code.status = status;
    code.expiration = expiration;

    return this.repo.save(code);
  }

  public async deleteRecords(genesis: string): Promise<void> {
    await this.repo.delete({ genesis });
  }

  public async setName({ id, genesis, name }: AddCodeNameParams): Promise<Code> {
    const code = await this.repo.findOneBy({ id, genesis });

    if (!code) throw new CodeNotFound();

    if (code.name === code.id) {
      code.name = name;
      return this.repo.save(code);
    }

    return code;
  }
}
