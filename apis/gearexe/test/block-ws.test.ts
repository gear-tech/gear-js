import { GearExeApi, WsGearexeProvider } from '../src';

let provider: WsGearexeProvider;
let api: GearExeApi;

beforeAll(() => {
  provider = new WsGearexeProvider();
  api = new GearExeApi(provider);
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
