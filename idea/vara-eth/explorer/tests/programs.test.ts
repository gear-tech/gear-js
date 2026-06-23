import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { PROGRAM_1_ID, PROGRAM_2_ID, PROGRAM_3_ID, PROGRAM_CODE_ID, UNKNOWN_ID } from './fixtures.js';
import { assertNotFound, assertPaginated, getList, getOne, validateProgramDto } from './helpers.js';
import { getAgent, setup, teardown } from './setup.js';

beforeAll(setup);
afterAll(teardown);

// ── GET /api/programs/:id ────────────────────────────────────────────────────

describe('GET /api/programs/:id', () => {
  it('returns program with full type validation and null code relation', async () => {
    const res = await getOne(getAgent(), `/api/programs/${PROGRAM_1_ID}`);
    expect(res.status).toBe(200);
    validateProgramDto(res.body, true);
    expect(res.body.id).toBe(PROGRAM_1_ID);
    expect(res.body.blockNumber).toBe('2441045');
    expect(res.body.abiInterfaceAddress).toBeNull();
    // The code_id referenced by this program was not among the 3 copied code rows
    expect(res.body.code).toBeNull();
  });

  it('returns second program', async () => {
    const res = await getOne(getAgent(), `/api/programs/${PROGRAM_2_ID}`);
    expect(res.status).toBe(200);
    validateProgramDto(res.body, true);
    expect(res.body.id).toBe(PROGRAM_2_ID);
    expect(res.body.blockNumber).toBe('2441094');
    expect(res.body.code).toBeNull();
  });

  it('returns third program', async () => {
    const res = await getOne(getAgent(), `/api/programs/${PROGRAM_3_ID}`);
    expect(res.status).toBe(200);
    validateProgramDto(res.body, true);
    expect(res.body.id).toBe(PROGRAM_3_ID);
    expect(res.body.blockNumber).toBe('2441110');
    expect(res.body.code).toBeNull();
  });

  it('returns 404 for unknown id', async () => {
    const res = await getOne(getAgent(), `/api/programs/${UNKNOWN_ID}`);
    expect(res.status).toBe(404);
    assertNotFound(res.body);
  });
});

// ── GET /api/programs list ────────────────────────────────────────────────────

describe('GET /api/programs', () => {
  it('returns paginated shape with correct types', async () => {
    const res = await getList(getAgent(), '/api/programs');
    expect(res.status).toBe(200);
    const body = assertPaginated(res.body);
    expect(body.data.length).toBeGreaterThan(0);
    body.data.forEach((p: any) => void validateProgramDto(p));
  });

  it('default limit is 50', async () => {
    const res = await getList(getAgent(), '/api/programs');
    expect(res.body.data.length).toBeLessThanOrEqual(50);
  });

  it('offset shifts results', async () => {
    const first = await getList(getAgent(), '/api/programs', { limit: 1, offset: 0 });
    const second = await getList(getAgent(), '/api/programs', { limit: 1, offset: 1 });
    expect(first.body.data[0].id).not.toBe(second.body.data[0].id);
  });

  it('count is stable across pages', async () => {
    const p1 = await getList(getAgent(), '/api/programs', { limit: 1, offset: 0 });
    const p2 = await getList(getAgent(), '/api/programs', { limit: 1, offset: 1 });
    expect(p1.body.total).toBe(p2.body.total);
  });

  it('codeId filter returns only programs with that code', async () => {
    const res = await getList(getAgent(), '/api/programs', { codeId: PROGRAM_CODE_ID });
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(3);
    res.body.data.forEach((p: any) => {
      expect([PROGRAM_1_ID, PROGRAM_2_ID, PROGRAM_3_ID]).toContain(p.id);
    });
  });

  it('fromBlock / toBlock filters narrow results', async () => {
    const res = await getList(getAgent(), '/api/programs', { fromBlock: 0, toBlock: 2441044 });
    expect(res.body.data).toHaveLength(0);

    const res2 = await getList(getAgent(), '/api/programs', { fromBlock: 2441045, toBlock: 2441110 });
    expect(res2.body.data.length).toBe(3);
  });
});
