import { GearexeApi, HttpGearexeProvider } from '../src';

let provider: HttpGearexeProvider;
let api: GearexeApi;

beforeAll(async () => {
  provider = new HttpGearexeProvider();
  api = new GearexeApi(provider);
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
