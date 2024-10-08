import { DataSource, Repository } from 'typeorm';
import { Voucher } from 'indexer-db';
import { Pagination } from '../decorators';
import { ParamGetVoucher, ParamGetVouchers, ResManyResult } from '../types';
import { VoucherNotFound } from '../errors';
import { RequiredParams } from '../decorators/required';

export class VoucherService {
  private _repo: Repository<Voucher>;

  constructor(dataSource: DataSource) {
    this._repo = dataSource.getRepository(Voucher);
  }

  @RequiredParams(['id'])
  async getVoucher({ id }: ParamGetVoucher) {
    const v = await this._repo.findOne({ where: { id } });

    if (!v) {
      throw new VoucherNotFound();
    }

    return v;
  }

  @Pagination()
  public async getVouchers({
    id,
    owner,
    spender,
    declined,
    codeUploading,
    programs,
    limit,
    offset,
    expired,
  }: ParamGetVouchers): Promise<ResManyResult<Voucher>> {
    const qb = this._repo.createQueryBuilder('v');

    if (id) {
      if (id.length === 66) {
        qb.andWhere('v.id = :id', { id });
      } else {
        qb.andWhere('v.id LIKE :id', { id: `%${id}%` });
      }
    }

    if (declined !== undefined) {
      qb.andWhere('v.isDeclined = :declined', { declined });
    }

    if (codeUploading !== undefined) {
      qb.andWhere('v.codeUploading = :codeUploading', { codeUploading });
    }

    if (programs) {
      let where = '(';
      let params: Record<string, string> = {};

      for (let i = 0; i < programs.length; i++) {
        where += `${i > 0 ? ' OR ' : ''}v.programs::jsonb ? :p${i}`;
        params[`p${i}`] = programs[i];
      }
      qb.andWhere(where + ')', params);
      console.log(qb.getQuery());
    }

    if (expired !== undefined) {
      const now = new Date();
      if (expired) {
        qb.andWhere('v.expiryAt < :now', { now });
      } else {
        qb.andWhere('v.expiryAt >= :now', { now });
      }
    }

    if (owner && spender) {
      qb.andWhere('(v.owner = :owner OR v.spender = :spender)', { owner, spender });
    } else if (owner) {
      qb.andWhere('v.owner = :owner', { owner });
    } else if (spender) {
      qb.andWhere('v.spender = :spender', { spender });
    }

    qb.limit(limit || 20);
    qb.offset(offset || 0);
    qb.orderBy('v.issuedAt', 'DESC');

    const [result, count] = await qb.getManyAndCount();

    return { result, count };
  }
}
