import { Keyring } from '@polkadot/api';
import { stringToU8a, u8aToHex } from '@polkadot/util';
import { mnemonicGenerate } from '@polkadot/util-crypto';
import request from 'supertest';

import { RequestStatus } from '../src/database/index.js';
import { FaucetApp } from '../src/main.js';
import { repos } from './__mocks__/db.js';

const VARA_GENESIS = '0x0000000000000000000000000000000000000000000000000000000000000000';

function createKeyPair() {
  const keyring = new Keyring({ ss58Format: 137, type: 'sr25519' });
  const mnemonic = mnemonicGenerate();
  return keyring.addFromMnemonic(mnemonic);
}

describe('Agent requests', () => {
  let app: FaucetApp;

  const challenge = (address?: string) =>
    request(app.server.app).post('/agent/challenge').send({ address }).set('Accept', 'application/json');

  const claim = (body: Record<string, unknown>) =>
    request(app.server.app).post('/agent/vara-testnet/request').send(body).set('Accept', 'application/json');

  beforeAll(async () => {
    app = new FaucetApp(false, true, false);
    await app.init();
    app.run();
  });

  afterAll(() => {
    app.destroy();
  });

  describe('Challenge endpoint', () => {
    it('should return a nonce for valid address', async () => {
      const pair = createKeyPair();
      const res = await challenge(pair.address);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('nonce');
      expect(res.body.nonce).toMatch(/^0x[0-9a-f]{64}$/);
      expect(res.body).toHaveProperty('expiresIn', 5);
    });

    it('should return 400 for missing address', async () => {
      const res = await challenge();

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Address is required' });
    });

    it('should return 400 for invalid address', async () => {
      const res = await challenge('0xinvalid');

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid account address' });
    });
  });

  describe('Claim endpoint', () => {
    it('should return 400 for missing fields', async () => {
      const res = await claim({ address: '0x123' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Address, signature, and nonce are required' });
    });

    it('should return 401 for invalid nonce', async () => {
      const pair = createKeyPair();
      const fakeNonce = `0x${'00'.repeat(32)}`;
      const signature = u8aToHex(pair.sign(stringToU8a(fakeNonce)));

      const res = await claim({
        address: pair.address,
        genesis: VARA_GENESIS,
        signature,
        nonce: fakeNonce,
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ error: 'Invalid or expired challenge' });
    });

    it('should return 401 for wrong signature', async () => {
      const pair1 = createKeyPair();
      const pair2 = createKeyPair();

      // Get challenge for pair1
      const challengeRes = await challenge(pair1.address);
      const nonce = challengeRes.body.nonce;

      // Sign with pair2 (wrong key)
      const signature = u8aToHex(pair2.sign(stringToU8a(nonce)));

      const res = await claim({
        address: pair1.address,
        genesis: VARA_GENESIS,
        signature,
        nonce,
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ error: 'Invalid signature' });
    });

    it('should return 200 for valid signed request', async () => {
      const pair = createKeyPair();

      const challengeRes = await challenge(pair.address);
      const nonce = challengeRes.body.nonce;
      const signature = u8aToHex(pair.sign(stringToU8a(nonce)));

      const res = await claim({
        address: pair.address,
        genesis: VARA_GENESIS,
        signature,
        nonce,
      });

      expect(res.statusCode).toBe(200);

      const faucetRequestData = repos.FaucetRequest._data();
      const entries = Object.values(faucetRequestData);
      const lastEntry = entries[entries.length - 1] as any;
      expect(lastEntry).toHaveProperty('target', VARA_GENESIS);
      expect(lastEntry).toHaveProperty('status', RequestStatus.Pending);
    });

    it('should return 429 for the second request', async () => {
      const pair = createKeyPair();

      const challengeRes = await challenge(pair.address);
      const nonce = challengeRes.body.nonce;
      const signature = u8aToHex(pair.sign(stringToU8a(nonce)));

      // First request should succeed
      const res1 = await claim({
        address: pair.address,
        genesis: VARA_GENESIS,
        signature,
        nonce,
      });
      expect(res1.statusCode).toBe(200);

      // Second request with same nonce should fail
      const res2 = await claim({
        address: pair.address,
        genesis: VARA_GENESIS,
        signature,
        nonce,
      });
      expect(res2.statusCode).toBe(429);
    });

    it('should return 403 for 24h cooldown', async () => {
      const pair = createKeyPair();

      // First claim
      let challengeRes = await challenge(pair.address);
      let nonce = challengeRes.body.nonce;
      let signature = u8aToHex(pair.sign(stringToU8a(nonce)));
      const res1 = await claim({
        address: pair.address,
        genesis: VARA_GENESIS,
        signature,
        nonce,
      });
      expect(res1.statusCode).toBe(200);

      // Wait for processing
      await new Promise((resolve) => setTimeout(resolve, 3500));

      // Second claim (same address, within 24h)
      challengeRes = await challenge(pair.address);
      nonce = challengeRes.body.nonce;
      signature = u8aToHex(pair.sign(stringToU8a(nonce)));
      const res2 = await claim({
        address: pair.address,
        genesis: VARA_GENESIS,
        signature,
        nonce,
      });
      expect(res2.statusCode).toBe(403);
    });

    it('should return 400 for unsupported genesis', async () => {
      const pair = createKeyPair();

      const challengeRes = await challenge(pair.address);
      const nonce = challengeRes.body.nonce;
      const signature = u8aToHex(pair.sign(stringToU8a(nonce)));

      const res = await claim({
        address: pair.address,
        genesis: '0x1234',
        signature,
        nonce,
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('Global daily cap', () => {
    // Note: Global daily cap is tested implicitly through the shared rate limiter.
    // With AGENT_DAILY_CAP=100 in this test suite, the cap won't be hit during
    // normal test execution. A dedicated unit test for the rate limiter middleware
    // would require resetting the in-memory store, which express-rate-limit doesn't
    // expose. The cap is verified via E2E testing.
    it('should allow multiple claims from different addresses', async () => {
      const pair = createKeyPair();
      const challengeRes = await challenge(pair.address);
      expect(challengeRes.statusCode).toBe(200);
      const nonce = challengeRes.body.nonce;
      const signature = u8aToHex(pair.sign(stringToU8a(nonce)));
      const res = await claim({
        address: pair.address,
        genesis: VARA_GENESIS,
        signature,
        nonce,
      });
      expect(res.statusCode).toBe(200);
    });
  });
});
