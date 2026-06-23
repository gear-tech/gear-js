import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  MSG_REQ_1_ID,
  MSG_REQ_3_ID,
  MSG_REQ_SOURCE_ADDRESS,
  MSG_SENT_1_ID,
  MSG_SENT_2_ID,
  PROGRAM_1_ID,
  PROGRAM_3_ID,
  UNKNOWN_ID,
} from './fixtures.js';
import {
  assertNotFound,
  assertPaginated,
  getList,
  getOne,
  validateMessageRequestDto,
  validateMessageSentDto,
} from './helpers.js';
import { getAgent, setup, teardown } from './setup.js';

beforeAll(setup);
afterAll(teardown);

// ── GET /api/messages/requests/:id ──────────────────────────────────────────────

describe('GET /api/messages/requests/:id', () => {
  it('returns message request with full type validation and program relation', async () => {
    const res = await getOne(getAgent(), `/api/messages/requests/${MSG_REQ_1_ID}`);
    expect(res.status).toBe(200);
    validateMessageRequestDto(res.body, true);
    expect(res.body.id).toBe(MSG_REQ_1_ID);
    expect(res.body.programId).toBe(PROGRAM_1_ID);
    expect(res.body.callReply).toBe(false);
    expect(res.body.value).toBe('0');
    expect(res.body.blockNumber).toBe('2441046');
    expect(res.body.program).toBeDefined();
  });

  it('returns message request with null program relation when program not in dump', async () => {
    const res = await getOne(getAgent(), `/api/messages/requests/${MSG_REQ_3_ID}`);
    expect(res.status).toBe(200);
    validateMessageRequestDto(res.body, true);
    expect(res.body.program).toBeNull();
  });

  it('returns 404 for unknown id', async () => {
    const res = await getOne(getAgent(), `/api/messages/requests/${UNKNOWN_ID}`);
    expect(res.status).toBe(404);
    assertNotFound(res.body);
  });
});

// ── GET /api/messages/sent/:id ───────────────────────────────────────────────

describe('GET /api/messages/sent/:id', () => {
  it('returns message sent with full type validation and sourceProgram relation', async () => {
    const res = await getOne(getAgent(), `/api/messages/sent/${MSG_SENT_1_ID}`);
    expect(res.status).toBe(200);
    validateMessageSentDto(res.body, true);
    expect(res.body.id).toBe(MSG_SENT_1_ID);
    expect(res.body.sourceProgramId).toBe(PROGRAM_3_ID);
    expect(res.body.isCall).toBe(false);
    expect(res.body.value).toBe('0');
    expect(res.body.sourceProgram).toBeDefined();
  });

  it('returns message sent with null sourceProgram relation when program not in dump', async () => {
    // MSG_SENT_2_ID sourceProgramId is 0x8006b568da891d834af329d333dc612a5b908c2e — not in dump
    const res = await getOne(getAgent(), `/api/messages/sent/${MSG_SENT_2_ID}`);
    expect(res.status).toBe(200);
    validateMessageSentDto(res.body, true);
    expect(res.body.sourceProgram).toBeNull();
  });

  it('returns 404 for unknown id', async () => {
    const res = await getOne(getAgent(), `/api/messages/sent/${UNKNOWN_ID}`);
    expect(res.status).toBe(404);
    assertNotFound(res.body);
  });
});

// ── GET /api/messages/requests list ───────────────────────────────────────────

describe('GET /api/messages/requests', () => {
  it('returns paginated shape with correct types', async () => {
    const res = await getList(getAgent(), '/api/messages/requests');
    expect(res.status).toBe(200);
    const body = assertPaginated(res.body);
    expect(body.data.length).toBeGreaterThan(0);
    body.data.forEach((m: any) => void validateMessageRequestDto(m));
  });

  it('programId filter narrows results', async () => {
    const res = await getList(getAgent(), '/api/messages/requests', { programId: PROGRAM_1_ID });
    expect(res.status).toBe(200);
    res.body.data.forEach((m: any) => {
      expect(m.programId).toBe(PROGRAM_1_ID);
    });
  });

  it('sourceAddress filter narrows results', async () => {
    const res = await getList(getAgent(), '/api/messages/requests', { sourceAddress: MSG_REQ_SOURCE_ADDRESS });
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    res.body.data.forEach((m: any) => {
      expect(m.sourceAddress).toBe(MSG_REQ_SOURCE_ADDRESS);
    });
  });

  it('fromBlock / toBlock filters work', async () => {
    const res = await getList(getAgent(), '/api/messages/requests', { fromBlock: 0, toBlock: 2441045 });
    expect(res.body.data).toHaveLength(0);

    const res2 = await getList(getAgent(), '/api/messages/requests', { fromBlock: 2441046, toBlock: 2442954 });
    expect(res2.body.data.length).toBeGreaterThan(0);
  });
});

// ── GET /api/messages/sent list ───────────────────────────────────────────────

describe('GET /api/messages/sent', () => {
  it('returns paginated shape with correct types', async () => {
    const res = await getList(getAgent(), '/api/messages/sent');
    expect(res.status).toBe(200);
    const body = assertPaginated(res.body);
    expect(body.data.length).toBeGreaterThan(0);
    body.data.forEach((m: any) => void validateMessageSentDto(m));
  });

  it('programId filter narrows results', async () => {
    const res = await getList(getAgent(), '/api/messages/sent', { programId: PROGRAM_3_ID });
    expect(res.status).toBe(200);
    res.body.data.forEach((m: any) => {
      expect(m.sourceProgramId).toBe(PROGRAM_3_ID);
    });
  });
});
