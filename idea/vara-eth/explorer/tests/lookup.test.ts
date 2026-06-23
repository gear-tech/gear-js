import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  BATCH_1_ID,
  BATCH_2_ID,
  CODE_1_ID,
  CODE_2_ID,
  ETHEREUM_TX_1_ID,
  ETHEREUM_TX_2_ID,
  UNKNOWN_ID,
} from './fixtures.js';
import { assertNotFound, getOne, validateBatchDto, validateCodeDto, validateTransactionDetailDto } from './helpers.js';
import { getAgent, setup, teardown } from './setup.js';

beforeAll(setup);
afterAll(teardown);

describe('GET /api/lookup/:hash', () => {
  it('resolves a batch', async () => {
    const res = await getOne(getAgent(), `/api/lookup/${BATCH_1_ID}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('type', 'Batch');
    expect(res.body).toHaveProperty('data');
    validateBatchDto(res.body.data);
    expect(res.body.data.id).toBe(BATCH_1_ID);
  });

  it('resolves another batch', async () => {
    const res = await getOne(getAgent(), `/api/lookup/${BATCH_2_ID}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('type', 'Batch');
    validateBatchDto(res.body.data);
    expect(res.body.data.id).toBe(BATCH_2_ID);
  });

  it('resolves a code', async () => {
    const res = await getOne(getAgent(), `/api/lookup/${CODE_1_ID}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('type', 'Code');
    validateCodeDto(res.body.data);
    expect(res.body.data.id).toBe(CODE_1_ID);
  });

  it('resolves another code', async () => {
    const res = await getOne(getAgent(), `/api/lookup/${CODE_2_ID}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('type', 'Code');
    validateCodeDto(res.body.data);
    expect(res.body.data.id).toBe(CODE_2_ID);
  });

  it('resolves a transaction', async () => {
    const res = await getOne(getAgent(), `/api/lookup/${ETHEREUM_TX_1_ID}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('type', 'Tx');
    validateTransactionDetailDto(res.body.data);
    expect(res.body.data.id).toBe(ETHEREUM_TX_1_ID);
  });

  it('resolves another transaction', async () => {
    const res = await getOne(getAgent(), `/api/lookup/${ETHEREUM_TX_2_ID}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('type', 'Tx');
    validateTransactionDetailDto(res.body.data);
    expect(res.body.data.id).toBe(ETHEREUM_TX_2_ID);
  });

  it('returns 404 for a program id (not registered in hash_registry)', async () => {
    // Programs are not stored in hash_registry in this dump
    const res = await getOne(getAgent(), `/api/lookup/0xebf617f7cc1974a74d04d9e2fe510e287442c67b`);
    expect(res.status).toBe(404);
    assertNotFound(res.body);
  });

  it('returns 404 for unknown hash', async () => {
    const res = await getOne(getAgent(), `/api/lookup/${UNKNOWN_ID}`);
    expect(res.status).toBe(404);
    assertNotFound(res.body);
  });
});
