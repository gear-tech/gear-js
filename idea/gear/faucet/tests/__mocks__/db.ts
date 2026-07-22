import { randomInt } from 'node:crypto';
import { vi } from 'vitest';

import type { FaucetRequest, MainnetChallenge, MainnetClaim, MainnetClaimEvent, UserLastSeen } from '../../src/database/index.js';

type Criterion = Record<string, any>;

export function matchesCriterion<T extends { [key: string]: any }>(item: T, criteria: Criterion) {
  const keys = Object.keys(criteria);

  return keys.every((key) => matchesValue(item[key], criteria[key]));
}

function matchesValue(value: any, criterion: any) {
  if (criterion && typeof criterion === 'object' && '_type' in criterion) {
    switch (criterion._type) {
      case 'in':
        return criterion._value.includes(value);
      case 'not':
        return value !== criterion._value;
      case 'moreThanOrEqual':
        return new Date(value).getTime() >= new Date(criterion._value).getTime();
      case 'lessThan':
        return new Date(value).getTime() < new Date(criterion._value).getTime();
      default:
        return value === criterion._value;
    }
  }

  return value === criterion;
}

export function createFakeRepository<T extends { id: any; timestamp?: Date; createdAt?: Date; [key: string]: any }>(saveDelay = true) {
  let data: Record<string | number, T> = {};

  const repo = {
    save: vi.fn(async (entity: T | T[]) => {
      if (saveDelay) await new Promise((resolve) => setTimeout(resolve, randomInt(70, 200)));
      const entities = Array.isArray(entity) ? entity : [entity];
      for (const item of entities) {
        if (!item.id) {
          item.id = Math.max(...Object.keys(data).map(Number), 0) + 1;
        }
        if (!item.timestamp) {
          item.timestamp = new Date();
        }
        if (!item.createdAt) {
          item.createdAt = new Date();
        }
        data[item.id] = item;
      }
      return entity;
    }),
    find: vi.fn(async ({ where }) => Object.values(data).filter((item) => matchesCriterion(item, where))),
    findOne: vi.fn(async ({ where }) => {
      const keys = Object.keys(where);
      if (keys.length === 1 && keys[0] === 'id') {
        return data[where.id];
      }
      return Object.values(data).find((item) => matchesCriterion(item, where));
    }),
    findBy: vi.fn(async (criteria) => {
      return Object.values(data).filter((item) => matchesCriterion(item, criteria));
    }),
    update: vi.fn(async (criteria, partialEntity) => {
      const keys = Object.keys(criteria);
      const records = Object.values(data).filter((item) =>
        keys.every((key) =>
          criteria[key] && typeof criteria[key] === 'object' && Array.isArray(criteria[key]._value)
            ? criteria[key]._value.includes(item[key])
            : matchesValue(item[key], criteria[key]),
        ),
      );
      for (const r of records) {
        Object.assign(r, partialEntity);
      }
    }),
    delete: vi.fn(async (criteria) => {
      const removed = Object.entries(data).filter(([, item]) => matchesCriterion(item, criteria));
      for (const [id] of removed) {
        delete data[id];
      }
      return { affected: removed.length };
    }),
    count: vi.fn(async ({ where }) => Object.values(data).filter((item) => matchesCriterion(item, where)).length),
    createQueryBuilder: vi.fn(() => createFakeQueryBuilder(() => Object.values(data))),
    clear: () => {
      data = {};
    },
    _data: () => data,
  };

  return repo;
}

function createFakeQueryBuilder<T extends { [key: string]: any }>(getData: () => T[]) {
  let rows = getData();
  let selectSum = false;
  let limitValue: number | undefined;

  const builder = {
    select: vi.fn((selection: string) => {
      selectSum = selection.includes('SUM');
      return builder;
    }),
    where: vi.fn((condition: string, params: Record<string, any>) => {
      rows = filterRows(rows, condition, params);
      return builder;
    }),
    andWhere: vi.fn((condition: string, params: Record<string, any>) => {
      rows = filterRows(rows, condition, params);
      return builder;
    }),
    orderBy: vi.fn(() => builder),
    limit: vi.fn((value: number) => {
      limitValue = value;
      return builder;
    }),
    setLock: vi.fn(() => builder),
    setOnLocked: vi.fn(() => builder),
    getMany: vi.fn(async () => (limitValue === undefined ? rows : rows.slice(0, limitValue))),
    getCount: vi.fn(async () => rows.length),
    getRawOne: vi.fn(async () => {
      if (!selectSum) return {};
      return { sum: rows.reduce((sum, row) => sum + BigInt(row.amount ?? '0'), 0n).toString() };
    }),
  };

  return builder;
}

function filterRows<T extends { [key: string]: any }>(rows: T[], condition: string, params: Record<string, any>) {
  if (condition.includes('claim.status = :status')) {
    return rows.filter((row) => row.status === params.status);
  }
  if (condition.includes('claim.status != :rejected')) {
    return rows.filter((row) => row.status !== params.rejected);
  }
  if (condition.includes('claim.status IN (:...statuses)')) {
    return rows.filter((row) => params.statuses.includes(row.status));
  }
  if (condition.includes('claim."createdAt" >= :dayAgo')) {
    return rows.filter((row) => new Date(row.createdAt).getTime() >= new Date(params.dayAgo).getTime());
  }
  if (condition.includes('claim."createdAt" >= :hourAgo')) {
    return rows.filter((row) => new Date(row.createdAt).getTime() >= new Date(params.hourAgo).getTime());
  }
  if (condition.includes('claim."payoutStartedAt" >= :dayAgo')) {
    return rows.filter((row) => row.payoutStartedAt && new Date(row.payoutStartedAt).getTime() >= new Date(params.dayAgo).getTime());
  }
  if (condition.includes('claim."payoutStartedAt" >= :hourAgo')) {
    return rows.filter((row) => row.payoutStartedAt && new Date(row.payoutStartedAt).getTime() >= new Date(params.hourAgo).getTime());
  }

  return rows;
}

export const repos = {
  FaucetRequest: createFakeRepository<FaucetRequest>(),
  MainnetChallenge: createFakeRepository<MainnetChallenge>(),
  MainnetClaim: createFakeRepository<MainnetClaim>(),
  MainnetClaimEvent: createFakeRepository<MainnetClaimEvent>(false),
  UserLastSeen: createFakeRepository<UserLastSeen>(),
};
