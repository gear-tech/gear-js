import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { DEST_1, SENDER_1, UNKNOWN_ID } from './fixtures.js';
import { assertNotFound, assertPaginated, getList, getOne } from './helpers.js';
import { getAgent, setup, teardown } from './setup.js';

beforeAll(setup);
afterAll(teardown);

// ── GET /api/injected-transactions/:id ─────────────────────────────────────────
// NOTE: injected_transaction table is empty in the current dump.

describe('GET /api/injected-transactions/:id', () => {
  it('returns 404 for unknown id', async () => {
    const res = await getOne(getAgent(), `/api/injected-transactions/${UNKNOWN_ID}`);
    expect(res.status).toBe(404);
    assertNotFound(res.body);
  });
});

// ── GET /api/injected-transactions list ──────────────────────────────────────

describe('GET /api/injected-transactions', () => {
  it('returns empty paginated list when table has no rows', async () => {
    const res = await getList(getAgent(), '/api/injected-transactions');
    expect(res.status).toBe(200);
    const body = assertPaginated(res.body);
    expect(body.data).toHaveLength(0);
    expect(body.total).toBe(0);
  });

  it('destination filter returns empty when table has no rows', async () => {
    const res = await getList(getAgent(), '/api/injected-transactions', { destination: DEST_1 });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  it('senderAddress filter returns empty when table has no rows', async () => {
    const res = await getList(getAgent(), '/api/injected-transactions', { senderAddress: SENDER_1 });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });
});
