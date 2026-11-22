import request from 'supertest';
import { FaucetApp } from '../src/app';
import { FaucetType, RequestStatus } from '../src/database';
import { hash } from '../src/services/db/last-seen';
import { repos } from './__mocks__/db';

const ETH_USER_ADDRESS = '0x0000000000000000000000000000000000000001';
const ETH_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000002';
const VARA_GENESIS = '0x0000000000000000000000000000000000000000000000000000000000000000';
const ALICE = '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d';

describe('Bridge requests', () => {
  let app: FaucetApp;
  const req = (address?: string, contract?: string, genesis?: string) =>
    request(app.server.app)
      .post('/bridge/request')
      .send({ token: '1234', address, contract, genesis })
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
    expect(res.text).toBe('An ERC20 contract is required; Substrate genesis requests are no longer supported');

    res = await req(undefined, ETH_CONTRACT_ADDRESS);

    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('User address is required');
  });

  it('should return UnsupportedTarget error', async () => {
    const res = await req(ETH_USER_ADDRESS, '0x1234');

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: '0x1234 is not supported' });
  });

  it('should return InvalidAddress error', async () => {
    const res = await req('0x1234', ETH_CONTRACT_ADDRESS);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid account address' });
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
    expect(faucetRequestData[1]).toHaveProperty('type', FaucetType.BridgeErc20);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    faucetRequestData = repos.FaucetRequest._data();
    expect(faucetRequestData[1].status).toBe(RequestStatus.Processing);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    faucetRequestData = repos.FaucetRequest._data();
    expect(faucetRequestData[1].status).toBe(RequestStatus.Completed);

    const userLastSeenData = repos.UserLastSeen._data();
    expect(userLastSeenData).toHaveProperty(hash(ETH_USER_ADDRESS, ETH_CONTRACT_ADDRESS));
  });

  it('should return request limit error', async () => {
    const res = await req(ETH_USER_ADDRESS, ETH_CONTRACT_ADDRESS);

    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ error: 'The limit for requesting test balance has been reached.' });
  });

  it('should return error when both contract and genesis are provided', async () => {
    const res = await req(ETH_USER_ADDRESS, ETH_CONTRACT_ADDRESS, VARA_GENESIS);

    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('An ERC20 contract is required; Substrate genesis requests are no longer supported');
  });

  it('rejects retired Substrate genesis requests without adding to the queue', async () => {
    const before = Object.keys(repos.FaucetRequest._data()).length;
    const res = await req(ALICE, undefined, VARA_GENESIS);

    expect(res.statusCode).toBe(400);
    expect(Object.keys(repos.FaucetRequest._data())).toHaveLength(before);
  });
});
