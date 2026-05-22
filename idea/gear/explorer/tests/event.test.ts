import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { EVENT_1_ID, EVENT_SOURCE_1, EVENT_SOURCE_2, UNKNOWN_ID } from './fixtures.js';
import { assertList, err, ok, rpc } from './helpers.js';
import { getAgent, setup, teardown } from './setup.js';

const ID_REGEXP = /^0x[0-9a-f]{64}$/i;

beforeAll(setup);
afterAll(teardown);

describe('event.all response shape', () => {
  it('returns { result, count } with events', async () => {
    const res = await rpc(getAgent(), 'event.all', {});
    const { result, count } = assertList(ok(res.body));

    expect(count).toBeGreaterThan(0);
    expect(result.length).toBeGreaterThan(0);
  });

  it('event shape has expected fields', async () => {
    const res = await rpc(getAgent(), 'event.all', {});
    const { result } = ok(res.body);
    const event = result[0];

    expect(event).toHaveProperty('id');
    expect(event).toHaveProperty('source');
    expect(event).toHaveProperty('service');
    expect(event).toHaveProperty('name');
    expect(event).toHaveProperty('blockNumber');
    expect(event).toHaveProperty('timestamp');
    expect(event.id).toMatch(ID_REGEXP);
    expect(event.source).toMatch(ID_REGEXP);
  });
});

describe('event.data', () => {
  it('returns correct values for known event', async () => {
    const res = await rpc(getAgent(), 'event.data', { id: EVENT_1_ID });
    const event = ok(res.body);

    expect(event.id).toBe(EVENT_1_ID);
    expect(event.source).toBe(EVENT_SOURCE_1);
    expect(event.service).toBe('MemeFactory');
    expect(event.name).toBe('MemeCreated');
  });

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

describe('event.all filters', () => {
  it('source filter returns only events from that source', async () => {
    const res = await rpc(getAgent(), 'event.all', { source: EVENT_SOURCE_1 });
    const { result, count } = ok(res.body);

    expect(count).toBeGreaterThan(0);
    result.forEach((e: any) => void expect(e.source).toBe(EVENT_SOURCE_1));
  });

  it('source filter with second source returns its events', async () => {
    const res = await rpc(getAgent(), 'event.all', { source: EVENT_SOURCE_2 });
    const { result, count } = ok(res.body);

    expect(count).toBeGreaterThan(0);
    result.forEach((e: any) => void expect(e.source).toBe(EVENT_SOURCE_2));
  });

  it('service filter returns only matching events', async () => {
    const res = await rpc(getAgent(), 'event.all', { service: 'MemeFactory' });
    const { result, count } = ok(res.body);

    expect(count).toBeGreaterThan(0);
    result.forEach((e: any) => void expect(e.service).toBe('MemeFactory'));
  });

  it('name filter returns only matching events', async () => {
    const res = await rpc(getAgent(), 'event.all', { name: 'MemeCreated' });
    const { result, count } = ok(res.body);

    expect(count).toBeGreaterThan(0);
    result.forEach((e: any) => void expect(e.name).toBe('MemeCreated'));
  });

  it('name filter for GasUpdatedSuccessfully returns 1 event', async () => {
    const res = await rpc(getAgent(), 'event.all', { name: 'GasUpdatedSuccessfully' });
    const { result, count } = ok(res.body);

    expect(count).toBe(1);
    expect(result[0].source).toBe(EVENT_SOURCE_2);
  });

  it('unknown source returns empty result', async () => {
    const res = await rpc(getAgent(), 'event.all', { source: UNKNOWN_ID });
    const { result, count } = ok(res.body);

    expect(result).toHaveLength(0);
    expect(count).toBe(0);
  });

  it('from/to date range filters correctly', async () => {
    const res = await rpc(getAgent(), 'event.all', {
      from: '2024-05-07T00:00:00.000Z',
      to: '2024-05-07T23:59:59.000Z',
    });
    const { result, count } = ok(res.body);

    expect(count).toBe(2);
    result.forEach((e: any) => void expect(e.source).toBe(EVENT_SOURCE_1));
  });
});

describe('event.all pagination', () => {
  it('limit is respected', async () => {
    const res = await rpc(getAgent(), 'event.all', { limit: 2 });
    const { result } = ok(res.body);

    expect(result.length).toBeLessThanOrEqual(2);
  });

  it('limit > 100 is clamped to 100', async () => {
    const res = await rpc(getAgent(), 'event.all', { limit: 9999 });
    const { result } = ok(res.body);

    expect(result.length).toBeLessThanOrEqual(100);
  });
});
