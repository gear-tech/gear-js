import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { BATCH_1_ID, BATCH_2_ID, UNKNOWN_ID } from './fixtures.js';
import { assertNotFound, assertPaginated, getList, getOne, validateBatchDto } from './helpers.js';
import { getAgent, setup, teardown } from './setup.js';

beforeAll(setup);
afterAll(teardown);

// ── GET /api/batches/:id ───────────────────────────────────────────────────────

describe('GET /api/batches/:id', () => {
  it('returns batch with full type validation', async () => {
    const res = await getOne(getAgent(), `/api/batches/${BATCH_1_ID}`);
    expect(res.status).toBe(200);
    validateBatchDto(res.body);
    expect(res.body.id).toBe(BATCH_1_ID);
    expect(res.body.committedAtBlock).toBe('2435545');
    expect(res.body.expiry).toBe('2');
  });

  it('returns second batch', async () => {
    const res = await getOne(getAgent(), `/api/batches/${BATCH_2_ID}`);
    expect(res.status).toBe(200);
    validateBatchDto(res.body);
    expect(res.body.id).toBe(BATCH_2_ID);
    expect(res.body.committedAtBlock).toBe('2436046');
  });

  it('returns 404 for unknown id', async () => {
    const res = await getOne(getAgent(), `/api/batches/${UNKNOWN_ID}`);
    expect(res.status).toBe(404);
    assertNotFound(res.body);
  });
});

// ── GET /api/batches list ──────────────────────────────────────────────────────

describe('GET /api/batches', () => {
  it('returns paginated shape with correct types', async () => {
    const res = await getList(getAgent(), '/api/batches');
    expect(res.status).toBe(200);
    const body = assertPaginated(res.body);
    expect(body.data.length).toBeGreaterThan(0);
    body.data.forEach((b: any) => void validateBatchDto(b));
  });

  it('fromBlock / toBlock filters narrow results', async () => {
    const res = await getList(getAgent(), '/api/batches', { fromBlock: 0, toBlock: 2435544 });
    expect(res.body.data).toHaveLength(0);

    const res2 = await getList(getAgent(), '/api/batches', { fromBlock: 2435545, toBlock: 2436046 });
    expect(res2.body.data.length).toBe(2);
  });
});
