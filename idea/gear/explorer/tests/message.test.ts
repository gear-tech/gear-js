import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setup, teardown, getAgent } from './setup.js';
import { rpc, ok, err, assertList } from './helpers.js';
import {
  PROGRAM_ACTIVE_ID,
  PROGRAM_TERMINATED_ID,
  PROGRAM_OWNER,
  MSG_TO_1_ID,
  MSG_TO_2_ID,
  MSG_FROM_1_ID,
  MSG_FROM_2_ID,
  UNKNOWN_ID,
} from './fixtures.js';

beforeAll(setup);
afterAll(teardown);

// ═══════════════════════════════════════════════════════════════════════════════
// messageToProgram
// ═══════════════════════════════════════════════════════════════════════════════

describe('messageToProgram.data response shape', () => {
  it('has all expected fields', async () => {
    const res = await rpc(getAgent(), 'messageToProgram.data', { id: MSG_TO_1_ID });
    const msg = ok(res.body);

    expect(msg).toHaveProperty('id');
    expect(msg).toHaveProperty('destination');
    expect(msg).toHaveProperty('source');
    expect(msg).toHaveProperty('payload');
    expect(msg).toHaveProperty('value');
    expect(msg).toHaveProperty('entry');
    expect(msg).toHaveProperty('replyToMessageId');
    expect(msg).toHaveProperty('processedWithPanic');
    expect(msg).toHaveProperty('service');
    expect(msg).toHaveProperty('fn');
    expect(msg).toHaveProperty('isSailsIdlV2');
    expect(msg).toHaveProperty('header');
    expect(msg).toHaveProperty('routeIdx');
    expect(msg).toHaveProperty('blockHash');
    expect(msg).toHaveProperty('blockNumber');
    expect(msg).toHaveProperty('timestamp');
  });

  it('returns correct values for init message', async () => {
    const res = await rpc(getAgent(), 'messageToProgram.data', { id: MSG_TO_1_ID });
    const msg = ok(res.body);

    expect(msg.id).toBe(MSG_TO_1_ID);
    expect(msg.destination).toBe(PROGRAM_ACTIVE_ID);
    expect(msg.source).toBe(PROGRAM_OWNER);
    expect(msg.entry).toBe('init');
    expect(msg.service).toBe('Token A');
    expect(msg.fn).toBe('TKNA');
    expect(msg.processedWithPanic).toBe(false);
    expect(msg.isSailsIdlV2).toBe(false);
  });

  it('processedWithPanic is true for failed init', async () => {
    const res = await rpc(getAgent(), 'messageToProgram.data', { id: MSG_TO_2_ID });
    const msg = ok(res.body);

    expect(msg.processedWithPanic).toBe(true);
  });
});

describe('messageToProgram.data', () => {
  it('returns -32404 for unknown id', async () => {
    const res = await rpc(getAgent(), 'messageToProgram.data', { id: UNKNOWN_ID });
    const error = err(res.body);

    expect(error.code).toBe(-32404);
  });

  it('returns -32602 when id param is missing', async () => {
    const res = await rpc(getAgent(), 'messageToProgram.data', {});
    const error = err(res.body);

    expect(error.code).toBe(-32602);
  });
});

describe('messageToProgram.all response shape', () => {
  it('returns { result: [], count: number }', async () => {
    const res = await rpc(getAgent(), 'messageToProgram.all', {});
    assertList(ok(res.body));
  });
});

describe('messageToProgram.all pagination', () => {
  it('default limit is 20', async () => {
    const res = await rpc(getAgent(), 'messageToProgram.all', {});
    expect(ok(res.body).result.length).toBeLessThanOrEqual(20);
  });

  it('limit is respected', async () => {
    const res = await rpc(getAgent(), 'messageToProgram.all', { limit: 3 });
    expect(ok(res.body).result.length).toBeLessThanOrEqual(3);
  });

  it('limit > 100 is clamped to 100', async () => {
    const res = await rpc(getAgent(), 'messageToProgram.all', { limit: 9999 });
    expect(ok(res.body).result.length).toBeLessThanOrEqual(100);
  });

  it('results are ordered DESC by timestamp', async () => {
    const res = await rpc(getAgent(), 'messageToProgram.all', { limit: 10 });
    const { result } = ok(res.body);

    const timestamps = result.map((m: any) => new Date(m.timestamp).getTime());
    for (let i = 1; i < timestamps.length; i++) {
      expect(timestamps[i]).toBeLessThanOrEqual(timestamps[i - 1]);
    }
  });
});

describe('messageToProgram.all filters', () => {
  it('destination filter returns only messages for that program', async () => {
    const res = await rpc(getAgent(), 'messageToProgram.all', {
      destination: PROGRAM_ACTIVE_ID,
      limit: 50,
    });
    const { result, count } = ok(res.body);

    expect(count).toBeGreaterThan(0);
    result.forEach((m: any) => expect(m.destination).toBe(PROGRAM_ACTIVE_ID));
  });

  it('source filter returns only messages from that address', async () => {
    const res = await rpc(getAgent(), 'messageToProgram.all', {
      source: PROGRAM_OWNER,
      limit: 50,
    });
    const { result, count } = ok(res.body);

    expect(count).toBeGreaterThan(0);
    result.forEach((m: any) => expect(m.source).toBe(PROGRAM_OWNER));
  });

  it('entry=init filter returns only init messages', async () => {
    const res = await rpc(getAgent(), 'messageToProgram.all', { entry: 'init', limit: 50 });
    const { result, count } = ok(res.body);

    expect(count).toBeGreaterThan(0);
    result.forEach((m: any) => expect(m.entry).toBe('init'));
  });

  it('entry=handle filter returns only handle messages', async () => {
    const res = await rpc(getAgent(), 'messageToProgram.all', { entry: 'handle', limit: 50 });
    const { result } = ok(res.body);

    result.forEach((m: any) => expect(m.entry).toBe('handle'));
  });

  it('service filter is case-insensitive substring match', async () => {
    const res = await rpc(getAgent(), 'messageToProgram.all', { service: 'token a', limit: 50 });
    const { result, count } = ok(res.body);

    expect(count).toBeGreaterThan(0);
    result.forEach((m: any) =>
      expect(m.service?.toLowerCase()).toContain('token a'),
    );
  });

  it('fn filter is case-insensitive substring match', async () => {
    const res = await rpc(getAgent(), 'messageToProgram.all', { fn: 'tkna', limit: 50 });
    const { result, count } = ok(res.body);

    expect(count).toBeGreaterThan(0);
    result.forEach((m: any) => expect(m.fn?.toLowerCase()).toContain('tkna'));
  });

  it('query (exact message id) returns that message', async () => {
    const res = await rpc(getAgent(), 'messageToProgram.all', { query: MSG_TO_1_ID });
    const { result } = ok(res.body);

    expect(result.some((m: any) => m.id === MSG_TO_1_ID)).toBe(true);
  });

  it('non-hex query returns -32602 InvalidParams', async () => {
    const res = await rpc(getAgent(), 'messageToProgram.all', { query: 'not-hex' });
    const error = err(res.body);

    expect(error.code).toBe(-32602);
  });

  it('from/to date range filters messages by timestamp', async () => {
    const from = '2023-09-22T00:00:00.000Z';
    const to = '2023-09-22T23:59:59.000Z';

    const res = await rpc(getAgent(), 'messageToProgram.all', { from, to, limit: 100 });
    const { result, count } = ok(res.body);

    expect(count).toBeGreaterThan(0);
    result.forEach((m: any) => {
      const ts = new Date(m.timestamp).getTime();
      expect(ts).toBeGreaterThanOrEqual(new Date(from).getTime());
      expect(ts).toBeLessThanOrEqual(new Date(to).getTime());
    });
  });

  it('unknown destination returns empty result', async () => {
    const res = await rpc(getAgent(), 'messageToProgram.all', { destination: UNKNOWN_ID });
    const { result, count } = ok(res.body);

    expect(result).toHaveLength(0);
    expect(count).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// messageFromProgram
// ═══════════════════════════════════════════════════════════════════════════════

describe('messageFromProgram.data response shape', () => {
  it('has all expected fields', async () => {
    const res = await rpc(getAgent(), 'messageFromProgram.data', { id: MSG_FROM_1_ID });
    const msg = ok(res.body);

    expect(msg).toHaveProperty('id');
    expect(msg).toHaveProperty('destination');
    expect(msg).toHaveProperty('source');
    expect(msg).toHaveProperty('payload');
    expect(msg).toHaveProperty('value');
    expect(msg).toHaveProperty('parentId');
    expect(msg).toHaveProperty('replyToMessageId');
    expect(msg).toHaveProperty('exitCode');
    expect(msg).toHaveProperty('expiration');
    expect(msg).toHaveProperty('readReason');
    expect(msg).toHaveProperty('service');
    expect(msg).toHaveProperty('fn');
    expect(msg).toHaveProperty('replyCode');
    expect(msg).toHaveProperty('isSailsIdlV2');
    expect(msg).toHaveProperty('header');
    expect(msg).toHaveProperty('routeIdx');
    expect(msg).toHaveProperty('blockHash');
    expect(msg).toHaveProperty('blockNumber');
    expect(msg).toHaveProperty('timestamp');
  });

  it('returns correct values for known reply message', async () => {
    const res = await rpc(getAgent(), 'messageFromProgram.data', { id: MSG_FROM_1_ID });
    const msg = ok(res.body);

    expect(msg.id).toBe(MSG_FROM_1_ID);
    expect(msg.source).toBe(PROGRAM_ACTIVE_ID);
    expect(msg.destination).toBe(PROGRAM_OWNER);
    expect(msg.parentId).toBe(MSG_TO_1_ID);
    expect(msg.exitCode).toBe(0);
  });

  it('failed reply has exitCode 1', async () => {
    const res = await rpc(getAgent(), 'messageFromProgram.data', { id: MSG_FROM_2_ID });
    const msg = ok(res.body);

    expect(msg.exitCode).toBe(1);
    expect(msg.source).toBe(PROGRAM_TERMINATED_ID);
  });
});

describe('messageFromProgram.data', () => {
  it('returns -32404 for unknown id', async () => {
    const res = await rpc(getAgent(), 'messageFromProgram.data', { id: UNKNOWN_ID });
    expect(err(res.body).code).toBe(-32404);
  });

  it('returns -32602 when id is missing', async () => {
    const res = await rpc(getAgent(), 'messageFromProgram.data', {});
    expect(err(res.body).code).toBe(-32602);
  });
});

describe('messageFromProgram.all response shape', () => {
  it('returns { result: [], count: number }', async () => {
    const res = await rpc(getAgent(), 'messageFromProgram.all', {});
    assertList(ok(res.body));
  });
});

describe('messageFromProgram.all pagination', () => {
  it('default limit is 20', async () => {
    const res = await rpc(getAgent(), 'messageFromProgram.all', {});
    expect(ok(res.body).result.length).toBeLessThanOrEqual(20);
  });

  it('limit > 100 is clamped to 100', async () => {
    const res = await rpc(getAgent(), 'messageFromProgram.all', { limit: 9999 });
    expect(ok(res.body).result.length).toBeLessThanOrEqual(100);
  });

  it('results are ordered DESC by timestamp', async () => {
    const res = await rpc(getAgent(), 'messageFromProgram.all', { limit: 10 });
    const { result } = ok(res.body);

    const timestamps = result.map((m: any) => new Date(m.timestamp).getTime());
    for (let i = 1; i < timestamps.length; i++) {
      expect(timestamps[i]).toBeLessThanOrEqual(timestamps[i - 1]);
    }
  });
});

describe('messageFromProgram.all filters', () => {
  it('source filter returns only messages from that program', async () => {
    const res = await rpc(getAgent(), 'messageFromProgram.all', {
      source: PROGRAM_ACTIVE_ID,
      limit: 50,
    });
    const { result, count } = ok(res.body);

    expect(count).toBeGreaterThan(0);
    result.forEach((m: any) => expect(m.source).toBe(PROGRAM_ACTIVE_ID));
  });

  it('destination filter returns only messages to that address', async () => {
    const res = await rpc(getAgent(), 'messageFromProgram.all', {
      destination: PROGRAM_OWNER,
      limit: 50,
    });
    const { result, count } = ok(res.body);

    expect(count).toBeGreaterThan(0);
    result.forEach((m: any) => expect(m.destination).toBe(PROGRAM_OWNER));
  });

  it('parentId filter returns only children of that message', async () => {
    const res = await rpc(getAgent(), 'messageFromProgram.all', { parentId: MSG_TO_1_ID });
    const { result, count } = ok(res.body);

    expect(count).toBeGreaterThan(0);
    result.forEach((m: any) => expect(m.parentId).toBe(MSG_TO_1_ID));
  });

  it('query (exact message id) returns that message', async () => {
    const res = await rpc(getAgent(), 'messageFromProgram.all', { query: MSG_FROM_1_ID });
    const { result } = ok(res.body);

    expect(result.some((m: any) => m.id === MSG_FROM_1_ID)).toBe(true);
  });

  it('non-hex query returns -32602 InvalidParams', async () => {
    const res = await rpc(getAgent(), 'messageFromProgram.all', { query: 'not-hex' });
    expect(err(res.body).code).toBe(-32602);
  });

  it('from/to date range filters by timestamp', async () => {
    const from = '2023-09-22T00:00:00.000Z';
    const to = '2023-09-22T23:59:59.000Z';

    const res = await rpc(getAgent(), 'messageFromProgram.all', { from, to, limit: 100 });
    const { result, count } = ok(res.body);

    expect(count).toBeGreaterThan(0);
    result.forEach((m: any) => {
      const ts = new Date(m.timestamp).getTime();
      expect(ts).toBeGreaterThanOrEqual(new Date(from).getTime());
      expect(ts).toBeLessThanOrEqual(new Date(to).getTime());
    });
  });

  it('unknown source returns empty result', async () => {
    const res = await rpc(getAgent(), 'messageFromProgram.all', { source: UNKNOWN_ID });
    const { result, count } = ok(res.body);

    expect(result).toHaveLength(0);
    expect(count).toBe(0);
  });
});
