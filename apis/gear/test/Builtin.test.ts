import { sleep } from './utilsFunctions';
import { getApi } from './common';

const api = getApi();

beforeAll(async () => {
  await api.isReadyOrError;
});

afterAll(async () => {
  await api.disconnect();
  await sleep(1000);
});

describe('Query id', () => {
  test('Random query id', async () => {
    const builtinId = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER / 2));

    const id = await api.builtin.queryId(builtinId);
    expect(id.length).toBe(66);
  });
});
