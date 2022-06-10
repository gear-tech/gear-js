import { ILike } from 'typeorm';
import { IPaginationParams } from '@gear-js/common';

import { PAGINATION_LIMIT } from './config/configuration';

export function getPaginationParams(params: IPaginationParams): { take: number; skip: number } {
  return { take: params.limit || PAGINATION_LIMIT, skip: params.offset || 0 };
}

export const escapeSqlLike = (x: string) => x.replace('%', '\\%').replace('_', '\\_');

export function getWhere(strictParams: any, query: string | null | undefined, searchParams: string[]) {
  const likeTerm = query ? ILike(`%${escapeSqlLike(query)}%`) : void null;
  const where = likeTerm
    ? searchParams.map((param) => {
        const result = { ...strictParams };
        result[param] = likeTerm;
        return result;
      })
    : strictParams;
  return where;
}

export const sleep = (ms: number) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(true);
    }, ms),
  );
