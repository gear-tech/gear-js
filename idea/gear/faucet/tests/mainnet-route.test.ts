import { randomUUID } from 'node:crypto';
import express from 'express';
import { Keyring } from '@polkadot/api';
import { stringToU8a, u8aToHex } from '@polkadot/util';
import { mnemonicGenerate } from '@polkadot/util-crypto';
import request from 'supertest';

import config from '../src/config.js';
import { MainnetClaimStatus } from '../src/database/index.js';
import { MainnetRouter } from '../src/routes/index.js';
import { MainnetFaucetService, resetMainnetMetricsForTests } from '../src/services/index.js';
import { repos } from './__mocks__/db.js';

function createKeyPair() {
  const keyring = new Keyring({ ss58Format: 137, type: 'sr25519' });
  const mnemonic = mnemonicGenerate();
  return keyring.addFromMnemonic(mnemonic);
}

function resetMainnetRepos() {
  repos.MainnetChallenge.clear();
  repos.MainnetClaim.clear();
  repos.MainnetClaimEvent.clear();
}

describe('Mainnet faucet router', () => {
  let service: MainnetFaucetService;
  let app: express.Express;

  beforeEach(() => {
    resetMainnetRepos();
    resetMainnetMetricsForTests();
    config.mainnet.adminApiKey = 'test-admin-key';
    config.mainnet.requireCloudflare = false;
    service = new MainnetFaucetService();
    app = express();
    app.use('/api/v1/mainnet', new MainnetRouter(service).router);
  });

  it('rejects requests that bypass the configured Cloudflare origin', async () => {
    config.mainnet.requireCloudflare = true;
    const res = await request(app).post('/api/v1/mainnet/challenge').send({ address: createKeyPair().address });

    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ error: 'untrusted_origin' });
  });

  it('uses trusted Cloudflare request metadata for claim evaluation', async () => {
    const fakeService = {
      createClaim: vi.fn().mockResolvedValue({ id: randomUUID(), status: MainnetClaimStatus.Queued, publicReasonCode: null }),
      createChallenge: vi.fn(),
      getClaim: vi.fn(),
    } as unknown as MainnetFaucetService;
    const metadataApp = express().use('/api/v1/mainnet', new MainnetRouter(fakeService).router);

    const res = await request(metadataApp)
      .post('/api/v1/mainnet/claims')
      .set('Idempotency-Key', randomUUID())
      .set('cf-connecting-ip', '203.0.113.8')
      .set('cf-ipcountry', 'DE')
      .set('cf-asn', 'AS64500')
      .set('x-vara-risk-vpn', 'true')
      .set('x-vara-risk-proxy', '1')
      .set('x-vara-risk-tor', 'yes')
      .set('x-vara-risk-datacenter', 'false')
      .send({
        address: createKeyPair().address,
        challengeId: randomUUID(),
        signature: '0xsig',
        turnstileToken: 'token',
        deviceToken: 'device-token',
      });

    expect(res.statusCode).toBe(200);
    expect(fakeService.createClaim).toHaveBeenCalledWith(
      expect.objectContaining({
        remoteIp: '203.0.113.8',
        country: 'DE',
        asn: 'AS64500',
        isVpn: true,
        isProxy: true,
        isTor: true,
        isDatacenter: false,
      }),
    );
  });

  it('ignores untrusted risk metadata submitted in the request body', async () => {
    const fakeService = {
      createClaim: vi.fn().mockResolvedValue({ id: randomUUID(), status: MainnetClaimStatus.Queued, publicReasonCode: null }),
      createChallenge: vi.fn(),
      getClaim: vi.fn(),
    } as unknown as MainnetFaucetService;
    const metadataApp = express().use('/api/v1/mainnet', new MainnetRouter(fakeService).router);

    const res = await request(metadataApp)
      .post('/api/v1/mainnet/claims')
      .set('Idempotency-Key', randomUUID())
      .send({
        address: createKeyPair().address,
        challengeId: randomUUID(),
        signature: '0xsig',
        turnstileToken: 'token',
        deviceToken: 'device-token',
        isTor: true,
        isDatacenter: true,
      });

    expect(res.statusCode).toBe(200);
    expect(fakeService.createClaim).toHaveBeenCalledWith(
      expect.objectContaining({
        isVpn: false,
        isProxy: false,
        isTor: false,
        isDatacenter: false,
      }),
    );
  });

  it('returns a public reason for rejected claims', async () => {
    const claimId = randomUUID();
    const fakeService = {
      createClaim: vi.fn().mockResolvedValue({ id: claimId, status: MainnetClaimStatus.Rejected, publicReasonCode: 'wallet_limit_reached' }),
      createChallenge: vi.fn(),
      getClaim: vi.fn().mockResolvedValue({
        status: MainnetClaimStatus.Rejected,
        amount: '50000000000000',
        transactionHash: null,
        blockHash: null,
        publicReasonCode: 'wallet_limit_reached',
      }),
    } as unknown as MainnetFaucetService;
    const rejectedApp = express().use('/api/v1/mainnet', new MainnetRouter(fakeService).router);
    const body = {
      address: createKeyPair().address,
      challengeId: randomUUID(),
      signature: '0xsig',
      turnstileToken: 'token',
      deviceToken: 'device-token',
    };

    const created = await request(rejectedApp).post('/api/v1/mainnet/claims').set('Idempotency-Key', randomUUID()).send(body);
    const status = await request(rejectedApp).get(`/api/v1/mainnet/claims/${claimId}`);

    expect(created.statusCode).toBe(202);
    expect(created.body.reasonCode).toBe('wallet_limit_reached');
    expect(status.body.reasonCode).toBe('wallet_limit_reached');
  });

  it('hides admin metrics when the admin key is not configured', async () => {
    config.mainnet.adminApiKey = undefined;

    const res = await request(app).get('/api/v1/mainnet/admin/metrics').set('x-admin-key', 'test-admin-key');

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'not_found' });
  });

  it('rejects admin metrics requests with an invalid key', async () => {
    const res = await request(app).get('/api/v1/mainnet/admin/metrics').set('x-admin-key', 'wrong');

    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ error: 'forbidden' });
  });

  it('returns admin metrics with a valid key', async () => {
    const fakeMetrics = { snapshot: vi.fn().mockResolvedValue({ claims: { payoutQueueSize: 1 } }) };
    const metricsApp = express().use('/api/v1/mainnet', new MainnetRouter(service, fakeMetrics as any).router);

    const res = await request(metricsApp).get('/api/v1/mainnet/admin/metrics').set('x-admin-key', 'test-admin-key');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ claims: { payoutQueueSize: 1 } });
    expect(fakeMetrics.snapshot).toHaveBeenCalled();
  });

  it('returns reconciliation claims with a valid admin key', async () => {
    const fakeAdmin = {
      listReconciliation: vi.fn().mockResolvedValue([{ claimId: 'claim-1', status: MainnetClaimStatus.ReconciliationRequired }]),
      resolveReconciliation: vi.fn(),
    };
    const reconciliationApp = express().use('/api/v1/mainnet', new MainnetRouter(service, undefined as any, fakeAdmin as any).router);

    const res = await request(reconciliationApp).get('/api/v1/mainnet/admin/reconciliation').set('x-admin-key', 'test-admin-key');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ claims: [{ claimId: 'claim-1', status: MainnetClaimStatus.ReconciliationRequired }] });
    expect(fakeAdmin.listReconciliation).toHaveBeenCalled();
  });

  it('resolves a reconciliation claim with operator metadata from headers', async () => {
    const fakeAdmin = {
      listReconciliation: vi.fn(),
      resolveReconciliation: vi.fn().mockResolvedValue({ claimId: 'claim-1', status: MainnetClaimStatus.Finalized }),
    };
    const reconciliationApp = express().use('/api/v1/mainnet', new MainnetRouter(service, undefined as any, fakeAdmin as any).router);

    const res = await request(reconciliationApp)
      .post('/api/v1/mainnet/admin/reconciliation/claim-1')
      .set('x-admin-key', 'test-admin-key')
      .set('x-admin-actor', 'timur')
      .send({
        action: 'mark_finalized',
        transactionHash: '0xTX',
        blockHash: '0xBLOCK',
        reasonCode: 'ignored',
        note: 'checked',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ claim: { claimId: 'claim-1', status: MainnetClaimStatus.Finalized } });
    expect(fakeAdmin.resolveReconciliation).toHaveBeenCalledWith({
      claimId: 'claim-1',
      action: 'mark_finalized',
      transactionHash: '0xTX',
      blockHash: '0xBLOCK',
      reasonCode: 'ignored',
      note: 'checked',
      operator: 'timur',
    });
  });

  it('protects reconciliation endpoints with the admin key', async () => {
    const listRes = await request(app).get('/api/v1/mainnet/admin/reconciliation').set('x-admin-key', 'wrong');
    const resolveRes = await request(app)
      .post('/api/v1/mainnet/admin/reconciliation/claim-1')
      .set('x-admin-key', 'wrong')
      .send({ action: 'requeue' });

    expect(listRes.statusCode).toBe(403);
    expect(resolveRes.statusCode).toBe(403);
  });

  it.each([
    ['challenge', 'post', '/api/v1/mainnet/challenge', { address: createKeyPair().address }],
    [
      'claim',
      'post',
      '/api/v1/mainnet/claims',
      { address: createKeyPair().address, challengeId: randomUUID(), signature: '0xsig', turnstileToken: 'token', deviceToken: 'device-token' },
    ],
    ['status', 'get', `/api/v1/mainnet/claims/${randomUUID()}`, undefined],
  ])('maps unexpected %s errors to internal_error', async (operation, method, path, body) => {
    const fakeService = {
      createChallenge: vi.fn().mockRejectedValue(new Error('boom')),
      createClaim: vi.fn().mockRejectedValue(new Error('boom')),
      getClaim: vi.fn().mockRejectedValue(new Error('boom')),
    } as unknown as MainnetFaucetService;
    const errorApp = express().use('/api/v1/mainnet', new MainnetRouter(fakeService).router);
    const pending = (request(errorApp) as any)[method](path).set('Idempotency-Key', randomUUID());
    const res = body ? await pending.send(body) : await pending;

    expect(res.statusCode, operation).toBe(500);
    expect(res.body).toEqual({ error: 'internal_error' });
  });

  it('rate limits excessive challenge requests', async () => {
    const fakeService = {
      createChallenge: vi.fn().mockResolvedValue({ challengeId: randomUUID(), messageHex: '0x00', expiresAt: new Date() }),
      createClaim: vi.fn(),
      getClaim: vi.fn(),
    } as unknown as MainnetFaucetService;
    const rateLimitApp = express().use('/api/v1/mainnet', new MainnetRouter(fakeService).router);
    let response: any;
    for (let index = 0; index <= config.mainnet.challengeRateLimit; index++) {
      response = await request(rateLimitApp)
        .post('/api/v1/mainnet/challenge')
        .set('cf-connecting-ip', '198.51.100.200')
        .send({ address: createKeyPair().address });
    }

    expect(response!.statusCode).toBe(429);
    expect(response!.body).toEqual({ error: 'rate_limited' });
  });

  it('returns 400 when challenge address is missing', async () => {
    const res = await request(app).post('/api/v1/mainnet/challenge').send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Address is required' });
  });

  it('returns 400 when claim fields are missing', async () => {
    const res = await request(app).post('/api/v1/mainnet/claims').send({ address: 'missing' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: 'Address, challengeId, signature, turnstileToken, and deviceToken are required',
    });
  });

  it('returns 404 for unknown claim status', async () => {
    const res = await request(app).get(`/api/v1/mainnet/claims/${randomUUID()}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'Claim not found' });
  });

  it('creates a claim through the public HTTP API', async () => {
    const pair = createKeyPair();
    const challengeRes = await request(app).post('/api/v1/mainnet/challenge').send({ address: pair.address });
    const storedChallenge = repos.MainnetChallenge._data()[challengeRes.body.challengeId];
    const signature = u8aToHex(pair.sign(stringToU8a(storedChallenge.message)));

    const claimRes = await request(app)
      .post('/api/v1/mainnet/claims')
      .set('Idempotency-Key', randomUUID())
      .send({
        address: pair.address,
        challengeId: challengeRes.body.challengeId,
        signature,
        turnstileToken: 'test-token',
        deviceToken: 'device-a',
      });

    expect(claimRes.statusCode).toBe(200);
    expect(claimRes.body).toMatchObject({ status: 'queued' });

    const statusRes = await request(app).get(`/api/v1/mainnet/claims/${claimRes.body.claimId}`);
    expect(statusRes.statusCode).toBe(200);
    expect(statusRes.body).toMatchObject({
      status: 'queued',
      amount: '50000000000000',
      transactionHash: null,
      blockHash: null,
    });
  });
});
