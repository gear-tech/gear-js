import { IDates } from '@gear-js/common';
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';

function datesFilter(builder: SelectQueryBuilder<unknown>, fromDate: string, toDate: string): string {
  let query = '';

  if (toDate && fromDate) {
    query += ` AND ${builder.alias}.timestamp BETWEEN :fromDate AND :toDate`;
    builder.setParameters({ fromDate: new Date(fromDate), toDate: new Date(toDate) });
  } else if (toDate) {
    query += ` AND ${builder.alias}.timestamp <= :toDate`;
    builder.setParameters({ toDate: new Date(toDate) });
  } else if (fromDate) {
    query += ` AND ${builder.alias}.timestamp >= :fromDate`;
    builder.setParameters({ fromDate: new Date(fromDate) });
  }

  return query;
}

function whereFilter(builder: SelectQueryBuilder<unknown>, whereParams: Record<string, any>) {
  let query = '';

  if (whereParams) {
    for (const [key, value] of Object.entries(whereParams)) {
      if (value) {
        if (Array.isArray(value)) {
          query += ` AND ${builder.alias}.${key} IN (${value.map((_, i) => `:${key}${i}`)})`;
          value.forEach((v, i) => builder.setParameter(`${key}${i}`, v));
        } else if (value !== undefined) {
          if (typeof value === 'object') {
            query += ` AND ${builder.alias}.${key} ${value.operator} = :${key}`;
            builder.setParameter(key, value.value);
          } else {
            query += ` AND ${builder.alias}.${key} = :${key}`;
            builder.setParameter(key, value);
          }
        }
      }
    }
  }
  return query;
}

export function constructQueryBuilder<E extends ObjectLiteral = ObjectLiteral, K extends keyof E = keyof E>(
  repo: Repository<E>,
  genesis: string,
  whereParams: Record<K, any>,
  search: { fields: string[]; value?: string },
  { fromDate, toDate }: IDates,
  offset: number,
  limit: number,
  join?: string[],
  orderBy?: [string, 'DESC' | 'ASC'],
): SelectQueryBuilder<E> {
  const alias = 't';
  const builder = repo.createQueryBuilder(alias);

  if (join) {
    for (const prop of join) {
      builder.leftJoinAndSelect(`${alias}.${prop}`, prop);
    }
  }

  let where = `${alias}.genesis = :genesis`;
  builder.setParameters({ genesis });

  where += datesFilter(builder, fromDate, toDate);

  where += whereFilter(builder, whereParams);

  if (search && search.value) {
    for (const field of search.fields) {
      if (field.includes('.')) {
        builder.orWhere(`${where} AND ${field} like :search`);
      } else {
        builder.orWhere(`${where} AND ${alias}.${field} like :search`);
      }
    }
    builder.setParameter('search', `%${search.value}%`);
  } else {
    builder.where(where);
  }

  builder.limit(limit);
  builder.offset(offset);
  if (orderBy) {
    builder.orderBy(`${alias}.${orderBy[0]}`, orderBy[1]);
  }

  return builder;
}
