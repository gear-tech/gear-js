import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { CODE_1_ID, PROGRAM_ACTIVE_ID, PROGRAM_OWNER, PROGRAM_TERMINATED_ID, UNKNOWN_ID } from './fixtures.js';
import { assertList, err, ID_REGEXP, ok, rpc } from './helpers.js';
import { getAgent, setup, teardown } from './setup.js';

beforeAll(setup);
afterAll(teardown);

// ── Response shape ─────────────────────────────────────────────────────────────

describe('program.data response shape', () => {
  it('has all expected fields', async () => {
    const res = await rpc(getAgent(), 'program.data', { id: PROGRAM_ACTIVE_ID });
    const program = ok(res.body);

    // Identity & ownership
    expect(program).toHaveProperty('id');
    expect(program).toHaveProperty('owner');
    expect(program).toHaveProperty('name');
    expect(program).toHaveProperty('status');
    expect(program).toHaveProperty('codeId');
    // Metadata
    expect(program).toHaveProperty('metaType');
    expect(program).toHaveProperty('metahash');
    // Block context
    expect(program).toHaveProperty('blockHash');
    expect(program).toHaveProperty('blockNumber');
    expect(program).toHaveProperty('timestamp');
  });

  it('id and codeId are 0x-prefixed hex strings', async () => {
    const res = await rpc(getAgent(), 'program.data', { id: PROGRAM_ACTIVE_ID });
    const program = ok(res.body);

    expect(program.id).toMatch(ID_REGEXP);
    expect(program.codeId).toMatch(ID_REGEXP);
  });

  it('returns correct values for known program', async () => {
    const res = await rpc(getAgent(), 'program.data', { id: PROGRAM_ACTIVE_ID });
    const program = ok(res.body);

    expect(program.id).toBe(PROGRAM_ACTIVE_ID);
    expect(program.owner).toBe(PROGRAM_OWNER);
    expect(program.status).toBe('active');
    expect(program.codeId).toBe(CODE_1_ID);
  });
});

// ── program.data ───────────────────────────────────────────────────────────────

describe('program.data', () => {
  it('returns a terminated program correctly', async () => {
    const res = await rpc(getAgent(), 'program.data', { id: PROGRAM_TERMINATED_ID });
    const program = ok(res.body);

    expect(program.id).toBe(PROGRAM_TERMINATED_ID);
    expect(program.status).toBe('terminated');
  });

  it('returns -32404 for unknown id', async () => {
    const res = await rpc(getAgent(), 'program.data', { id: UNKNOWN_ID });
    const error = err(res.body);

    expect(error.code).toBe(-32404);
    expect(error.message).toBe('Program not found');
  });

  it('returns -32602 when id param is missing', async () => {
    const res = await rpc(getAgent(), 'program.data', {});
    const error = err(res.body);

    expect(error.code).toBe(-32602);
  });
});

// ── program.all ────────────────────────────────────────────────────────────────

describe('program.all response shape', () => {
  it('returns { result: [], count: number }', async () => {
    const res = await rpc(getAgent(), 'program.all', {});
    assertList(ok(res.body));
  });

  it('result items have all expected fields', async () => {
    const res = await rpc(getAgent(), 'program.all', { limit: 1 });
    const { result } = ok(res.body);

    expect(result.length).toBeGreaterThan(0);
    const p = result[0];
    expect(p).toHaveProperty('id');
    expect(p).toHaveProperty('owner');
    expect(p).toHaveProperty('name');
    expect(p).toHaveProperty('status');
    expect(p).toHaveProperty('codeId');
    expect(p).toHaveProperty('metaType');
    expect(p).toHaveProperty('metahash');
    expect(p).toHaveProperty('blockHash');
    expect(p).toHaveProperty('blockNumber');
    expect(p).toHaveProperty('timestamp');
  });
});

describe('program.all pagination', () => {
  it('default limit is 20', async () => {
    const res = await rpc(getAgent(), 'program.all', {});
    const { result } = ok(res.body);

    expect(result.length).toBeLessThanOrEqual(20);
  });

  it('limit is respected', async () => {
    const res = await rpc(getAgent(), 'program.all', { limit: 5 });
    const { result } = ok(res.body);

    expect(result.length).toBeLessThanOrEqual(5);
  });

  it('limit > 100 is clamped to 100', async () => {
    const res = await rpc(getAgent(), 'program.all', { limit: 9999 });
    const { result } = ok(res.body);

    expect(result.length).toBeLessThanOrEqual(100);
  });

  it('offset shifts results', async () => {
    const first = await rpc(getAgent(), 'program.all', { limit: 5, offset: 0 });
    const second = await rpc(getAgent(), 'program.all', { limit: 5, offset: 5 });

    const ids1 = ok(first.body).result.map((p: any) => p.id);
    const ids2 = ok(second.body).result.map((p: any) => p.id);

    ids2.forEach((id: string) => {
      expect(ids1).not.toContain(id);
    });
  });

  it('count is stable across pages', async () => {
    const p1 = await rpc(getAgent(), 'program.all', { limit: 5, offset: 0 });
    const p2 = await rpc(getAgent(), 'program.all', { limit: 5, offset: 5 });

    expect(ok(p1.body).count).toBe(ok(p2.body).count);
  });

  it('results are ordered DESC by timestamp', async () => {
    const res = await rpc(getAgent(), 'program.all', { limit: 10 });
    const { result } = ok(res.body);

    const timestamps = result.map((p: any) => new Date(p.timestamp).getTime());
    for (let i = 1; i < timestamps.length; i++) {
      expect(timestamps[i]).toBeLessThanOrEqual(timestamps[i - 1]);
    }
  });
});

describe('program.all filters', () => {
  it('owner filter returns only programs with that owner', async () => {
    const res = await rpc(getAgent(), 'program.all', { owner: PROGRAM_OWNER, limit: 50 });
    const { result, count } = ok(res.body);

    expect(count).toBeGreaterThan(0);
    result.forEach((p: any) => {
      expect(p.owner).toBe(PROGRAM_OWNER);
    });
  });

  it('codeId filter returns only programs with that code', async () => {
    const res = await rpc(getAgent(), 'program.all', { codeId: CODE_1_ID, limit: 50 });
    const { result, count } = ok(res.body);

    expect(count).toBeGreaterThan(0);
    result.forEach((p: any) => {
      expect(p.codeId).toBe(CODE_1_ID);
    });
  });

  it('status filter (single) returns only matching programs', async () => {
    const res = await rpc(getAgent(), 'program.all', { status: 'active', limit: 50 });
    const { result, count } = ok(res.body);

    expect(count).toBeGreaterThan(0);
    result.forEach((p: any) => {
      expect(p.status).toBe('active');
    });
  });

  it('status filter (array) returns all matching statuses', async () => {
    const res = await rpc(getAgent(), 'program.all', {
      status: ['active', 'terminated'],
      limit: 100,
    });
    const { result, count } = ok(res.body);

    expect(count).toBeGreaterThan(0);
    result.forEach((p: any) => {
      expect(['active', 'terminated']).toContain(p.status);
    });
  });

  it('active + terminated combined count >= each individually', async () => {
    const activeRes = await rpc(getAgent(), 'program.all', { status: 'active' });
    const terminatedRes = await rpc(getAgent(), 'program.all', { status: 'terminated' });
    const bothRes = await rpc(getAgent(), 'program.all', { status: ['active', 'terminated'] });

    const activeCount = ok(activeRes.body).count;
    const terminatedCount = ok(terminatedRes.body).count;
    const bothCount = ok(bothRes.body).count;

    expect(bothCount).toBe(activeCount + terminatedCount);
  });

  it('query matches by ID prefix (hex search)', async () => {
    const prefix = PROGRAM_ACTIVE_ID.slice(0, 12); // e.g. "0x987cf50312"
    const res = await rpc(getAgent(), 'program.all', { query: prefix });
    const { result } = ok(res.body);

    expect(result.some((p: any) => p.id === PROGRAM_ACTIVE_ID)).toBe(true);
  });

  it('query is case-insensitive', async () => {
    const upperQuery = PROGRAM_ACTIVE_ID.slice(2, 14).toUpperCase();
    const lowerQuery = upperQuery.toLowerCase();

    const upper = await rpc(getAgent(), 'program.all', { query: upperQuery });
    const lower = await rpc(getAgent(), 'program.all', { query: lowerQuery });

    expect(ok(upper.body).count).toBe(ok(lower.body).count);
  });

  it('unknown owner returns empty result', async () => {
    const res = await rpc(getAgent(), 'program.all', { owner: UNKNOWN_ID });
    const { result, count } = ok(res.body);

    expect(result).toHaveLength(0);
    expect(count).toBe(0);
  });

  it('combined owner + codeId filters narrow results correctly', async () => {
    const res = await rpc(getAgent(), 'program.all', {
      owner: PROGRAM_OWNER,
      codeId: CODE_1_ID,
      limit: 50,
    });
    const { result } = ok(res.body);

    result.forEach((p: any) => {
      expect(p.owner).toBe(PROGRAM_OWNER);
      expect(p.codeId).toBe(CODE_1_ID);
    });
  });
});
