import './__mocks__/ethers';
import './__mocks__/typeorm';

import request from 'supertest';
import { hash } from '../src/services/db/last-seen';
import { RequestStatus } from '../src/database';
import { FaucetApp } from '../src/main';
import { repos } from './__mocks__/db';

const ETH_USER_ADDRESS = '0x0000000000000000000000000000000000000001';
const ETH_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000002';

describe('Bridge requests', () => {
  let app: FaucetApp;
  const req = (address?: string, contract?: string) =>
    request(app.server.app)
      .post('/bridge/request')
      .send({ token: '1234', address, contract })
      .set('Accept', 'application/json');

  beforeAll(async () => {
    app = new FaucetApp(true, false);
    await app.init();
    app.run();
  });

  afterAll(() => {
    app.destroy();
  });

  it('should return an error about missing fields', async () => {
    let res = await req(ETH_USER_ADDRESS);

    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('User address and contract address are required');

    res = await req(undefined, ETH_CONTRACT_ADDRESS);

    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('User address and contract address are required');
  });

  it('should return UnsupportedTarget error', async () => {
    const res = await req(ETH_USER_ADDRESS, '0x1234');

    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('0x1234 is not supported');
  });

  it('should return InvalidAddress error', async () => {
    const res = await req('0x1234', ETH_CONTRACT_ADDRESS);

    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('Invalid account address');
  });

  it('should return ok', async () => {
    const res = await req(ETH_USER_ADDRESS, ETH_CONTRACT_ADDRESS);

    expect(res.statusCode).toBe(200);

    let faucetRequestData = repos.FaucetRequest._data();

    expect(faucetRequestData).toHaveProperty('1');
    expect(faucetRequestData[1]).toHaveProperty('id', 1);
    expect(faucetRequestData[1]).toHaveProperty('address', ETH_USER_ADDRESS);
    expect(faucetRequestData[1]).toHaveProperty('target', ETH_CONTRACT_ADDRESS);
    expect(faucetRequestData[1]).toHaveProperty('status', RequestStatus.Pending);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    faucetRequestData = repos.FaucetRequest._data();
    expect(faucetRequestData[1].status).toBe(RequestStatus.Processing);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    faucetRequestData = repos.FaucetRequest._data();
    expect(faucetRequestData[1].status).toBe(RequestStatus.Completed);

    let userLastSeenData = repos.UserLastSeen._data();
    expect(userLastSeenData).toHaveProperty(hash(ETH_USER_ADDRESS, ETH_CONTRACT_ADDRESS));
  });

  it('should return request limit error', async () => {
    const res = await req(ETH_USER_ADDRESS, ETH_CONTRACT_ADDRESS);

    expect(res.statusCode).toBe(403);
    expect(res.text).toBe('The limit for requesting test balance has been reached.');
  });
});
