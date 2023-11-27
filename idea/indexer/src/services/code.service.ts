import { AddCodeNameParams, CodeStatus, GetAllCodeParams, GetAllCodeResult, GetCodeParams } from '@gear-js/common';
import { DataSource, Repository } from 'typeorm';

import { Code } from '../database/entities';
import { CodeNotFound, getDatesFilter, PAGINATION_LIMIT } from '../common';

export class CodeService {
  private repo: Repository<Code>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Code);
  }

  public save(codes: Code[]) {
    return this.repo.save(codes);
  }

  public async getMany({
    genesis,
    query,
    limit,
    offset,
    name,
    toDate,
    fromDate,
    uploadedBy,
  }: GetAllCodeParams): Promise<GetAllCodeResult> {
    const builder = this.repo.createQueryBuilder('code').where('code.genesis = :genesis', { genesis });

    if (fromDate || toDate) {
      const parameters = getDatesFilter(fromDate, toDate);
      builder.andWhere('code.timestamp BETWEEN :fromDate AND :toDate', parameters);
    }

    if (uploadedBy) {
      builder.andWhere('code.uploadedBy = :uploadedBy', { uploadedBy });
    }

    if (name) {
      builder.andWhere('code.name = :name', { name });
    }

    if (query) {
      builder.andWhere('(code.id = :query OR code.name = :query)', { query });
    }

    const [listCode, count] = await Promise.all([
      builder
        .take(limit || PAGINATION_LIMIT)
        .skip(offset || 0)
        .orderBy('code.timestamp', 'DESC')
        .getMany(),
      builder.getCount(),
    ]);

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
      relations: { programs: true },
    });

    if (!code) {
      throw new CodeNotFound();
    }
    return code;
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
