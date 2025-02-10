import { GearExeApi, HttpGearexeProvider } from '../src';

let provider: HttpGearexeProvider;
let api: GearExeApi;

beforeAll(async () => {
  provider = new HttpGearexeProvider();
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
