import { API_GATEWAY_METHODS, TEST_BALANCE_METHODS } from '@gear-js/common';
import request from './request';
import { GearApi, HexString } from '@gear-js/api';
import config from './config';
import { sleep } from './utils';

let genesis: HexString;
let api: GearApi;

beforeAll(async () => {
  try {
    api = await GearApi.create({ providerAddress: config.gear.wsProvider, throwOnConnect: true });
  } catch (error) {
    console.log(error);
    process.exit(0);
  }

  genesis = api.genesisHash.toHex();
});

afterAll(async () => {
  await api.disconnect();
  await sleep();
});

describe('test-balance methods', () => {
  test(API_GATEWAY_METHODS.TEST_BALANCE_AVAILABLE, async () => {
    const response = await request('testBalance.available', {
      genesis,
    });

    expect(response).toHaveProperty('result', true);
  });

  test(TEST_BALANCE_METHODS.TEST_BALANCE_GET, async () => {
    const response = await request('testBalance.get', {
      genesis,
      address: '5FyVYRtJ3z92om1JmLWYbwANWaXLHLbPbXG7rQqHRzUL2BdV',
      token: 'test_token',
    });
    expect(response).toHaveProperty('result');
  });

  test(TEST_BALANCE_METHODS.TEST_BALANCE_GET + ' several reqests at a time', async () => {
    const [res1, res2, res3] = await Promise.all([
      request('testBalance.get', {
        genesis,
        address: '5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc',
        token: 'test_token',
      }),
      request('testBalance.get', {
        genesis,
        address: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
        token: 'test_token',
      }),
      request('testBalance.get', {
        genesis,
        address: '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy',
        token: 'test_token',
      }),
    ]);

    expect(res1).toHaveProperty('result');
    expect(res2).toHaveProperty('result');
    expect(res3).toHaveProperty('result');
  });
});
