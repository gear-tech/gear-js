import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { PROGRAM_1_ID, ST_1_ID, ST_2_ID, UNKNOWN_ID } from './fixtures.js';
import { assertNotFound, assertPaginated, getList, getOne, validateStateTransitionDto } from './helpers.js';
import { getAgent, setup, teardown } from './setup.js';

beforeAll(setup);
afterAll(teardown);

// ── GET /api/state-transitions/:id ─────────────────────────────────────────────

describe('GET /api/state-transitions/:id', () => {
  it('returns state transition with full type validation and program relation', async () => {
    const res = await getOne(getAgent(), `/api/state-transitions/${ST_1_ID}`);
    expect(res.status).toBe(200);
    validateStateTransitionDto(res.body, true);
    expect(res.body.id).toBe(ST_1_ID);
    expect(res.body.programId).toBe(PROGRAM_1_ID);
    expect(res.body.exited).toBe(false);
    expect(res.body.valueToReceive).toBe('0');
    expect(res.body.inheritor).toBeNull();
    expect(res.body.program).toBeDefined();
    expect(res.body.program.id).toBe(PROGRAM_1_ID);
    // batch_hash FK is not in the dump
    expect(res.body.batch).toBeNull();
  });

  it('returns another state transition', async () => {
    const res = await getOne(getAgent(), `/api/state-transitions/${ST_2_ID}`);
    expect(res.status).toBe(200);
    validateStateTransitionDto(res.body, true);
    expect(res.body.id).toBe(ST_2_ID);
    expect(res.body.programId).toBe(PROGRAM_1_ID);
    expect(res.body.exited).toBe(false);
    expect(res.body.valueToReceive).toBe('0');
    expect(res.body.inheritor).toBeNull();
    expect(res.body.program).toBeDefined();
    expect(res.body.program.id).toBe(PROGRAM_1_ID);
    expect(res.body.batch).toBeNull();
  });

  it('returns 404 for unknown id', async () => {
    const res = await getOne(getAgent(), `/api/state-transitions/${UNKNOWN_ID}`);
    expect(res.status).toBe(404);
    assertNotFound(res.body);
  });
});

// ── GET /api/state-transitions list ────────────────────────────────────────────

describe('GET /api/state-transitions', () => {
  it('returns paginated shape with correct types (no relations in list)', async () => {
    const res = await getList(getAgent(), '/api/state-transitions');
    expect(res.status).toBe(200);
    const body = assertPaginated(res.body);
    expect(body.data.length).toBeGreaterThan(0);
    body.data.forEach((st: any) => void validateStateTransitionDto(st));
  });

  it('programId filter narrows results', async () => {
    const res = await getList(getAgent(), '/api/state-transitions', { programId: PROGRAM_1_ID });
    expect(res.status).toBe(200);
    res.body.data.forEach((st: any) => {
      expect(st.programId).toBe(PROGRAM_1_ID);
    });
  });

  it('invalid exited value returns 400', async () => {
    const res = await getList(getAgent(), '/api/state-transitions', { exited: 'notabool' });
    expect(res.status).toBe(400);
  });

  it('exited filter returns only matching', async () => {
    const exited = await getList(getAgent(), '/api/state-transitions', { exited: true });
    expect(exited.status).toBe(200);
    // Current dump has no exited state transitions
    expect(exited.body.data).toHaveLength(0);

    const notExited = await getList(getAgent(), '/api/state-transitions', { exited: false });
    expect(notExited.status).toBe(200);
    expect(notExited.body.data.length).toBeGreaterThan(0);
    notExited.body.data.forEach((st: any) => {
      expect(st.exited).toBe(false);
    });
  });
});
