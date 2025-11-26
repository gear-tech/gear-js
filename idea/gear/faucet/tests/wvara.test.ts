import './__mocks__/viem';
import './__mocks__/typeorm';
import './__mocks__/gear-js';

import request from 'supertest';
import { hash } from '../src/services/db/last-seen';
import { FaucetType, RequestStatus } from '../src/database';
import { FaucetApp } from '../src/main';
import { repos } from './__mocks__/db';

const ETH_USER_ADDRESS = '0x0000000000000000000000000000000000000001';
const WVARA_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000005';

describe('WVARA requests', () => {
  let app: FaucetApp;
  const req = (address?: string) =>
    request(app.server.app).post('/wvara/request').send({ token: '1234', address }).set('Accept', 'application/json');

  beforeAll(async () => {
    repos.FaucetRequest.clear();
    repos.UserLastSeen.clear();

    app = new FaucetApp(false, false, true);
    await app.init();
    app.run();

    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  afterAll(() => {
    app.destroy();
  });

  it('should return an error about missing address field', async () => {
    const res = await req();

    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('User address is required');
  });

  it('should return InvalidAddress error', async () => {
    const res = await req('0x1234');

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid account address' });
  });

  it('should return ok for valid address', async () => {
    const res = await req(ETH_USER_ADDRESS);

    expect(res.statusCode).toBe(200);

    let faucetRequestData = repos.FaucetRequest._data();
    const requestId = Object.keys(faucetRequestData).find(
      (key) =>
        faucetRequestData[key].address === ETH_USER_ADDRESS &&
        faucetRequestData[key].target === WVARA_CONTRACT_ADDRESS &&
        faucetRequestData[key].type === FaucetType.WVara,
    )!;

    expect(requestId).toBeDefined();
    expect(faucetRequestData[requestId]).toHaveProperty('address', ETH_USER_ADDRESS);
    expect(faucetRequestData[requestId]).toHaveProperty('target', WVARA_CONTRACT_ADDRESS);
    expect(faucetRequestData[requestId]).toHaveProperty('type', FaucetType.WVara);
    expect(faucetRequestData[requestId]).toHaveProperty('status', RequestStatus.Pending);

    await new Promise((resolve) => setTimeout(resolve, 3500));

    faucetRequestData = repos.FaucetRequest._data();
    expect(faucetRequestData[requestId].status).toBe(RequestStatus.Completed);

    let userLastSeenData = repos.UserLastSeen._data();
    expect(userLastSeenData).toHaveProperty(hash(ETH_USER_ADDRESS, WVARA_CONTRACT_ADDRESS));
  });

  it('should return request limit error', async () => {
    const res = await req(ETH_USER_ADDRESS);

    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ error: 'The limit for requesting test balance has been reached.' });
  });

  it('should return error on concurrent requests from same address', async () => {
    const newAddress = '0x0000000000000000000000000000000000000002';
    const [res1, res2] = await Promise.all([req(newAddress), req(newAddress)]);

    expect(res1.statusCode).toBe(200);
    expect(res2.body).toEqual({ error: 'Too many requests, please try again later.' });
    expect(res2.statusCode).toBe(429);
  });
});
