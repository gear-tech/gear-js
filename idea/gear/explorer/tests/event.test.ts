import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setup, teardown, getAgent } from './setup.js';
import { rpc, ok, err, assertList } from './helpers.js';
import { UNKNOWN_ID } from './fixtures.js';

beforeAll(setup);
afterAll(teardown);

// The dump has no events (the event table is empty).

describe('event.all response shape', () => {
  it('returns { result: [], count: number }', async () => {
    const res = await rpc(getAgent(), 'event.all', {});
    assertList(ok(res.body));
  });

  it('returns empty result (no events in dump)', async () => {
    const res = await rpc(getAgent(), 'event.all', {});
    const { result, count } = ok(res.body);

    expect(result).toHaveLength(0);
    expect(count).toBe(0);
  });
});

describe('event.all pagination', () => {
  it('limit > 100 is clamped to 100 (count stays 0)', async () => {
    const res = await rpc(getAgent(), 'event.all', { limit: 9999 });
    const { result } = ok(res.body);

    expect(result.length).toBeLessThanOrEqual(100);
  });
});

describe('event.all filters', () => {
  it('source filter returns empty result', async () => {
    const res = await rpc(getAgent(), 'event.all', { source: UNKNOWN_ID });
    const { result, count } = ok(res.body);

    expect(result).toHaveLength(0);
    expect(count).toBe(0);
  });

  it('service filter returns empty result', async () => {
    const res = await rpc(getAgent(), 'event.all', { service: 'anything' });
    const { result, count } = ok(res.body);

    expect(result).toHaveLength(0);
    expect(count).toBe(0);
  });

  it('name filter returns empty result', async () => {
    const res = await rpc(getAgent(), 'event.all', { name: 'Transfer' });
    const { result, count } = ok(res.body);

    expect(result).toHaveLength(0);
    expect(count).toBe(0);
  });

  it('from/to date range returns empty result', async () => {
    const res = await rpc(getAgent(), 'event.all', {
      from: '2023-01-01T00:00:00.000Z',
      to: '2025-01-01T00:00:00.000Z',
    });
    const { result, count } = ok(res.body);

    expect(result).toHaveLength(0);
    expect(count).toBe(0);
  });
});

describe('event.data', () => {
  it('returns -32404 for unknown id', async () => {
    const res = await rpc(getAgent(), 'event.data', { id: UNKNOWN_ID });
    const error = err(res.body);

    expect(error.code).toBe(-32404);
    expect(error.message).toBe('Event not found');
  });

  it('returns -32602 when id is missing', async () => {
    const res = await rpc(getAgent(), 'event.data', {});
    expect(err(res.body).code).toBe(-32602);
  });
});
