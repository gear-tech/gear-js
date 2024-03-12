import {
  AddCodeNameParams,
  CodeStatus,
  GetAllCodeParams,
  GetAllCodeResult,
  GetCodeParams,
  logger,
} from '@gear-js/common';
import { Between, DataSource, FindOptionsWhere, ILike, In, Not, Repository } from 'typeorm';

import { Code } from '../database/entities';
import { CodeNotFound, PAGINATION_LIMIT } from '../common';

export class CodeService {
  private repo: Repository<Code>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Code);
  }

  public async save(codes: Code[]) {
    if (codes.length === 0) return;

    await this.repo.save(codes);
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
    const commonOptions: FindOptionsWhere<Code> = { genesis };
    let options: FindOptionsWhere<Code>[] | FindOptionsWhere<Code>;

    if (fromDate || toDate) {
      commonOptions.timestamp = Between(new Date(fromDate), new Date(toDate));
    }

    if (uploadedBy) {
      commonOptions.uploadedBy = uploadedBy;
    }

    if (name) {
      commonOptions.name = name;
    }

    if (query) {
      options = [
        { id: ILike(`%${query}%`), ...commonOptions },
        { name: ILike(`%${query}%`), ...commonOptions },
      ];
    } else {
      options = commonOptions;
    }

    const [listCode, count] = await Promise.all([
      this.repo.find({
        where: options,
        take: limit || PAGINATION_LIMIT,
        skip: offset || 0,
        order: { timestamp: 'DESC' },
      }),
      this.repo.count({ where: options }),
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

  public async getMetahash(codeId: string): Promise<string> {
    const code = await this.repo.findOne({ select: { metahash: true }, where: { id: codeId } });
    if (!code) {
      return null;
    }

    return code.metahash;
  }

  public async hasState(hashes: Array<string>) {
    await this.repo.update({ metahash: In(hashes) }, { hasState: true });
  }

  public getManyIds(ids: string[], genesis: string): Promise<Code[]> {
    return this.repo.find({ where: { id: In(ids), genesis }, select: { id: true, _id: true } });
  }

  public async removeDuplicates(genesis: string) {
    const codes = await this.repo.find({ where: { genesis }, select: { id: true, _id: true } });

    const ids: [string, string][] = codes.map((c) => [c.id, c._id]);

    const map = new Map<string, string>(ids);

    if (ids.length === map.size) {
      logger.info('No duplicates found', { genesis });
      return;
    }

    const primaryKeysToKeep = new Set(map.values());

    const toRemove = codes.filter((c) => !primaryKeysToKeep.has(c._id));

    logger.info('Removing duplicate programs', { genesis, size: toRemove.length });

    await this.repo.remove(toRemove, { chunk: 5_000 });
  }

  public async getAllNotInList(ids: string[], genesis: string): Promise<string[]> {
    const codes = await this.repo.find({ where: { id: In(ids), genesis }, select: { id: true } });

    const syncedIds = codes.map((c) => c.id);

    return ids.filter((id) => !syncedIds.includes(id));
  }
}
