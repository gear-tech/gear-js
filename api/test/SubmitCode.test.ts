import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';
import { getAccount, sendTransaction, sleep } from './utilsFunctions';
import { GearApi, GearKeyring } from '../lib';
import { GEAR_EXAMPLES_WASM_DIR } from './config';

const submitCodeTestFiles = readdirSync('test/spec/submit_code');
const api = new GearApi();
const accounts = {
  alice: undefined,
  bob: undefined,
};

jest.setTimeout(15000);

beforeAll(async () => {
  await api.isReady;
  [accounts.alice, accounts.bob] = await getAccount();
});

afterAll(async () => {
  await api.disconnect();
  await sleep(2000);
});

for (let filePath of submitCodeTestFiles) {
  const testFile = yaml.load(readFileSync(join('./test/spec/submit_code', filePath), 'utf8'));
  if (testFile.skip) {
    continue;
  }
  describe(testFile.title, () => {
    test('Submit code', async () => {
      for (let program of testFile.programs) {
        const code = readFileSync(join(GEAR_EXAMPLES_WASM_DIR, `${program.name}.opt.wasm`));
        const { codeHash } = api.code.submit(code);
        expect(codeHash).toBeDefined();

        const transactionData = await sendTransaction(api.code, accounts[program.account], 'CodeSaved');

        expect(transactionData).toBe(codeHash);
      }
      return;
    });
  });
}
