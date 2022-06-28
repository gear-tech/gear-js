import { sleep } from './sleep';
import { sqlWhereWithILike } from './sql-where-with-ilike';
import { IPaginationParams } from '@gear-js/common';
import { PAGINATION_LIMIT } from '../config/configuration';

function getPaginationParams(params: IPaginationParams): { take: number; skip: number } {
  return { take: params.limit || PAGINATION_LIMIT, skip: params.offset || 0 };
}

export { sleep, sqlWhereWithILike, getPaginationParams };
