import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { GENESIS, UNKNOWN_ID } from './fixtures.js';
import { assertList, err, ok, rpc } from './helpers.js';
import { getAgent, setup, teardown } from './setup.js';

beforeAll(setup);
afterAll(teardown);

// The dump has no vouchers (the voucher table is empty).

// ── JSON-RPC voucher.all ───────────────────────────────────────────────────────

describe('voucher.all response shape', () => {
  it('returns { result: [], count: number }', async () => {
    const res = await rpc(getAgent(), 'voucher.all', {});
    assertList(ok(res.body));
  });

  it('returns empty result (no vouchers in dump)', async () => {
    const res = await rpc(getAgent(), 'voucher.all', {});
    const { result, count } = ok(res.body);

    expect(result).toHaveLength(0);
    expect(count).toBe(0);
  });
});

describe('voucher.all filters return empty (no data)', () => {
  it('owner filter', async () => {
    const res = await rpc(getAgent(), 'voucher.all', { owner: UNKNOWN_ID });
    const { result, count } = ok(res.body);
    expect(result).toHaveLength(0);
    expect(count).toBe(0);
  });

  it('spender filter', async () => {
    const res = await rpc(getAgent(), 'voucher.all', { spender: UNKNOWN_ID });
    const { result, count } = ok(res.body);
    expect(result).toHaveLength(0);
    expect(count).toBe(0);
  });

  it('declined=true filter', async () => {
    const res = await rpc(getAgent(), 'voucher.all', { declined: true });
    const { result } = ok(res.body);
    expect(result).toHaveLength(0);
  });

  it('declined=false filter', async () => {
    const res = await rpc(getAgent(), 'voucher.all', { declined: false });
    const { result } = ok(res.body);
    expect(result).toHaveLength(0);
  });

  it('codeUploading=true filter', async () => {
    const res = await rpc(getAgent(), 'voucher.all', { codeUploading: true });
    const { result } = ok(res.body);
    expect(result).toHaveLength(0);
  });

  it('expired=true filter', async () => {
    const res = await rpc(getAgent(), 'voucher.all', { expired: true });
    const { result } = ok(res.body);
    expect(result).toHaveLength(0);
  });

  it('programs filter', async () => {
    const res = await rpc(getAgent(), 'voucher.all', { programs: [UNKNOWN_ID] });
    const { result } = ok(res.body);
    expect(result).toHaveLength(0);
  });
});

// ── JSON-RPC voucher.data ──────────────────────────────────────────────────────

describe('voucher.data', () => {
  it('returns -32404 for unknown id', async () => {
    const res = await rpc(getAgent(), 'voucher.data', { id: UNKNOWN_ID });
    expect(err(res.body).code).toBe(-32404);
  });

  it('returns -32602 when id is missing', async () => {
    const res = await rpc(getAgent(), 'voucher.data', {});
    expect(err(res.body).code).toBe(-32602);
  });
});

// ── REST POST /api/vouchers ────────────────────────────────────────────────────

describe('REST POST /api/vouchers', () => {
  it('returns empty result for no vouchers', async () => {
    const res = await getAgent().post('/api/vouchers').send({ genesis: GENESIS }).set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('result');
    expect(res.body).toHaveProperty('count');
    expect(res.body.result).toHaveLength(0);
    expect(res.body.count).toBe(0);
  });

  it('returns 400 without genesis', async () => {
    const res = await getAgent().post('/api/vouchers').send({}).set('Accept', 'application/json');

    expect(res.status).toBe(400);
  });

  it('returns 400 for unknown genesis', async () => {
    const res = await getAgent()
      .post('/api/vouchers')
      .send({ genesis: `0x${'ab'.repeat(32)}` })
      .set('Accept', 'application/json');

    expect(res.status).toBe(400);
  });
});

// ── REST GET /api/voucher/:id ──────────────────────────────────────────────────

describe('REST GET /api/voucher/:id', () => {
  it('returns null for unknown id', async () => {
    // The route handler reads genesis from req.body (not query string),
    // so we send it as a JSON body even on GET.
    const id = UNKNOWN_ID;
    const res = await getAgent().get(`/api/voucher/${id}`).send({ genesis: GENESIS }).set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
  });
});
