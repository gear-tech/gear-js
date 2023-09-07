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
    const commonWhere = { genesis, uploadedBy, name, timestamp: getDatesFilter(fromDate, toDate) };
    const where = [];

    if (query) {
      where.push({ ...commonWhere, id: query });
      where.push({ ...commonWhere, name: query });
    }

    const [listCode, count] = await Promise.all([
      this.repo.find({
        where: where.length > 0 ? where : commonWhere,
        take: limit || PAGINATION_LIMIT,
        skip: offset || 0,
        relations: ['code'],
        order: { timestamp: 'DESC' },
      }),
      this.repo.count({ where: { genesis } }),
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
