import { DataSource, Repository } from 'typeorm';
import { config } from './config';
import { Voucher } from './model';

interface GetVouchersParams extends Partial<Pick<Voucher, 'owner' | 'spender' | 'codeUploading' | 'id' | 'programs'>> {
  declined?: boolean;
  expired?: boolean;
  includeAllPrograms?: boolean;
  limit?: number;
  offset?: number;
}

const dataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  database: config.db.database,
  password: config.db.password,
  synchronize: true,
  entities: [Voucher],
  logging: ['error'],
});

export class VoucherService {
  private _repo: Repository<Voucher>;

  async init() {
    await dataSource.initialize();
    this._repo = dataSource.getRepository(Voucher);
  }

  public getVoucher(id: string) {
    return this._repo.findOneBy({ id });
  }

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
  }: GetVouchersParams) {
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

    const [vouchers, count] = await qb.getManyAndCount();

    return {
      vouchers,
      count,
    };
  }
}
