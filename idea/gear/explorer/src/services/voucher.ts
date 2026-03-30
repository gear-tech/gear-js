import { DataSource, Repository } from 'typeorm';
import { Voucher } from 'gear-idea-indexer-db';
import { Pagination } from '../decorators/index.js';
import { ParamGetVoucher, ParamGetVouchers, ResManyResult } from '../types/index.js';
import { VoucherNotFound } from '../errors/index.js';
import { RequiredParams } from '../decorators/required.js';
import { hexToBuffer } from '../utils.js';

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
    includeAllPrograms,
  }: ParamGetVouchers): Promise<ResManyResult<Voucher>> {
    const qb = this._repo.createQueryBuilder('v');

    if (id) {
      if (id.length === 66) {
        qb.andWhere('v.id = :id', { id: hexToBuffer(id) });
      } else {
        qb.andWhere("encode(v.id, 'hex') LIKE :id", { id: `%${id.toLowerCase().replace('0x', '')}%` });
      }
    }

    if (declined !== undefined) {
      qb.andWhere('v.isDeclined = :declined', { declined });
    }

    if (codeUploading !== undefined) {
      qb.andWhere('v.codeUploading = :codeUploading', { codeUploading });
    }

    if (programs || includeAllPrograms) {
      const params: Record<string, string> = {};

      const conditions =
        programs?.map((_, i) => {
          params[`p${i}`] = programs[i];
          return `v.programs::jsonb ? :p${i}`;
        }) || [];

      if (includeAllPrograms) {
        conditions.push(`jsonb_array_length(v.programs) = 0`);
      }

      qb.andWhere(`(${conditions.join(' OR ')})`, params);
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
      qb.andWhere('(v.owner = :owner OR v.spender = :spender)', { owner: hexToBuffer(owner), spender: hexToBuffer(spender) });
    } else if (owner) {
      qb.andWhere('v.owner = :owner', { owner: hexToBuffer(owner) });
    } else if (spender) {
      qb.andWhere('v.spender = :spender', { spender: hexToBuffer(spender) });
    }

    qb.limit(limit || 20);
    qb.offset(offset || 0);
    qb.orderBy('v.issuedAt', 'DESC');

    const [result, count] = await qb.getManyAndCount();

    return { result, count };
  }
}
