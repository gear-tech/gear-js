import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { GENESIS, UNKNOWN_ID, VOUCHER_1_ID, VOUCHER_OWNER, VOUCHER_PROGRAM_ID, VOUCHER_SPENDER } from './fixtures.js';
import { assertList, err, ok, rpc } from './helpers.js';
import { getAgent, setup, teardown } from './setup.js';

const ID_REGEXP = /^0x[0-9a-f]{64}$/i;

beforeAll(setup);
afterAll(teardown);

describe('voucher.all response shape', () => {
  it('returns { result, count } with vouchers', async () => {
    const res = await rpc(getAgent(), 'voucher.all', {});
    const { result, count } = assertList(ok(res.body));

    expect(count).toBeGreaterThan(0);
    expect(result.length).toBeGreaterThan(0);
  });

  it('voucher shape has expected fields', async () => {
    const res = await rpc(getAgent(), 'voucher.all', {});
    const { result } = ok(res.body);
    const v = result[0];

    expect(v).toHaveProperty('id');
    expect(v).toHaveProperty('owner');
    expect(v).toHaveProperty('spender');
    expect(v).toHaveProperty('amount');
    expect(v).toHaveProperty('balance');
    expect(v).toHaveProperty('programs');
    expect(v.id).toMatch(ID_REGEXP);
    expect(v.owner).toMatch(ID_REGEXP);
    expect(v.spender).toMatch(ID_REGEXP);
  });
});

describe('voucher.data', () => {
  it('returns correct values for known voucher', async () => {
    const res = await rpc(getAgent(), 'voucher.data', { id: VOUCHER_1_ID });
    const v = ok(res.body);

    expect(v.id).toBe(VOUCHER_1_ID);
    expect(v.owner).toBe(VOUCHER_OWNER);
    expect(v.spender).toBe(VOUCHER_SPENDER);
    expect(v.isDeclined).toBe(false);
    expect(v.codeUploading).toBe(false);
    expect(v.programs).toContain(VOUCHER_PROGRAM_ID);
  });

  it('returns -32404 for unknown id', async () => {
    const res = await rpc(getAgent(), 'voucher.data', { id: UNKNOWN_ID });
    expect(err(res.body).code).toBe(-32404);
  });

  it('returns -32602 when id is missing', async () => {
    const res = await rpc(getAgent(), 'voucher.data', {});
    expect(err(res.body).code).toBe(-32602);
  });
});

describe('voucher.all filters', () => {
  it('owner filter returns only vouchers with that owner', async () => {
    const res = await rpc(getAgent(), 'voucher.all', { owner: VOUCHER_OWNER });
    const { result, count } = ok(res.body);

    expect(count).toBe(5);
    result.forEach((v: any) => void expect(v.owner).toBe(VOUCHER_OWNER));
  });

  it('spender filter returns only vouchers with that spender', async () => {
    const res = await rpc(getAgent(), 'voucher.all', { spender: VOUCHER_SPENDER });
    const { result, count } = ok(res.body);

    expect(count).toBe(3);
    result.forEach((v: any) => void expect(v.spender).toBe(VOUCHER_SPENDER));
  });

  it('declined=false returns all vouchers', async () => {
    const res = await rpc(getAgent(), 'voucher.all', { declined: false });
    const { count } = ok(res.body);

    expect(count).toBe(5);
  });

  it('declined=true returns empty', async () => {
    const res = await rpc(getAgent(), 'voucher.all', { declined: true });
    const { result, count } = ok(res.body);

    expect(count).toBe(0);
    expect(result).toHaveLength(0);
  });

  it('codeUploading=false returns all vouchers', async () => {
    const res = await rpc(getAgent(), 'voucher.all', { codeUploading: false });
    const { count } = ok(res.body);

    expect(count).toBe(5);
  });

  it('codeUploading=true returns empty', async () => {
    const res = await rpc(getAgent(), 'voucher.all', { codeUploading: true });
    const { result } = ok(res.body);

    expect(result).toHaveLength(0);
  });

  it('expired=true returns all vouchers', async () => {
    const res = await rpc(getAgent(), 'voucher.all', { expired: true });
    const { count } = ok(res.body);

    expect(count).toBe(5);
  });

  it('expired=false returns empty', async () => {
    const res = await rpc(getAgent(), 'voucher.all', { expired: false });
    const { result } = ok(res.body);

    expect(result).toHaveLength(0);
  });

  it('programs filter returns matching vouchers', async () => {
    const res = await rpc(getAgent(), 'voucher.all', { programs: [VOUCHER_PROGRAM_ID] });
    const { count } = ok(res.body);

    expect(count).toBe(5);
  });

  it('unknown owner returns empty', async () => {
    const res = await rpc(getAgent(), 'voucher.all', { owner: UNKNOWN_ID });
    const { result, count } = ok(res.body);

    expect(result).toHaveLength(0);
    expect(count).toBe(0);
  });

  it('unknown spender returns empty', async () => {
    const res = await rpc(getAgent(), 'voucher.all', { spender: UNKNOWN_ID });
    const { result, count } = ok(res.body);

    expect(result).toHaveLength(0);
    expect(count).toBe(0);
  });
});

describe('voucher.all pagination', () => {
  it('limit is respected', async () => {
    const res = await rpc(getAgent(), 'voucher.all', { limit: 2 });
    const { result } = ok(res.body);

    expect(result.length).toBeLessThanOrEqual(2);
  });
});

describe('REST POST /api/vouchers', () => {
  it('returns vouchers for correct genesis', async () => {
    const res = await getAgent().post('/api/vouchers').send({ genesis: GENESIS }).set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('result');
    expect(res.body).toHaveProperty('count');
    expect(res.body.count).toBeGreaterThan(0);
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

describe('REST GET /api/voucher/:id', () => {
  it('returns voucher for known id', async () => {
    const res = await getAgent()
      .get(`/api/voucher/${VOUCHER_1_ID}`)
      .send({ genesis: GENESIS })
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', VOUCHER_1_ID);
  });

  it('returns null for unknown id', async () => {
    const res = await getAgent()
      .get(`/api/voucher/${UNKNOWN_ID}`)
      .send({ genesis: GENESIS })
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
  });
});
