import './__mocks__/gear-js';
import './__mocks__/typeorm';

import request from 'supertest';
import { FaucetApp } from '../src/main';
import { repos } from './__mocks__/db';
import { RequestStatus } from '../src/database';
import { hash } from '../src/services/db/last-seen';
import { Keyring } from '@polkadot/api';
import { decodeAddress } from '@gear-js/api';

const ALICE = '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d';
const BOB = 'kGim5ByTuPokQf21odiQskRXcVEwaunk5PwC4dmGz8M6zuwkq';
const VARA_GENESIS = '0x0000000000000000000000000000000000000000000000000000000000000000';

describe('Testnet requests', () => {
  let app: FaucetApp;
  const req = (address?: string, genesis?: string) =>
    request(app.server.app)
      .post('/balance')
      .send({ token: '1234', payload: { address, genesis } })
      .set('Accept', 'application/json');

  beforeAll(async () => {
    app = new FaucetApp(false, true);
    await app.init();
    app.run();
  });

  afterAll(() => {
    app.destroy();
  });

  it('should return an error about missing fields', async () => {
    let res = await req(ALICE);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Address and genesis are required' });

    res = await req(undefined, VARA_GENESIS);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Address and genesis are required' });
  });

  it('should return UnsupportedTarget error', async () => {
    const res = await req(ALICE, '0x1234');

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: '0x1234 is not supported' });
  });

  it('should return InvalidAddress error', async () => {
    const res = await req('0x1234', VARA_GENESIS);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid account address' });
  });

  it('should return ok (Alice)', async () => {
    const res = await req(ALICE, VARA_GENESIS);

    expect(res.statusCode).toBe(200);

    let faucetRequestData = repos.FaucetRequest._data();

    expect(faucetRequestData).toHaveProperty('1');
    expect(faucetRequestData[1]).toHaveProperty('id', 1);
    expect(faucetRequestData[1]).toHaveProperty('address', ALICE);
    expect(faucetRequestData[1]).toHaveProperty('target', VARA_GENESIS);
    expect(faucetRequestData[1]).toHaveProperty('status', RequestStatus.Pending);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    faucetRequestData = repos.FaucetRequest._data();
    expect(faucetRequestData[1].status).toBe(RequestStatus.Processing);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    faucetRequestData = repos.FaucetRequest._data();
    expect(faucetRequestData[1].status).toBe(RequestStatus.Completed);

    let userLastSeenData = repos.UserLastSeen._data();
    expect(userLastSeenData).toHaveProperty(hash(ALICE, VARA_GENESIS));
  });

  it('should return request limit error (Alice)', async () => {
    const addr = new Keyring({ ss58Format: 137 }).encodeAddress(ALICE);
    let res = await req(addr, VARA_GENESIS);

    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ error: 'The limit for requesting test balance has been reached.' });

    res = await req(ALICE, VARA_GENESIS);

    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ error: 'The limit for requesting test balance has been reached.' });
  });

  it('should return ok (Bob)', async () => {
    const res = await req(BOB, VARA_GENESIS);

    expect(res.statusCode).toBe(200);

    let faucetRequestData = repos.FaucetRequest._data();

    expect(faucetRequestData).toHaveProperty('1');
    expect(faucetRequestData[2]).toHaveProperty('id', 2);
    expect(faucetRequestData[2]).toHaveProperty('address', decodeAddress(BOB));
    expect(faucetRequestData[2]).toHaveProperty('target', VARA_GENESIS);
    expect(faucetRequestData[2]).toHaveProperty('status', RequestStatus.Pending);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    faucetRequestData = repos.FaucetRequest._data();
    expect(faucetRequestData[2].status).toBe(RequestStatus.Processing);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    faucetRequestData = repos.FaucetRequest._data();
    expect(faucetRequestData[2].status).toBe(RequestStatus.Completed);

    let userLastSeenData = repos.UserLastSeen._data();
    expect(userLastSeenData).toHaveProperty(hash(decodeAddress(BOB), VARA_GENESIS));
  });

  it('should return request limit error (Bob)', async () => {
    const addr = decodeAddress(BOB);
    let res = await req(addr, VARA_GENESIS);

    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ error: 'The limit for requesting test balance has been reached.' });

    res = await req(BOB, VARA_GENESIS);

    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ error: 'The limit for requesting test balance has been reached.' });
  });
});
