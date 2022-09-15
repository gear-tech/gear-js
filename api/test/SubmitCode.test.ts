import { readFileSync } from 'fs';
import { join } from 'path';

import { getAccount, sendTransaction, sleep } from './utilsFunctions';
import { GearApi } from '../src';
import { GEAR_EXAMPLES_WASM_DIR } from './config';

const api = new GearApi();
const accounts = {};
const code = readFileSync(join(GEAR_EXAMPLES_WASM_DIR, 'demo_sum.opt.wasm'));

beforeAll(async () => {
  await api.isReadyOrError;
  [accounts['alice']] = await getAccount();
});

afterAll(async () => {
  await api.disconnect();
  await sleep(1000);
});

describe('Submit code', () => {
  test('demo_sum', async () => {
    const { codeHash } = await api.code.upload(code);
    expect(codeHash).toBeDefined();
    const transactionData = await sendTransaction(api.code, accounts['alice'], 'CodeChanged');
    expect(transactionData.id).toBe(codeHash);
    expect(transactionData.change).toHaveProperty('Active');
    expect(transactionData.change.Active).toHaveProperty('expiration');
  });

  test('Throw error when code exists', async () => {
    await expect(api.code.upload(code)).rejects.toThrow('Code already exists');
  });
});
