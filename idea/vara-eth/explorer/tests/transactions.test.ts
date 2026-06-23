import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { CONTRACT_1, ETHEREUM_TX_1_ID, ETHEREUM_TX_2_ID, ETHEREUM_TX_3_ID, SENDER_1, UNKNOWN_ID } from './fixtures.js';
import {
  assertNotFound,
  assertPaginated,
  getList,
  getOne,
  validateTransactionDetailDto,
  validateTransactionListDto,
} from './helpers.js';
import { getAgent, setup, teardown } from './setup.js';

beforeAll(setup);
afterAll(teardown);

// ── GET /api/transactions/:hash ────────────────────────────────────────────────

describe('GET /api/transactions/:hash', () => {
  it('returns transaction with full type validation including data field', async () => {
    const res = await getOne(getAgent(), `/api/transactions/${ETHEREUM_TX_1_ID}`);
    expect(res.status).toBe(200);
    validateTransactionDetailDto(res.body);
    expect(res.body.id).toBe(ETHEREUM_TX_1_ID);
    expect(res.body.blockNumber).toBe('2435545');
    expect(res.body.sender).toBe(SENDER_1);
    expect(res.body.contractAddress).toBe(CONTRACT_1);
  });

  it('returns second transaction', async () => {
    const res = await getOne(getAgent(), `/api/transactions/${ETHEREUM_TX_2_ID}`);
    expect(res.status).toBe(200);
    validateTransactionDetailDto(res.body);
    expect(res.body.id).toBe(ETHEREUM_TX_2_ID);
    expect(res.body.blockNumber).toBe('2436046');
  });

  it('returns third transaction', async () => {
    const res = await getOne(getAgent(), `/api/transactions/${ETHEREUM_TX_3_ID}`);
    expect(res.status).toBe(200);
    validateTransactionDetailDto(res.body);
    expect(res.body.id).toBe(ETHEREUM_TX_3_ID);
    expect(res.body.blockNumber).toBe('2436547');
  });

  it('returns 404 for unknown hash', async () => {
    const res = await getOne(getAgent(), `/api/transactions/${UNKNOWN_ID}`);
    expect(res.status).toBe(404);
    assertNotFound(res.body);
  });
});

// ── GET /api/transactions list ─────────────────────────────────────────────────

describe('GET /api/transactions', () => {
  it('returns paginated shape with correct types (list DTO lacks data field)', async () => {
    const res = await getList(getAgent(), '/api/transactions');
    expect(res.status).toBe(200);
    const body = assertPaginated(res.body);
    expect(body.data.length).toBeGreaterThan(0);
    body.data.forEach((t: any) => void validateTransactionListDto(t));
    body.data.forEach((t: any) => {
      expect(t).not.toHaveProperty('data');
    });
  });

  it('sender filter narrows results', async () => {
    const res = await getList(getAgent(), '/api/transactions', { sender: SENDER_1 });
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    res.body.data.forEach((tx: any) => {
      expect(tx.sender).toBe(SENDER_1);
    });
  });

  it('fromBlock / toBlock filters work', async () => {
    const res = await getList(getAgent(), '/api/transactions', { fromBlock: 0, toBlock: 2435544 });
    expect(res.body.data).toHaveLength(0);

    const res2 = await getList(getAgent(), '/api/transactions', { fromBlock: 2435545, toBlock: 2435545 });
    expect(res2.body.data.length).toBe(1);
    expect(res2.body.data[0].id).toBe(ETHEREUM_TX_1_ID);
  });
});
