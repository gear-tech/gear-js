import { VaraEthApi, HttpVaraEthProvider } from '../src';

let provider: HttpVaraEthProvider;
let api: VaraEthApi;

beforeAll(async () => {
  provider = new HttpVaraEthProvider();
  api = new VaraEthApi(provider);
});

afterAll(async () => {
  await provider.disconnect();
});

describe('Block methods', () => {
  test('get header', async () => {
    const header = await api.query.block.header();

    expect(header).toHaveProperty(['hash']);
    expect(header).toHaveProperty(['height']);
    expect(header).toHaveProperty(['timestamp']);
    expect(header).toHaveProperty(['parentHash']);
  });
});
