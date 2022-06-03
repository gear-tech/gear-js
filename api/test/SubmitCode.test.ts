import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';
import { getAccount, sendTransaction, sleep } from './utilsFunctions';
import { GearApi } from '../lib';
import { GEAR_EXAMPLES_WASM_DIR } from './config';

const api = new GearApi();
const accounts = {
  alice: undefined,
  bob: undefined,
};

beforeAll(async () => {
  await api.isReady;
  [accounts.alice] = await getAccount();
});

afterAll(async () => {
  await api.disconnect();
  await sleep(2000);
});

describe('Submit code', () => {
  test('demo_sum', async () => {
    const code = readFileSync(join(GEAR_EXAMPLES_WASM_DIR, `demo_sum.opt.wasm`));
    const { codeHash } = api.code.submit(code);
    expect(codeHash).toBeDefined();

    const transactionData = await sendTransaction(api.code, accounts.alice, 'CodeChanged');
    expect(transactionData[0]).toBe(codeHash);
    expect(transactionData[1]).toHaveProperty('Active');
    expect(transactionData[1].Active).toHaveProperty('expiration');
  });
});
