import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { CODE_1_ID, CODE_2_ID, CODE_3_ID, UNKNOWN_ID } from './fixtures.js';
import { assertNotFound, assertPaginated, getList, getOne, validateCodeDto } from './helpers.js';
import { getAgent, setup, teardown } from './setup.js';

beforeAll(setup);
afterAll(teardown);

// ── GET /api/codes/:id ─────────────────────────────────────────────────────────

describe('GET /api/codes/:id', () => {
  it('returns correct code with full type validation', async () => {
    const res = await getOne(getAgent(), `/api/codes/${CODE_1_ID}`);
    expect(res.status).toBe(200);
    validateCodeDto(res.body);
    expect(res.body.id).toBe(CODE_1_ID);
    expect(res.body.status).toBe('ValidationRequested');
  });

  it('returns all 3 codes', async () => {
    const res2 = await getOne(getAgent(), `/api/codes/${CODE_2_ID}`);
    expect(res2.status).toBe(200);
    validateCodeDto(res2.body);
    expect(res2.body.id).toBe(CODE_2_ID);

    const res3 = await getOne(getAgent(), `/api/codes/${CODE_3_ID}`);
    expect(res3.status).toBe(200);
    validateCodeDto(res3.body);
    expect(res3.body.id).toBe(CODE_3_ID);
  });

  it('returns 404 for unknown id', async () => {
    const res = await getOne(getAgent(), `/api/codes/${UNKNOWN_ID}`);
    expect(res.status).toBe(404);
    assertNotFound(res.body);
  });
});

// ── GET /api/codes list ─────────────────────────────────────────────────────────

describe('GET /api/codes', () => {
  it('returns paginated shape with correct types', async () => {
    const res = await getList(getAgent(), '/api/codes');
    expect(res.status).toBe(200);
    const body = assertPaginated(res.body);
    expect(body.data.length).toBeGreaterThan(0);
    body.data.forEach((c: any) => void validateCodeDto(c));
  });

  it('default limit is 50', async () => {
    const res = await getList(getAgent(), '/api/codes');
    expect(res.body.data.length).toBeLessThanOrEqual(50);
  });

  it('limit is respected', async () => {
    const res = await getList(getAgent(), '/api/codes', { limit: 1 });
    expect(res.body.data.length).toBeLessThanOrEqual(1);
  });

  it('offset shifts results', async () => {
    const first = await getList(getAgent(), '/api/codes', { limit: 1, offset: 0 });
    const second = await getList(getAgent(), '/api/codes', { limit: 1, offset: 1 });
    expect(first.body.data[0].id).not.toBe(second.body.data[0].id);
  });

  it('count is stable across pages', async () => {
    const p1 = await getList(getAgent(), '/api/codes', { limit: 1, offset: 0 });
    const p2 = await getList(getAgent(), '/api/codes', { limit: 1, offset: 1 });
    expect(p1.body.total).toBe(p2.body.total);
  });

  it('results are ordered DESC by createdAt', async () => {
    const res = await getList(getAgent(), '/api/codes', { limit: 10 });
    const dates = res.body.data.map((c: any) => new Date(c.createdAt).getTime());
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i]).toBeLessThanOrEqual(dates[i - 1]);
    }
  });

  it('status filter returns only matching codes', async () => {
    const res = await getList(getAgent(), '/api/codes', { status: 'ValidationRequested' });
    expect(res.status).toBe(200);
    assertPaginated(res.body);
    res.body.data.forEach((c: any) => {
      expect(c.status).toBe('ValidationRequested');
    });
  });

  it('invalid status returns 400', async () => {
    const res = await getList(getAgent(), '/api/codes', { status: 'NonExistent' });
    expect(res.status).toBe(400);
  });
});
