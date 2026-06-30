import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  INJECTED_TX_1_DEST,
  INJECTED_TX_1_ID,
  INJECTED_TX_1_SENDER,
  INJECTED_TX_2_DEST,
  INJECTED_TX_2_ID,
  INJECTED_TX_2_SENDER,
  INJECTED_TX_3_ID,
  UNKNOWN_ID,
} from './fixtures.js';
import { assertNotFound, assertPaginated, getList, getOne, validateInjectedTransactionDto } from './helpers.js';
import { getAgent, setup, teardown } from './setup.js';

beforeAll(setup);
afterAll(teardown);

// ── GET /api/injected-transactions/:id ─────────────────────────────────────────

describe('GET /api/injected-transactions/:id', () => {
  it('returns 404 for unknown id', async () => {
    const res = await getOne(getAgent(), `/api/injected-transactions/${UNKNOWN_ID}`);
    expect(res.status).toBe(404);
    assertNotFound(res.body);
  });

  it('returns a single injected transaction by id', async () => {
    const res = await getOne(getAgent(), `/api/injected-transactions/${INJECTED_TX_1_ID}`);
    expect(res.status).toBe(200);
    validateInjectedTransactionDto(res.body);
    expect(res.body.id).toBe(INJECTED_TX_1_ID);
    expect(res.body.destination).toBe(INJECTED_TX_1_DEST);
    expect(res.body.senderAddress).toBe(INJECTED_TX_1_SENDER);
    expect(res.body.value).toBe('0');
  });

  it('returns a different injected transaction by id', async () => {
    const res = await getOne(getAgent(), `/api/injected-transactions/${INJECTED_TX_2_ID}`);
    expect(res.status).toBe(200);
    validateInjectedTransactionDto(res.body);
    expect(res.body.id).toBe(INJECTED_TX_2_ID);
    expect(res.body.destination).toBe(INJECTED_TX_2_DEST);
    expect(res.body.senderAddress).toBe(INJECTED_TX_2_SENDER);
  });
});

// ── GET /api/injected-transactions list ──────────────────────────────────────

describe('GET /api/injected-transactions', () => {
  it('returns paginated list of all injected transactions', async () => {
    const res = await getList(getAgent(), '/api/injected-transactions');
    expect(res.status).toBe(200);
    const body = assertPaginated(res.body);
    expect(body.total).toBe(3);
    expect(body.data).toHaveLength(3);
    for (const item of body.data) {
      validateInjectedTransactionDto(item);
    }
  });

  it('returns results ordered by createdAt DESC', async () => {
    const res = await getList(getAgent(), '/api/injected-transactions');
    expect(res.status).toBe(200);
    // IT_3 (17:04) → IT_2 (16:40) → IT_1 (16:26)
    expect(res.body.data[0].id).toBe(INJECTED_TX_3_ID);
    expect(res.body.data[1].id).toBe(INJECTED_TX_2_ID);
    expect(res.body.data[2].id).toBe(INJECTED_TX_1_ID);
  });

  it('respects limit and offset for pagination', async () => {
    const res = await getList(getAgent(), '/api/injected-transactions', { limit: 2, offset: 0 });
    expect(res.status).toBe(200);
    const body = assertPaginated(res.body);
    expect(body.total).toBe(3);
    expect(body.data).toHaveLength(2);
    expect(body.limit).toBe(2);
    expect(body.offset).toBe(0);
  });

  it('returns second page with offset', async () => {
    const res = await getList(getAgent(), '/api/injected-transactions', { limit: 2, offset: 2 });
    expect(res.status).toBe(200);
    const body = assertPaginated(res.body);
    expect(body.total).toBe(3);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].id).toBe(INJECTED_TX_1_ID);
  });

  it('destination filter returns matching transactions', async () => {
    const res = await getList(getAgent(), '/api/injected-transactions', { destination: INJECTED_TX_1_DEST });
    expect(res.status).toBe(200);
    const body = assertPaginated(res.body);
    expect(body.total).toBe(1);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].id).toBe(INJECTED_TX_1_ID);
    validateInjectedTransactionDto(body.data[0]);
  });

  it('destination filter returns empty for unknown address', async () => {
    const res = await getList(getAgent(), '/api/injected-transactions', { destination: `0x${'aa'.repeat(20)}` });
    expect(res.status).toBe(200);
    const body = assertPaginated(res.body);
    expect(body.total).toBe(0);
    expect(body.data).toHaveLength(0);
  });

  it('senderAddress filter returns matching transactions', async () => {
    const res = await getList(getAgent(), '/api/injected-transactions', { senderAddress: INJECTED_TX_2_SENDER });
    expect(res.status).toBe(200);
    const body = assertPaginated(res.body);
    expect(body.total).toBe(1);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].id).toBe(INJECTED_TX_2_ID);
    validateInjectedTransactionDto(body.data[0]);
  });

  it('senderAddress filter returns empty for unknown address', async () => {
    const res = await getList(getAgent(), '/api/injected-transactions', { senderAddress: `0x${'bb'.repeat(20)}` });
    expect(res.status).toBe(200);
    const body = assertPaginated(res.body);
    expect(body.total).toBe(0);
    expect(body.data).toHaveLength(0);
  });

  it('combined destination and senderAddress filters return matching transaction', async () => {
    const res = await getList(getAgent(), '/api/injected-transactions', {
      destination: INJECTED_TX_2_DEST,
      senderAddress: INJECTED_TX_2_SENDER,
    });
    expect(res.status).toBe(200);
    const body = assertPaginated(res.body);
    expect(body.total).toBe(1);
    expect(body.data[0].id).toBe(INJECTED_TX_2_ID);
  });

  it('mismatched destination and senderAddress filters return empty', async () => {
    const res = await getList(getAgent(), '/api/injected-transactions', {
      destination: INJECTED_TX_1_DEST,
      senderAddress: INJECTED_TX_2_SENDER,
    });
    expect(res.status).toBe(200);
    const body = assertPaginated(res.body);
    expect(body.total).toBe(0);
    expect(body.data).toHaveLength(0);
  });
});
