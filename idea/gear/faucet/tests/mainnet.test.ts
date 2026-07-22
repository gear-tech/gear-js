import { randomUUID } from 'node:crypto';
import { Keyring } from '@polkadot/api';
import { stringToU8a, u8aToHex } from '@polkadot/util';
import { mnemonicGenerate } from '@polkadot/util-crypto';

import config from '../src/config.js';
import { MainnetClaimStatus } from '../src/database/index.js';
import { type MainnetFaucetError, MainnetFaucetService } from '../src/services/index.js';
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

describe('Mainnet faucet service', () => {
  let service: MainnetFaucetService;

  beforeEach(() => {
    resetMainnetRepos();
    config.mainnet.fullIpLimit24h = 1;
    config.mainnet.subnetLimit24h = 3;
    config.mainnet.globalLimit1h = 10;
    config.mainnet.globalLimit24h = 100;
    config.mainnet.maxPayouts1h = 10;
    config.mainnet.maxPayouts24h = 100;
    config.mainnet.maxAmount24h = 5000;
    service = new MainnetFaucetService();
  });

  async function createSignedClaimInput(pair = createKeyPair(), overrides: Record<string, unknown> = {}) {
    const challenge = await service.createChallenge(pair.address);
    const storedChallenge = repos.MainnetChallenge._data()[challenge.challengeId];
    const signature = u8aToHex(pair.sign(stringToU8a(storedChallenge.message)));

    return {
      address: pair.address,
      challengeId: challenge.challengeId,
      signature,
      turnstileToken: 'test-token',
      deviceToken: 'device-a',
      idempotencyKey: randomUUID(),
      remoteIp: '192.168.1.10',
      ...overrides,
    };
  }

  it('creates a queued claim for a valid signed challenge', async () => {
    const input = await createSignedClaimInput();

    const claim = await service.createClaim(input);

    expect(claim.status).toBe(MainnetClaimStatus.Queued);
    expect(claim.amount).toBe('50000000000000');
    expect(claim.transactionHash).toBeNull();
    expect(claim.id).toBe(input.challengeId);
    expect(Object.values(repos.MainnetClaimEvent._data())).toEqual([
      expect.objectContaining({ claimId: claim.id, fromStatus: null, toStatus: MainnetClaimStatus.Queued }),
    ]);

    const challenge = repos.MainnetChallenge._data()[input.challengeId];
    expect(challenge.used).toBe(true);
    expect(challenge.usedAt).toBeInstanceOf(Date);
  });

  it('returns the same claim for repeated idempotency key', async () => {
    const input = await createSignedClaimInput();

    const first = await service.createClaim(input);
    const second = await service.createClaim(input);

    expect(second.id).toBe(first.id);
    expect(Object.values(repos.MainnetClaim._data())).toHaveLength(1);
  });

  it('rejects an idempotency key reused with another challenge', async () => {
    const first = await createSignedClaimInput();
    const second = await createSignedClaimInput(createKeyPair(), { idempotencyKey: first.idempotencyKey });
    await service.createClaim(first);

    await expect(service.createClaim(second)).rejects.toMatchObject({
      statusCode: 409,
      publicCode: 'idempotency_conflict',
    } satisfies Partial<MainnetFaucetError>);
  });

  it('rejects replayed wallet signatures after challenge consumption', async () => {
    const input = await createSignedClaimInput();

    await service.createClaim(input);

    await expect(service.createClaim({ ...input, idempotencyKey: randomUUID() })).rejects.toMatchObject({
      statusCode: 401,
      publicCode: 'invalid_challenge',
    } satisfies Partial<MainnetFaucetError>);
  });

  it('rejects a second wallet claim even when the address is submitted again', async () => {
    const pair = createKeyPair();
    const first = await createSignedClaimInput(pair, { deviceToken: 'device-a', remoteIp: '192.168.1.10' });
    const second = await createSignedClaimInput(pair, { deviceToken: 'device-b', remoteIp: '192.168.2.10' });

    await service.createClaim(first);
    const rejected = await service.createClaim(second);

    expect(rejected.status).toBe(MainnetClaimStatus.Rejected);
    expect(rejected.publicReasonCode).toBe('wallet_limit_reached');
    expect(rejected.internalReasonCode).toBe('wallet_already_claimed');
  });

  it('rejects a second claim from the same device', async () => {
    const first = await createSignedClaimInput(createKeyPair(), {
      deviceToken: 'same-device',
      remoteIp: '192.168.1.10',
    });
    const second = await createSignedClaimInput(createKeyPair(), {
      deviceToken: 'same-device',
      remoteIp: '192.168.2.10',
    });

    await service.createClaim(first);
    const rejected = await service.createClaim(second);

    expect(rejected.status).toBe(MainnetClaimStatus.Rejected);
    expect(rejected.publicReasonCode).toBe('device_limit_reached');
    expect(rejected.internalReasonCode).toBe('device_already_claimed');
  });

  it('rejects a second claim from the same full IP in 24 hours', async () => {
    const first = await createSignedClaimInput(createKeyPair(), { deviceToken: 'device-a', remoteIp: '192.168.1.10' });
    const second = await createSignedClaimInput(createKeyPair(), { deviceToken: 'device-b', remoteIp: '192.168.1.10' });

    await service.createClaim(first);
    const rejected = await service.createClaim(second);

    expect(rejected.status).toBe(MainnetClaimStatus.Rejected);
    expect(rejected.publicReasonCode).toBe('network_limit_reached');
    expect(rejected.internalReasonCode).toBe('full_ip_limit');
  });

  it('normalizes equivalent IPv6 representations before applying limits', async () => {
    const first = await createSignedClaimInput(createKeyPair(), { deviceToken: 'device-a', remoteIp: '2001:db8::1' });
    const second = await createSignedClaimInput(createKeyPair(), {
      deviceToken: 'device-b',
      remoteIp: '2001:0db8:0000:0000:0000:0000:0000:0001',
    });

    await service.createClaim(first);
    const rejected = await service.createClaim(second);

    expect(rejected.status).toBe(MainnetClaimStatus.Rejected);
    expect(rejected.internalReasonCode).toBe('full_ip_limit');
  });

  it('rejects an invalid client IP', async () => {
    const input = await createSignedClaimInput(createKeyPair(), { remoteIp: '999.1.1.1' });

    await expect(service.createClaim(input)).rejects.toMatchObject({
      statusCode: 400,
      internalCode: 'invalid_remote_ip',
    } satisfies Partial<MainnetFaucetError>);
  });

  it('rejects invalid addresses at challenge creation', async () => {
    await expect(service.createChallenge('0xnot-an-address')).rejects.toMatchObject({
      statusCode: 400,
      publicCode: 'invalid_address',
    } satisfies Partial<MainnetFaucetError>);
  });

  it('rejects signatures from a different wallet', async () => {
    const pair = createKeyPair();
    const otherPair = createKeyPair();
    const challenge = await service.createChallenge(pair.address);
    const storedChallenge = repos.MainnetChallenge._data()[challenge.challengeId];
    const signature = u8aToHex(otherPair.sign(stringToU8a(storedChallenge.message)));

    await expect(
      service.createClaim({
        address: pair.address,
        challengeId: challenge.challengeId,
        signature,
        turnstileToken: 'test-token',
        deviceToken: 'device-a',
        idempotencyKey: randomUUID(),
        remoteIp: '192.168.1.10',
      }),
    ).rejects.toMatchObject({
      statusCode: 401,
      publicCode: 'invalid_signature',
    } satisfies Partial<MainnetFaucetError>);
  });

  it('rejects expired challenges', async () => {
    const input = await createSignedClaimInput();
    repos.MainnetChallenge._data()[input.challengeId].expiresAt = new Date(Date.now() - 1);

    await expect(service.createClaim(input)).rejects.toMatchObject({
      statusCode: 401,
      publicCode: 'invalid_challenge',
    } satisfies Partial<MainnetFaucetError>);
  });

  it('rejects claims after subnet velocity is exceeded', async () => {
    for (let index = 0; index < 3; index++) {
      const input = await createSignedClaimInput(createKeyPair(), {
        deviceToken: `device-${index}`,
        remoteIp: `192.168.1.${10 + index}`,
      });
      await service.createClaim(input);
    }

    const rejectedInput = await createSignedClaimInput(createKeyPair(), {
      deviceToken: 'device-rejected',
      remoteIp: '192.168.1.99',
    });
    const rejected = await service.createClaim(rejectedInput);

    expect(rejected.status).toBe(MainnetClaimStatus.Rejected);
    expect(rejected.publicReasonCode).toBe('network_limit_reached');
    expect(rejected.internalReasonCode).toBe('subnet_limit');
  });

  it('rejects claims after global hourly limit is exceeded', async () => {
    for (let index = 0; index < 10; index++) {
      const input = await createSignedClaimInput(createKeyPair(), {
        deviceToken: `device-${index}`,
        remoteIp: `10.${index}.0.1`,
      });
      await service.createClaim(input);
    }

    const rejectedInput = await createSignedClaimInput(createKeyPair(), {
      deviceToken: 'device-rejected',
      remoteIp: '10.200.0.1',
    });
    const rejected = await service.createClaim(rejectedInput);

    expect(rejected.status).toBe(MainnetClaimStatus.Rejected);
    expect(rejected.publicReasonCode).toBe('faucet_capacity_reached');
    expect(rejected.internalReasonCode).toBe('global_hour_limit');
  }, 15_000);

  it('rejects claims after global daily count limit is exceeded', async () => {
    config.mainnet.globalLimit1h = 100;
    config.mainnet.maxPayouts1h = 100;
    config.mainnet.globalLimit24h = 2;
    config.mainnet.maxPayouts24h = 2;

    for (let index = 0; index < 2; index++) {
      const input = await createSignedClaimInput(createKeyPair(), {
        deviceToken: `daily-device-${index}`,
        remoteIp: `172.${index}.0.1`,
      });
      await service.createClaim(input);
    }

    const rejectedInput = await createSignedClaimInput(createKeyPair(), {
      deviceToken: 'daily-device-rejected',
      remoteIp: '172.200.0.1',
    });
    const rejected = await service.createClaim(rejectedInput);

    expect(rejected.status).toBe(MainnetClaimStatus.Rejected);
    expect(rejected.publicReasonCode).toBe('faucet_capacity_reached');
    expect(rejected.internalReasonCode).toBe('global_day_limit');
  });

  it('rejects claims after global daily amount limit is exceeded', async () => {
    config.mainnet.globalLimit1h = 100;
    config.mainnet.maxPayouts1h = 100;
    config.mainnet.globalLimit24h = 100;
    config.mainnet.maxPayouts24h = 100;
    config.mainnet.maxAmount24h = 60;

    const first = await createSignedClaimInput(createKeyPair(), {
      deviceToken: 'amount-device-a',
      remoteIp: '172.16.0.1',
    });
    const second = await createSignedClaimInput(createKeyPair(), {
      deviceToken: 'amount-device-b',
      remoteIp: '172.17.0.1',
    });

    await service.createClaim(first);
    const rejected = await service.createClaim(second);

    expect(rejected.status).toBe(MainnetClaimStatus.Rejected);
    expect(rejected.publicReasonCode).toBe('faucet_capacity_reached');
    expect(rejected.internalReasonCode).toBe('daily_amount_limit');
  });
});
