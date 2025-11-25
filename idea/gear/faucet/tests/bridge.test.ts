import './__mocks__/viem';
import './__mocks__/typeorm';
import './__mocks__/gear-js';

import request from 'supertest';
import { hash } from '../src/services/db/last-seen';
import { FaucetType, RequestStatus } from '../src/database';
import { FaucetApp } from '../src/main';
import { repos } from './__mocks__/db';
import { Keyring } from '@polkadot/api';

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
    app = new FaucetApp(true, true);
    await app.init();
    app.run();
  });

  afterAll(() => {
    app.destroy();
  });

  it('should return an error about missing fields', async () => {
    let res = await req(ETH_USER_ADDRESS);

    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('Either contract or genesis must be provided, but not both');

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

    await new Promise((resolve) => setTimeout(resolve, 1000));

    faucetRequestData = repos.FaucetRequest._data();
    expect(faucetRequestData[1].status).toBe(RequestStatus.Processing);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    faucetRequestData = repos.FaucetRequest._data();
    expect(faucetRequestData[1].status).toBe(RequestStatus.Completed);

    let userLastSeenData = repos.UserLastSeen._data();
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
    expect(res.text).toBe('Either contract or genesis must be provided, but not both');
  });

  it('should return ok with genesis (bridge testnet)', async () => {
    const res = await req(ALICE, undefined, VARA_GENESIS);

    expect(res.statusCode).toBe(200);

    let faucetRequestData = repos.FaucetRequest._data();

    expect(faucetRequestData).toHaveProperty('2');
    expect(faucetRequestData[2]).toHaveProperty('id', 2);
    expect(faucetRequestData[2]).toHaveProperty('address', ALICE);
    expect(faucetRequestData[2]).toHaveProperty('target', VARA_GENESIS);
    expect(faucetRequestData[2]).toHaveProperty('type', FaucetType.BridgeVaraTestnet);
    expect(faucetRequestData[2]).toHaveProperty('status', RequestStatus.Pending);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    faucetRequestData = repos.FaucetRequest._data();
    expect(faucetRequestData[2].status).toBe(RequestStatus.Processing);

    await new Promise((resolve) => setTimeout(resolve, 3000));
    faucetRequestData = repos.FaucetRequest._data();
    expect(faucetRequestData[2].status).toBe(RequestStatus.Completed);

    let userLastSeenData = repos.UserLastSeen._data();
    expect(userLastSeenData).toHaveProperty(hash(ALICE, VARA_GENESIS));
  });

  it('should return request limit error for genesis request', async () => {
    const addr = new Keyring({ ss58Format: 137 }).encodeAddress(ALICE);
    let res = await req(addr, undefined, VARA_GENESIS);

    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ error: 'The limit for requesting test balance has been reached.' });

    res = await req(ALICE, undefined, VARA_GENESIS);

    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ error: 'The limit for requesting test balance has been reached.' });
  });
});
