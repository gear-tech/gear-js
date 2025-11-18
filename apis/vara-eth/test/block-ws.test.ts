import { VaraEthApi, WsVaraEthProvider } from '../src';

let provider: WsVaraEthProvider;
let api: VaraEthApi;

beforeAll(() => {
  provider = new WsVaraEthProvider();
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
