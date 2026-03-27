import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setup, teardown, getAgent } from './setup.js';
import { GENESIS, UNKNOWN_GENESIS } from './fixtures.js';

beforeAll(setup);
afterAll(teardown);

describe('JSON-RPC protocol', () => {
  it('response always has jsonrpc: "2.0" and matching id', async () => {
    const res = await getAgent()
      .post('/api')
      .send({ jsonrpc: '2.0', id: 42, method: 'program.all', params: { genesis: GENESIS } });

    expect(res.body.jsonrpc).toBe('2.0');
    expect(res.body.id).toBe(42);
  });

  it('missing genesis returns error', async () => {
    const res = await getAgent()
      .post('/api')
      .send({ jsonrpc: '2.0', id: 1, method: 'program.all', params: {} });

    expect(res.body.error).toBeDefined();
    expect(typeof res.body.error.code).toBe('number');
    expect(typeof res.body.error.message).toBe('string');
  });

  it('unknown genesis returns NetworkNotSupported error', async () => {
    const res = await getAgent()
      .post('/api')
      .send({ jsonrpc: '2.0', id: 1, method: 'program.all', params: { genesis: UNKNOWN_GENESIS } });

    expect(res.body.error).toBeDefined();
    expect(res.body.error.message).toMatch(/not supported/i);
  });

  it('unknown method returns -32601 MethodNotFound', async () => {
    const res = await getAgent()
      .post('/api')
      .send({ jsonrpc: '2.0', id: 1, method: 'doesnt.exist', params: { genesis: GENESIS } });

    expect(res.body.error.code).toBe(-32601);
    expect(res.body.error.message).toBe('Method not found');
  });

  it('batch request returns array of responses', async () => {
    const res = await getAgent()
      .post('/api')
      .send([
        { jsonrpc: '2.0', id: 1, method: 'program.all', params: { genesis: GENESIS } },
        { jsonrpc: '2.0', id: 2, method: 'code.all', params: { genesis: GENESIS } },
      ]);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].id).toBe(1);
    expect(res.body[1].id).toBe(2);
    res.body.forEach((r: any) => expect(r.jsonrpc).toBe('2.0'));
  });

  it('error response never has a result field', async () => {
    const res = await getAgent()
      .post('/api')
      .send({ jsonrpc: '2.0', id: 1, method: 'bad.method', params: { genesis: GENESIS } });

    expect(res.body.result).toBeUndefined();
  });

  it('successful response never has an error field', async () => {
    const res = await getAgent()
      .post('/api')
      .send({ jsonrpc: '2.0', id: 1, method: 'program.all', params: { genesis: GENESIS } });

    expect(res.body.error).toBeUndefined();
  });
});
