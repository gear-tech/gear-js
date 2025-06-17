import { randomInt } from 'node:crypto';
import { FaucetRequest, UserLastSeen } from '../../src/database';

export function createFakeRepository<T extends { id: any; timestamp: Date; [key: string]: any }>() {
  let data: Record<string | number, T> = {};

  return {
    save: jest.fn(async (entity: T | T[]) => {
      await new Promise((resolve) => setTimeout(resolve, randomInt(70, 200)));
      const entities = Array.isArray(entity) ? entity : [entity];
      for (const item of entities) {
        if (!item.id) {
          item.id = Math.max(...Object.keys(data).map(Number), 0) + 1;
        }
        if (!item.timestamp) {
          item.timestamp = new Date();
        }
        data[item.id] = item;
      }
      return entity;
    }),
    find: jest.fn(async ({ where }) => {
      const keys = Object.keys(where);
      return Object.values(data).filter((item) => keys.every((key) => (item[key] as any) == where[key]));
    }),
    findOne: jest.fn(async ({ where }) => {
      const keys = Object.keys(where);
      if (keys.length == 1 && keys[0] == 'id') {
        return data[where.id];
      } else {
        return Object.values(data).find((item) => keys.every((key) => item[key] == where[key]));
      }
    }),
    findBy: jest.fn(async (criteria) => {
      const keys = Object.keys(criteria);
      return Object.values(data).filter((item) =>
        keys.every((key) =>
          Array.isArray(criteria[key]) ? criteria[key].includes(item[key]) : criteria[key] == item[key],
        ),
      );
    }),
    update: jest.fn(async (criteria, partialEntity) => {
      const keys = Object.keys(criteria);
      const records = Object.values(data).filter((item) =>
        keys.every((key) =>
          Array.isArray(criteria[key]._value)
            ? criteria[key]._value.includes(item[key])
            : criteria[key]._value == item[key],
        ),
      );
      for (const r of records) {
        Object.assign(r, partialEntity);
      }
    }),
    clear: () => {
      data = {};
    },
    _data: () => data,
  };
}

export const repos = {
  FaucetRequest: createFakeRepository<FaucetRequest>(),
  UserLastSeen: createFakeRepository<UserLastSeen>(),
};
