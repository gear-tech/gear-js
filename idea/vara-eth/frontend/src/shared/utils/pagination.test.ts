import { describe, expect, it } from '@jest/globals';

import { getCachedPlaceholder } from './pagination';

type Item = { id: number };
type Page = { data: Item[]; total: number };

const makeCache =
  (entries: Record<string, Page>) =>
  (page: number, pageSize: number): Page | undefined =>
    entries[`${page}:${pageSize}`];

describe('getCachedPlaceholder', () => {
  const params = { smallPageSize: 10, largePageSize: 20 };

  describe('collapsing (small→large)', () => {
    it('merges two small pages into one large page', () => {
      const cache = makeCache({
        '1:10': { data: [{ id: 1 }, { id: 2 }], total: 4 },
        '2:10': { data: [{ id: 3 }, { id: 4 }], total: 4 },
      });

      const result = getCachedPlaceholder({ ...params, page: 1, pageSize: 20, getCache: cache });

      expect(result?.data).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
      expect(result?.total).toBe(4);
    });

    it('returns undefined when not all source small pages are cached', () => {
      const cache = makeCache({ '1:10': { data: [{ id: 1 }], total: 3 } });

      const result = getCachedPlaceholder({ ...params, page: 1, pageSize: 20, getCache: cache });

      expect(result).toBeUndefined();
    });

    it('returns undefined when no small pages are cached', () => {
      const result = getCachedPlaceholder({ ...params, page: 1, pageSize: 20, getCache: makeCache({}) });

      expect(result).toBeUndefined();
    });
  });

  describe('expanding (large→small)', () => {
    it('returns the first slice for page 1', () => {
      const cache = makeCache({
        '1:20': { data: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }], total: 4 },
      });

      const result = getCachedPlaceholder({ ...params, page: 1, pageSize: 10, getCache: cache });

      expect(result?.data).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
    });

    it('returns the second slice for page 2', () => {
      const items = Array.from({ length: 20 }, (_, i) => ({ id: i + 1 }));
      const cache = makeCache({ '1:20': { data: items, total: 20 } });

      const result = getCachedPlaceholder({ ...params, page: 2, pageSize: 10, getCache: cache });

      expect(result?.data).toEqual(items.slice(10, 20));
    });

    it('returns undefined when slice start is outside of cached data', () => {
      const cache = makeCache({ '1:20': { data: [{ id: 1 }, { id: 2 }], total: 2 } });

      const result = getCachedPlaceholder({ ...params, page: 2, pageSize: 10, getCache: cache });

      expect(result).toBeUndefined();
    });

    it('returns undefined when the large page is not cached', () => {
      const result = getCachedPlaceholder({ ...params, page: 1, pageSize: 10, getCache: makeCache({}) });

      expect(result).toBeUndefined();
    });
  });
});
