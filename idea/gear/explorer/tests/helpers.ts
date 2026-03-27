import { expect } from 'vitest';
import type { SuperTest, Test } from 'supertest';
import { GENESIS } from './fixtures.js';

export type Agent = SuperTest<Test>;

let _idCounter = 1;

/** Send a JSON-RPC 2.0 request to POST /api */
export const rpc = (agent: Agent, method: string, params: Record<string, unknown> = {}) =>
  agent
    .post('/api')
    .send({ jsonrpc: '2.0', id: _idCounter++, method, params: { genesis: GENESIS, ...params } })
    .set('Accept', 'application/json');

/** Assert the response is a successful JSON-RPC result and return the result payload */
export function ok(body: any) {
  expect(body.jsonrpc).toBe('2.0');
  expect(body).toHaveProperty('id');
  expect(body.error).toBeUndefined();
  expect(body).toHaveProperty('result');
  return body.result;
}

/** Assert the response is a JSON-RPC error and return the error object */
export function err(body: any) {
  expect(body.jsonrpc).toBe('2.0');
  expect(body).toHaveProperty('id');
  expect(body.result).toBeUndefined();
  expect(body).toHaveProperty('error');
  return body.error;
}

/** Assert a list response has the expected shape */
export function assertList(result: any) {
  expect(result).toHaveProperty('result');
  expect(result).toHaveProperty('count');
  expect(Array.isArray(result.result)).toBe(true);
  expect(typeof result.count).toBe('number');
}

export const ID_REGEXP = /^0x[0-9a-f]{64}$/i;
