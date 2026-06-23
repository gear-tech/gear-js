import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  MSG_REQ_1_ID,
  PROGRAM_1_ID,
  REPLY_REQ_1_ID,
  REPLY_REQ_2_ID,
  REPLY_SENT_1_ID,
  REPLY_SENT_3_ID,
  UNKNOWN_ID,
} from './fixtures.js';
import {
  assertNotFound,
  assertPaginated,
  getList,
  getOne,
  validateReplyRequestDto,
  validateReplySentDto,
} from './helpers.js';
import { getAgent, setup, teardown } from './setup.js';

beforeAll(setup);
afterAll(teardown);

// ── GET /api/replies/requests/:id ──────────────────────────────────────────────

describe('GET /api/replies/requests/:id', () => {
  it('returns reply request with full type validation and null program relation', async () => {
    // All reply_request rows in dump reference programs NOT in the dump
    const res = await getOne(getAgent(), `/api/replies/requests/${REPLY_REQ_1_ID}`);
    expect(res.status).toBe(200);
    validateReplyRequestDto(res.body, true);
    expect(res.body.id).toBe(REPLY_REQ_1_ID);
    expect(res.body.value).toBe('1000000000000000');
    expect(res.body.blockNumber).toBe('2681680');
    expect(res.body.program).toBeNull();
  });

  it('returns second reply request', async () => {
    const res = await getOne(getAgent(), `/api/replies/requests/${REPLY_REQ_2_ID}`);
    expect(res.status).toBe(200);
    validateReplyRequestDto(res.body, true);
    expect(res.body.id).toBe(REPLY_REQ_2_ID);
    expect(res.body.value).toBe('1000000000000000');
    expect(res.body.blockNumber).toBe('2681681');
    expect(res.body.program).toBeNull();
  });

  it('returns 404 for unknown id', async () => {
    const res = await getOne(getAgent(), `/api/replies/requests/${UNKNOWN_ID}`);
    expect(res.status).toBe(404);
    assertNotFound(res.body);
  });
});

// ── GET /api/replies/sent/:id ────────────────────────────────────────────────

describe('GET /api/replies/sent/:id', () => {
  it('returns reply sent with full type validation and sourceProgram relation', async () => {
    const res = await getOne(getAgent(), `/api/replies/sent/${REPLY_SENT_1_ID}`);
    expect(res.status).toBe(200);
    validateReplySentDto(res.body, true);
    expect(res.body.id).toBe(REPLY_SENT_1_ID);
    expect(res.body.sourceProgramId).toBe(PROGRAM_1_ID);
    expect(res.body.replyCode).toBe('0x01000000');
    expect(res.body.isCall).toBe(false);
    expect(res.body.value).toBe('0');
    expect(res.body.sourceProgram).toBeDefined();
  });

  it('returns reply sent with null sourceProgram relation when program not in dump', async () => {
    const res = await getOne(getAgent(), `/api/replies/sent/${REPLY_SENT_3_ID}`);
    expect(res.status).toBe(200);
    validateReplySentDto(res.body, true);
    expect(res.body.sourceProgram).toBeNull();
  });

  it('returns 404 for unknown id', async () => {
    const res = await getOne(getAgent(), `/api/replies/sent/${UNKNOWN_ID}`);
    expect(res.status).toBe(404);
    assertNotFound(res.body);
  });
});

// ── GET /api/replies/requests list ────────────────────────────────────────────

describe('GET /api/replies/requests', () => {
  it('returns paginated shape with correct types', async () => {
    const res = await getList(getAgent(), '/api/replies/requests');
    expect(res.status).toBe(200);
    const body = assertPaginated(res.body);
    expect(body.data.length).toBeGreaterThan(0);
    body.data.forEach((r: any) => void validateReplyRequestDto(r));
  });

  it('programId filter returns empty for programs in dump (reply requests reference other programs)', async () => {
    const res = await getList(getAgent(), '/api/replies/requests', { programId: PROGRAM_1_ID });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });
});

// ── GET /api/replies/sent list ───────────────────────────────────────────────

describe('GET /api/replies/sent', () => {
  it('returns paginated shape with correct types', async () => {
    const res = await getList(getAgent(), '/api/replies/sent');
    expect(res.status).toBe(200);
    const body = assertPaginated(res.body);
    expect(body.data.length).toBeGreaterThan(0);
    body.data.forEach((r: any) => void validateReplySentDto(r));
  });

  it('programId filter narrows results', async () => {
    const res = await getList(getAgent(), '/api/replies/sent', { programId: PROGRAM_1_ID });
    expect(res.status).toBe(200);
    res.body.data.forEach((r: any) => {
      expect(r.sourceProgramId).toBe(PROGRAM_1_ID);
    });
  });

  it('repliedToId filter narrows results', async () => {
    const res = await getList(getAgent(), '/api/replies/sent', { repliedToId: MSG_REQ_1_ID });
    expect(res.status).toBe(200);
    res.body.data.forEach((r: any) => {
      expect(r.repliedToId).toBe(MSG_REQ_1_ID);
    });
  });
});
