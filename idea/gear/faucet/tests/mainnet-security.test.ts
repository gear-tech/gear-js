import { randomUUID } from 'node:crypto';
import { Keyring } from '@polkadot/api';
import { stringToU8a, u8aToHex } from '@polkadot/util';
import { mnemonicGenerate } from '@polkadot/util-crypto';

import config from '../src/config.js';
import { AppDataSource, MainnetClaimStatus } from '../src/database/index.js';
import { type MainnetFaucetError, MainnetFaucetService } from '../src/services/index.js';
import { repos } from './__mocks__/db.js';

const GENESIS = '0x1111111111111111111111111111111111111111111111111111111111111111';

function createKeyPair() {
  const keyring = new Keyring({ ss58Format: 137, type: 'sr25519' });
  return keyring.addFromMnemonic(mnemonicGenerate());
}

describe('Mainnet faucet security validation', () => {
  beforeEach(() => {
    repos.MainnetChallenge.clear();
    repos.MainnetClaim.clear();
    repos.MainnetClaimEvent.clear();
    config.mainnet.genesis = GENESIS;
    config.mainnet.hmacSecret = 'test-hmac-secret';
    config.mainnet.turnstileRequired = false;
    config.mainnet.turnstileSecret = undefined;
    config.mainnet.turnstileHostname = undefined;
    config.mainnet.emergencyPause = false;
    config.mainnet.fullIpLimit24h = 1;
    config.mainnet.subnetLimit24h = 3;
    config.mainnet.globalLimit1h = 10;
    config.mainnet.globalLimit24h = 100;
    config.mainnet.maxPayouts1h = 10;
    config.mainnet.maxPayouts24h = 100;
    config.mainnet.maxAmount24h = 5000;
    config.mainnet.highRiskCountries = [];
    config.mainnet.mediumRiskCountries = [];
    config.mainnet.highRiskAsns = [];
    config.mainnet.mediumRiskAsns = [];
    config.mainnet.rejectMediumRiskWithoutTurnstile = true;
    (AppDataSource.transaction as any).mockImplementation(async (callback: any) => callback(AppDataSource));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  async function signedInput(service: MainnetFaucetService) {
    const pair = createKeyPair();
    const challenge = await service.createChallenge(pair.address);
    const stored = repos.MainnetChallenge._data()[challenge.challengeId];
    return {
      address: pair.address,
      challengeId: challenge.challengeId,
      signature: u8aToHex(pair.sign(stringToU8a(stored.message))),
      turnstileToken: 'token',
      deviceToken: 'device-token',
      idempotencyKey: randomUUID(),
      remoteIp: '203.0.113.10',
    };
  }

  function enableTurnstile() {
    config.mainnet.turnstileRequired = true;
    config.mainnet.turnstileSecret = 'turnstile-secret';
    config.mainnet.turnstileHostname = 'faucet.vara.network';
  }

  function mockTurnstile(input: Record<string, unknown> = {}, status = 200) {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: true,
            hostname: 'faucet.vara.network',
            action: 'mainnet_faucet_claim',
            challenge_ts: new Date().toISOString(),
            ...input,
          }),
          { status },
        ),
      ),
    );
  }

  it.each([
    ['missing genesis', () => (config.mainnet.genesis = undefined), 'missing_mainnet_genesis'],
    ['missing HMAC secret', () => (config.mainnet.hmacSecret = undefined), 'missing_hmac_secret'],
    [
      'missing Turnstile secret',
      () => {
        config.mainnet.turnstileRequired = true;
        config.mainnet.turnstileHostname = 'faucet.vara.network';
      },
      'missing_turnstile_configuration',
    ],
    [
      'missing Turnstile hostname',
      () => {
        config.mainnet.turnstileRequired = true;
        config.mainnet.turnstileSecret = 'secret';
      },
      'missing_turnstile_configuration',
    ],
  ])('fails construction for %s', (_, mutate, internalCode) => {
    mutate();
    expect(() => new MainnetFaucetService()).toThrow(expect.objectContaining({ internalCode }));
  });

  it('accepts a valid scoped Turnstile result', async () => {
    enableTurnstile();
    const service = new MainnetFaucetService();
    const input = await signedInput(service);
    mockTurnstile({ cdata: input.challengeId });

    await expect(service.createClaim(input)).resolves.toMatchObject({ id: input.challengeId, status: 'queued' });
    expect(fetch).toHaveBeenCalledWith(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      expect.objectContaining({ method: 'POST', body: expect.any(URLSearchParams) }),
    );
  });

  it.each([
    ['failed verification', { success: false, 'error-codes': ['timeout-or-duplicate'] }, 'turnstile_failed'],
    ['wrong hostname', { hostname: 'evil.example' }, 'turnstile_hostname_mismatch'],
    ['wrong action', { action: 'other' }, 'turnstile_scope_mismatch'],
    ['wrong cdata', { cdata: 'other' }, 'turnstile_scope_mismatch'],
    ['missing timestamp', { challenge_ts: undefined }, 'turnstile_expired'],
    ['expired timestamp', { challenge_ts: new Date(Date.now() - 600_000).toISOString() }, 'turnstile_expired'],
    ['future timestamp', { challenge_ts: new Date(Date.now() + 120_000).toISOString() }, 'turnstile_expired'],
  ])('rejects a Turnstile result with %s', async (_, result, internalCode) => {
    enableTurnstile();
    const service = new MainnetFaucetService();
    const input = await signedInput(service);
    mockTurnstile({ cdata: input.challengeId, ...result });

    await expect(service.createClaim(input)).rejects.toMatchObject({ publicCode: 'verification_failed', internalCode });
  });

  it('returns verification_unavailable for a Turnstile HTTP error', async () => {
    enableTurnstile();
    const service = new MainnetFaucetService();
    const input = await signedInput(service);
    mockTurnstile({}, 503);

    await expect(service.createClaim(input)).rejects.toMatchObject({
      statusCode: 503,
      internalCode: 'turnstile_http_503',
    });
  });

  it('returns verification_unavailable for a Turnstile network error', async () => {
    enableTurnstile();
    const service = new MainnetFaucetService();
    const input = await signedInput(service);
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));

    await expect(service.createClaim(input)).rejects.toMatchObject({
      statusCode: 503,
      internalCode: 'turnstile_request_failed',
    });
  });

  it('requires a Turnstile token when verification is enabled', async () => {
    enableTurnstile();
    const service = new MainnetFaucetService();
    const input = await signedInput(service);

    await expect(service.createClaim({ ...input, turnstileToken: '' })).rejects.toMatchObject({
      internalCode: 'missing_turnstile_token',
    });
  });

  it('stores normalized trusted risk metadata for low-risk claims', async () => {
    const service = new MainnetFaucetService();
    const input = await signedInput(service);

    await expect(service.createClaim({ ...input, country: 'de', asn: '64500' })).resolves.toMatchObject({
      status: MainnetClaimStatus.Queued,
      country: 'DE',
      asn: 'AS64500',
      isVpn: false,
      isProxy: false,
      isTor: false,
      isDatacenter: false,
    });
  });

  it('drops malformed country and ASN metadata before storage', async () => {
    const service = new MainnetFaucetService();
    const input = await signedInput(service);

    await expect(service.createClaim({ ...input, country: 'europe', asn: 'network' })).resolves.toMatchObject({
      status: MainnetClaimStatus.Queued,
      country: null,
      asn: null,
    });
  });

  it.each([
    ['Tor exit node', { isTor: true }, 'tor'],
    ['datacenter IP', { isDatacenter: true }, 'datacenter'],
    ['configured country', { country: 'KP' }, 'high_risk_country', () => (config.mainnet.highRiskCountries = ['KP'])],
    ['configured ASN', { asn: 'AS64511' }, 'high_risk_asn', () => (config.mainnet.highRiskAsns = ['AS64511'])],
  ])('rejects high-risk enrichment signals from %s', async (_, override, internalReasonCode, setup = () => {}) => {
    setup();
    const service = new MainnetFaucetService();
    const input = await signedInput(service);

    await expect(service.createClaim({ ...input, ...override })).resolves.toMatchObject({
      status: MainnetClaimStatus.Rejected,
      publicReasonCode: 'not_eligible',
      internalReasonCode,
    });
  });

  it.each([
    ['VPN', { isVpn: true }, 'medium_risk_requires_captcha'],
    ['proxy', { isProxy: true }, 'medium_risk_requires_captcha'],
    [
      'configured country',
      { country: 'IR' },
      'medium_risk_requires_captcha',
      () => (config.mainnet.mediumRiskCountries = ['IR']),
    ],
    [
      'configured ASN',
      { asn: '64512' },
      'medium_risk_requires_captcha',
      () => (config.mainnet.mediumRiskAsns = ['AS64512']),
    ],
  ])('temporarily rejects medium-risk %s claims when Turnstile is disabled', async (_, override, internalReasonCode, setup = () => {}) => {
    setup();
    const service = new MainnetFaucetService();
    const input = await signedInput(service);

    await expect(service.createClaim({ ...input, ...override })).resolves.toMatchObject({
      status: MainnetClaimStatus.Rejected,
      publicReasonCode: 'verification_required',
      internalReasonCode,
    });
  });

  it('allows medium-risk claims after a valid Turnstile check', async () => {
    enableTurnstile();
    const service = new MainnetFaucetService();
    const input = await signedInput(service);
    mockTurnstile({ cdata: input.challengeId });

    await expect(service.createClaim({ ...input, isVpn: true })).resolves.toMatchObject({
      status: MainnetClaimStatus.Queued,
      isVpn: true,
    });
  });

  it('can be configured to allow medium-risk claims without Turnstile', async () => {
    config.mainnet.rejectMediumRiskWithoutTurnstile = false;
    const service = new MainnetFaucetService();
    const input = await signedInput(service);

    await expect(service.createClaim({ ...input, isProxy: true })).resolves.toMatchObject({
      status: MainnetClaimStatus.Queued,
      isProxy: true,
    });
  });

  it('fails safely if Turnstile configuration disappears after startup', async () => {
    const service = new MainnetFaucetService();
    const input = await signedInput(service);
    config.mainnet.turnstileRequired = true;
    config.mainnet.turnstileSecret = undefined;

    await expect(service.createClaim(input)).rejects.toMatchObject({ internalCode: 'missing_turnstile_secret' });
  });

  it.each([
    ['missing idempotency key', { idempotencyKey: '' }, 'missing_idempotency_key'],
    ['invalid idempotency key', { idempotencyKey: 'bad' }, 'invalid_request_id'],
    ['invalid challenge id', { challengeId: 'bad' }, 'invalid_request_id'],
    ['short device token', { deviceToken: 'short' }, 'invalid_device_token'],
    ['non-string device token', { deviceToken: 123 }, 'invalid_device_token'],
    ['long device token', { deviceToken: 'x'.repeat(513) }, 'invalid_device_token'],
    ['non-string signature', { signature: 123 }, 'invalid_signature_format'],
    ['long signature', { signature: 'x'.repeat(513) }, 'invalid_signature_format'],
  ])('rejects %s', async (_, override, internalCode) => {
    const service = new MainnetFaucetService();
    const input = await signedInput(service);

    await expect(service.createClaim({ ...input, ...override } as any)).rejects.toMatchObject({
      statusCode: 400,
      internalCode,
    } satisfies Partial<MainnetFaucetError>);
  });

  it('honors emergency pause before validation', async () => {
    const service = new MainnetFaucetService();
    const input = await signedInput(service);
    config.mainnet.emergencyPause = true;

    await expect(service.createClaim(input)).rejects.toMatchObject({
      statusCode: 503,
      internalCode: 'emergency_pause',
    });
  });

  it('rejects oversized and non-string challenge addresses', async () => {
    const service = new MainnetFaucetService();
    await expect(service.createChallenge('x'.repeat(129))).rejects.toMatchObject({ publicCode: 'invalid_address' });
    await expect(service.createChallenge(123 as any)).rejects.toMatchObject({ publicCode: 'invalid_address' });
  });

  it('rejects missing and incorrectly scoped challenges', async () => {
    const service = new MainnetFaucetService();
    const missing = await signedInput(service);
    await expect(service.createClaim({ ...missing, challengeId: randomUUID() })).rejects.toMatchObject({
      publicCode: 'invalid_challenge',
    });

    const wrongWallet = await signedInput(service);
    repos.MainnetChallenge._data()[wrongWallet.challengeId].canonicalWallet = '0xwrong';
    await expect(service.createClaim(wrongWallet)).rejects.toMatchObject({ internalCode: 'challenge_scope_mismatch' });

    const wrongGenesis = await signedInput(service);
    repos.MainnetChallenge._data()[wrongGenesis.challengeId].genesis = '0xwrong';
    await expect(service.createClaim(wrongGenesis)).rejects.toMatchObject({ internalCode: 'challenge_scope_mismatch' });
  });

  it('returns the concurrent claim after challenge lock contention', async () => {
    const service = new MainnetFaucetService();
    const input = await signedInput(service);
    repos.MainnetChallenge._data()[input.challengeId].used = true;
    const concurrent = {
      id: input.challengeId,
      challengeId: input.challengeId,
      idempotencyKey: input.idempotencyKey,
      canonicalWallet: repos.MainnetChallenge._data()[input.challengeId].canonicalWallet,
      status: MainnetClaimStatus.Queued,
    };
    (repos.MainnetClaim.findOne as any).mockResolvedValueOnce(undefined).mockResolvedValueOnce(concurrent);

    await expect(service.createClaim(input)).resolves.toBe(concurrent);
  });

  it('rejects an idempotency conflict discovered after challenge lock contention', async () => {
    const service = new MainnetFaucetService();
    const input = await signedInput(service);
    repos.MainnetChallenge._data()[input.challengeId].used = true;
    (repos.MainnetClaim.findOne as any)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({ challengeId: randomUUID(), canonicalWallet: '0xother' });

    await expect(service.createClaim(input)).rejects.toMatchObject({
      statusCode: 409,
      publicCode: 'idempotency_conflict',
    });
  });

  it.each([
    [
      'wallet constraint',
      { code: '23505', constraint: 'IDX_mainnet_claim_wallet' },
      'wallet_limit_reached',
      'wallet_already_claimed',
    ],
    [
      'challenge constraint',
      { code: '23505', constraint: 'IDX_mainnet_claim_challenge' },
      'not_eligible',
      'challenge_already_used',
    ],
    [
      'idempotency constraint',
      { driverError: { code: '23505', constraint: 'IDX_mainnet_claim_idempotency' } },
      'idempotency_conflict',
      'idempotency_conflict',
    ],
    ['unknown constraint', { code: '23505', constraint: 'other' }, 'not_eligible', 'duplicate_claim'],
    ['missing constraint metadata', { driverError: { code: '23505' } }, 'not_eligible', 'duplicate_claim'],
  ])('maps %s unique violations', async (_, databaseError, publicCode, internalCode) => {
    const service = new MainnetFaucetService();
    const input = await signedInput(service);
    (AppDataSource.transaction as any).mockRejectedValueOnce(databaseError);

    await expect(service.createClaim(input)).rejects.toMatchObject({ statusCode: 409, publicCode, internalCode });
  });

  it('returns the winning claim after a concurrent idempotency insert', async () => {
    const service = new MainnetFaucetService();
    const input = await signedInput(service);
    const raced = {
      id: input.challengeId,
      challengeId: input.challengeId,
      idempotencyKey: input.idempotencyKey,
      canonicalWallet: repos.MainnetChallenge._data()[input.challengeId].canonicalWallet,
    };
    (repos.MainnetClaim.findOne as any).mockResolvedValueOnce(undefined).mockResolvedValueOnce(raced);
    (AppDataSource.transaction as any).mockRejectedValueOnce({ code: '23505' });

    await expect(service.createClaim(input)).resolves.toBe(raced);
  });

  it('rethrows non-unique database failures', async () => {
    const service = new MainnetFaucetService();
    const input = await signedInput(service);
    const failure = new Error('database unavailable');
    (AppDataSource.transaction as any).mockRejectedValueOnce(failure);

    await expect(service.createClaim(input)).rejects.toBe(failure);
  });

  it.each([
    ['Tor traffic', { isTor: true }, 'tor'],
    ['datacenter traffic', { isDatacenter: true }, 'datacenter'],
  ])('rejects high-risk %s', async (_, signal, reason) => {
    const service = new MainnetFaucetService();
    const input = await signedInput(service);

    await expect(service.createClaim({ ...input, ...signal })).resolves.toMatchObject({
      status: MainnetClaimStatus.Rejected,
      internalReasonCode: reason,
    });
  });

  it('enforces the global daily count limit', async () => {
    config.mainnet.globalLimit1h = 1000;
    config.mainnet.maxPayouts1h = 1000;
    config.mainnet.globalLimit24h = 0;
    const service = new MainnetFaucetService();
    const input = await signedInput(service);

    await expect(service.createClaim(input)).resolves.toMatchObject({ internalReasonCode: 'global_day_limit' });
  });

  it('enforces the global daily amount limit', async () => {
    config.mainnet.globalLimit1h = 1000;
    config.mainnet.maxPayouts1h = 1000;
    config.mainnet.globalLimit24h = 1000;
    config.mainnet.maxPayouts24h = 1000;
    config.mainnet.maxAmount24h = 0;
    const service = new MainnetFaucetService();
    const input = await signedInput(service);

    await expect(service.createClaim(input)).resolves.toMatchObject({ internalReasonCode: 'daily_amount_limit' });
  });

  it('stores optional risk enrichment without exposing it publicly', async () => {
    const service = new MainnetFaucetService();
    const input = await signedInput(service);

    await expect(
      service.createClaim({ ...input, country: 'DE', asn: 'AS64500', isVpn: true, isProxy: true }),
    ).resolves.toMatchObject({ country: 'DE', asn: 'AS64500', isVpn: true, isProxy: true });
  });

  it('rejects malformed signatures that cannot be decoded', async () => {
    const service = new MainnetFaucetService();
    const input = await signedInput(service);

    await expect(service.createClaim({ ...input, signature: 'malformed' })).rejects.toMatchObject({
      publicCode: 'invalid_signature',
    });
  });

  it('rejects non-IP numeric host syntax', async () => {
    const service = new MainnetFaucetService();
    const input = await signedInput(service);

    await expect(service.createClaim({ ...input, remoteIp: '2130706433' })).rejects.toMatchObject({
      internalCode: 'invalid_remote_ip',
    });
  });

  it('normalizes an IPv6 address without compressed groups', async () => {
    const service = new MainnetFaucetService();
    const input = await signedInput(service);

    await expect(service.createClaim({ ...input, remoteIp: '2001:db8:1:2:3:4:5:6' })).resolves.toMatchObject({
      status: MainnetClaimStatus.Queued,
    });
  });

  it('uses zero when the aggregate amount query has no row', async () => {
    const service = new MainnetFaucetService();
    const input = await signedInput(service);
    const builder = repos.MainnetClaim.createQueryBuilder();
    builder.getRawOne.mockResolvedValueOnce(undefined);
    repos.MainnetClaim.createQueryBuilder.mockReturnValueOnce(builder);

    await expect(service.createClaim(input)).resolves.toMatchObject({ status: MainnetClaimStatus.Queued });
  });
});
