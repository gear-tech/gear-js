import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { CODE_1_ID, CODE_UPLOADER, UNKNOWN_ID } from './fixtures.js';
import { assertList, err, ID_REGEXP, ok, rpc } from './helpers.js';
import { getAgent, setup, teardown } from './setup.js';

beforeAll(setup);
afterAll(teardown);

// ── Response shape ─────────────────────────────────────────────────────────────

describe('code.data response shape', () => {
  it('has all expected fields', async () => {
    const res = await rpc(getAgent(), 'code.data', { id: CODE_1_ID });
    const code = ok(res.body);

    expect(code).toHaveProperty('id');
    expect(code).toHaveProperty('uploadedBy');
    expect(code).toHaveProperty('name');
    expect(code).toHaveProperty('status');
    expect(code).toHaveProperty('metaType');
    expect(code).toHaveProperty('metahash');
    expect(code).toHaveProperty('blockHash');
    expect(code).toHaveProperty('blockNumber');
    expect(code).toHaveProperty('timestamp');
  });

  it('id and uploadedBy are 0x-prefixed hex strings', async () => {
    const res = await rpc(getAgent(), 'code.data', { id: CODE_1_ID });
    const code = ok(res.body);

    expect(code.id).toMatch(ID_REGEXP);
    expect(code.uploadedBy).toMatch(ID_REGEXP);
  });

  it('returns correct values for known code', async () => {
    const res = await rpc(getAgent(), 'code.data', { id: CODE_1_ID });
    const code = ok(res.body);

    expect(code.id).toBe(CODE_1_ID);
    expect(code.uploadedBy).toBe(CODE_UPLOADER);
    expect(code.status).toBe('Active');
  });
});

// ── code.data ──────────────────────────────────────────────────────────────────

describe('code.data', () => {
  it('returns -32404 for unknown id', async () => {
    const res = await rpc(getAgent(), 'code.data', { id: UNKNOWN_ID });
    const error = err(res.body);

    expect(error.code).toBe(-32404);
    expect(error.message).toBe('Code not found');
  });

  it('returns -32602 when id param is missing', async () => {
    const res = await rpc(getAgent(), 'code.data', {});
    const error = err(res.body);

    expect(error.code).toBe(-32602);
  });
});

// ── code.all ───────────────────────────────────────────────────────────────────

describe('code.all response shape', () => {
  it('returns { result: [], count: number }', async () => {
    const res = await rpc(getAgent(), 'code.all', {});
    assertList(ok(res.body));
  });

  it('result items have all expected fields', async () => {
    const res = await rpc(getAgent(), 'code.all', { limit: 1 });
    const { result } = ok(res.body);

    expect(result.length).toBeGreaterThan(0);
    const c = result[0];
    expect(c).toHaveProperty('id');
    expect(c).toHaveProperty('uploadedBy');
    expect(c).toHaveProperty('name');
    expect(c).toHaveProperty('status');
    expect(c).toHaveProperty('metaType');
    expect(c).toHaveProperty('metahash');
    expect(c).toHaveProperty('blockHash');
    expect(c).toHaveProperty('blockNumber');
    expect(c).toHaveProperty('timestamp');
  });
});

describe('code.all pagination', () => {
  it('default limit is 20', async () => {
    const res = await rpc(getAgent(), 'code.all', {});
    const { result } = ok(res.body);

    expect(result.length).toBeLessThanOrEqual(20);
  });

  it('limit is respected', async () => {
    const res = await rpc(getAgent(), 'code.all', { limit: 3 });
    const { result } = ok(res.body);

    expect(result.length).toBeLessThanOrEqual(3);
  });

  it('limit > 100 is clamped to 100', async () => {
    const res = await rpc(getAgent(), 'code.all', { limit: 9999 });
    const { result } = ok(res.body);

    expect(result.length).toBeLessThanOrEqual(100);
  });

  it('offset shifts results', async () => {
    const first = await rpc(getAgent(), 'code.all', { limit: 5, offset: 0 });
    const second = await rpc(getAgent(), 'code.all', { limit: 5, offset: 5 });

    const ids1 = ok(first.body).result.map((c: any) => c.id);
    const ids2 = ok(second.body).result.map((c: any) => c.id);

    ids2.forEach((id: string) => {
      expect(ids1).not.toContain(id);
    });
  });

  it('results are ordered DESC by timestamp', async () => {
    const res = await rpc(getAgent(), 'code.all', { limit: 10 });
    const { result } = ok(res.body);

    const timestamps = result.map((c: any) => new Date(c.timestamp).getTime());
    for (let i = 1; i < timestamps.length; i++) {
      expect(timestamps[i]).toBeLessThanOrEqual(timestamps[i - 1]);
    }
  });
});

describe('code.all filters', () => {
  it('uploadedBy filter returns only codes from that address', async () => {
    const res = await rpc(getAgent(), 'code.all', { uploadedBy: CODE_UPLOADER, limit: 50 });
    const { result, count } = ok(res.body);

    expect(count).toBeGreaterThan(0);
    result.forEach((c: any) => {
      expect(c.uploadedBy).toBe(CODE_UPLOADER);
    });
  });

  it('status filter returns only matching codes', async () => {
    const res = await rpc(getAgent(), 'code.all', { status: 'Active', limit: 50 });
    const { result, count } = ok(res.body);

    expect(count).toBeGreaterThan(0);
    result.forEach((c: any) => {
      expect(c.status).toBe('Active');
    });
  });

  it('status filter (array) returns all matching statuses', async () => {
    const res = await rpc(getAgent(), 'code.all', { status: ['Active', 'Inactive'], limit: 100 });
    const { result } = ok(res.body);

    result.forEach((c: any) => {
      expect(['Active', 'Inactive']).toContain(c.status);
    });
  });

  it('query matches by ID prefix', async () => {
    const prefix = CODE_1_ID.slice(0, 12);
    const res = await rpc(getAgent(), 'code.all', { query: prefix });
    const { result } = ok(res.body);

    expect(result.some((c: any) => c.id === CODE_1_ID)).toBe(true);
  });

  it('unknown uploadedBy returns empty result', async () => {
    const res = await rpc(getAgent(), 'code.all', { uploadedBy: UNKNOWN_ID });
    const { result, count } = ok(res.body);

    expect(result).toHaveLength(0);
    expect(count).toBe(0);
  });
});
