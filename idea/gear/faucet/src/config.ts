import { strict as assert } from 'node:assert';
import { config } from 'dotenv';
import type { Hex } from 'viem';

config({ quiet: true });

const getEnv = (envName: string, defaultValue?: string): string => {
  const env = process.env[envName];
  if (!env && defaultValue !== undefined) {
    return defaultValue;
  }

  assert.notStrictEqual(env, undefined, `${envName} is not specified`);
  return env as string;
};

const getOptionalHex = (envName: string): Hex | undefined => {
  const val = process.env[envName];
  if (!val) return undefined;
  if (!val.startsWith('0x')) throw new Error(`${envName} must start with 0x`);
  return val.toLowerCase() as Hex;
};

const getOptionalEnv = (envName: string): string | undefined => {
  const env = process.env[envName];
  return env || undefined;
};

const getCsvEnv = (envName: string): string[] =>
  getEnv(envName, '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

export default {
  db: {
    port: Number.parseInt(getEnv('DB_PORT', '5432'), 10),
    user: getEnv('DB_USER', 'postgres'),
    password: getEnv('DB_PASSWORD', 'postgres'),
    name: getEnv('DB_NAME', 'faucet'),
    host: getEnv('DB_HOST', 'localhost'),
  },
  varaTestnet: {
    providerAddresses: getEnv('VARA_PROVIDER', 'ws://127.0.0.1:9944').split(','),
    accountSeed: getEnv('VARA_ACCOUNT_SEED', '//Alice'),
    balanceToTransfer: Number(getEnv('VARA_TRANSFER_VALUE', '1000')),
    genesis: getOptionalHex('VARA_GENESIS'),
    cronTime: getEnv('VARA_PROCESSOR_CRON_TIME', '*/6 * * * * *'),
  },
  bridge: {
    tvaraAmount: Number(getEnv('BRIDGE_TVARA_AMOUNT', '1000')),
    ethProvider: process.env.ETH_PROVIDER,
    ethPrivateKey: getOptionalHex('ETH_PRIVATE_KEY'),
    erc20Contracts: ((process.env.ETH_ERC20_CONTRACTS || undefined)?.split(',') || []).map((data) => {
      const [addr, value] = data.split(':');
      assert.ok(!Number.isNaN(Number(value)), `Invalid value for ${addr}`);
      return [addr.toLowerCase(), value] as [Hex, string];
    }),
    cronTime: getEnv('ETH_PROCESSOR_CRON_TIME', '*/24 * * * * *'),
  },
  wvara: {
    address: getOptionalHex('WVARA_ADDRESS'),
  },
  server: {
    port: Number.parseInt(getEnv('PORT', '3010'), 10),
    captchaSecret: getEnv('CAPTCHA_SECRET', '0x234567898765432'),
    rateLimitMs: Number(getEnv('RATE_LIMIT_SEC', '60000')),
  },
  agent: {
    enabled: getEnv('AGENT_FAUCET_ENABLED', 'false') === 'true',
    dailyCap: Number(getEnv('AGENT_DAILY_CAP', '20')),
    rateLimitMs: Number(getEnv('AGENT_RATE_LIMIT_MS', '300000')),
    challengeTtlMs: Number(getEnv('AGENT_CHALLENGE_TTL_MS', '60000')),
  },
  mainnet: {
    enabled: getEnv('VARA_MAINNET_FAUCET_ENABLED', 'false') === 'true',
    providerAddresses: getEnv('VARA_MAINNET_PROVIDER', 'wss://rpc.vara.network').split(','),
    genesis: getOptionalHex('VARA_MAINNET_GENESIS'),
    accountSeed: getOptionalEnv('VARA_MAINNET_ACCOUNT_SEED'),
    transferValue: Number(getEnv('VARA_MAINNET_TRANSFER_VALUE', '50')),
    challengeTtlMs: Number(getEnv('VARA_MAINNET_CHALLENGE_TTL_MS', '300000')),
    requireCloudflare: getEnv('VARA_MAINNET_REQUIRE_CLOUDFLARE', 'true') === 'true',
    apiRateLimitWindowMs: Number(getEnv('VARA_MAINNET_API_RATE_LIMIT_WINDOW_MS', '60000')),
    challengeRateLimit: Number(getEnv('VARA_MAINNET_CHALLENGE_RATE_LIMIT', '5')),
    claimRateLimit: Number(getEnv('VARA_MAINNET_CLAIM_RATE_LIMIT', '3')),
    workerCronTime: getEnv('VARA_MAINNET_WORKER_CRON_TIME', '*/12 * * * * *'),
    workerBatchSize: Number(getEnv('VARA_MAINNET_WORKER_BATCH_SIZE', '5')),
    lifecycleCronTime: getEnv('VARA_MAINNET_LIFECYCLE_CRON_TIME', '17 */10 * * * *'),
    alertCronTime: getEnv('VARA_MAINNET_ALERT_CRON_TIME', '43 */5 * * * *'),
    alertWebhookUrl: getOptionalEnv('VARA_MAINNET_ALERT_WEBHOOK_URL'),
    alertPayoutQueueThreshold: Number(getEnv('VARA_MAINNET_ALERT_PAYOUT_QUEUE_THRESHOLD', '10')),
    alertReconciliationBacklogThreshold: Number(getEnv('VARA_MAINNET_ALERT_RECONCILIATION_BACKLOG_THRESHOLD', '0')),
    alertAutomationRejectThreshold: Number(getEnv('VARA_MAINNET_ALERT_AUTOMATION_REJECT_THRESHOLD', '20')),
    alertTurnstileFailureRatio: Number(getEnv('VARA_MAINNET_ALERT_TURNSTILE_FAILURE_RATIO', '0.5')),
    alertTurnstileMinSamples: Number(getEnv('VARA_MAINNET_ALERT_TURNSTILE_MIN_SAMPLES', '20')),
    alertExpiredChallengeThreshold: Number(getEnv('VARA_MAINNET_ALERT_EXPIRED_CHALLENGE_THRESHOLD', '100')),
    expiredChallengeGraceMs: Number(getEnv('VARA_MAINNET_EXPIRED_CHALLENGE_GRACE_MS', '3600000')),
    rejectedClaimRetentionDays: Number(getEnv('VARA_MAINNET_REJECTED_CLAIM_RETENTION_DAYS', '30')),
    auditEventRetentionDays: Number(getEnv('VARA_MAINNET_AUDIT_EVENT_RETENTION_DAYS', '180')),
    reconciliationLookbackBlocks: Number(getEnv('VARA_MAINNET_RECONCILIATION_LOOKBACK_BLOCKS', '256')),
    reconciliationGraceMs: Number(getEnv('VARA_MAINNET_RECONCILIATION_GRACE_MS', '600000')),
    hmacSecret: getOptionalEnv('VARA_MAINNET_HMAC_SECRET'),
    adminApiKey: getOptionalEnv('VARA_MAINNET_ADMIN_API_KEY'),
    turnstileSecret: getOptionalEnv('VARA_MAINNET_TURNSTILE_SECRET'),
    turnstileSiteKey: getOptionalEnv('VARA_MAINNET_TURNSTILE_SITE_KEY'),
    turnstileHostname: getOptionalEnv('VARA_MAINNET_TURNSTILE_HOSTNAME'),
    turnstileRequired: getEnv('VARA_MAINNET_TURNSTILE_REQUIRED', 'true') === 'true',
    fullIpLimit24h: Number(getEnv('VARA_MAINNET_FULL_IP_LIMIT_24H', '1')),
    subnetLimit24h: Number(getEnv('VARA_MAINNET_SUBNET_LIMIT_24H', '3')),
    globalLimit1h: Number(getEnv('VARA_MAINNET_GLOBAL_LIMIT_1H', '10')),
    globalLimit24h: Number(getEnv('VARA_MAINNET_GLOBAL_LIMIT_24H', '100')),
    highRiskCountries: getCsvEnv('VARA_MAINNET_HIGH_RISK_COUNTRIES').map((value) => value.toUpperCase()),
    mediumRiskCountries: getCsvEnv('VARA_MAINNET_MEDIUM_RISK_COUNTRIES').map((value) => value.toUpperCase()),
    highRiskAsns: getCsvEnv('VARA_MAINNET_HIGH_RISK_ASNS').map((value) => value.toUpperCase()),
    mediumRiskAsns: getCsvEnv('VARA_MAINNET_MEDIUM_RISK_ASNS').map((value) => value.toUpperCase()),
    rejectMediumRiskWithoutTurnstile: getEnv('VARA_MAINNET_REJECT_MEDIUM_RISK_WITHOUT_TURNSTILE', 'true') === 'true',
    maxPayouts1h: Number(getEnv('VARA_MAINNET_TREASURY_MAX_PAYOUTS_1H', '10')),
    maxPayouts24h: Number(getEnv('VARA_MAINNET_TREASURY_MAX_PAYOUTS_24H', '100')),
    maxAmount24h: Number(getEnv('VARA_MAINNET_TREASURY_MAX_AMOUNT_24H', '5000')),
    minBalance: Number(getEnv('VARA_MAINNET_TREASURY_MIN_BALANCE', '500')),
    emergencyPause: getEnv('VARA_MAINNET_EMERGENCY_PAUSE', 'false') === 'true',
  },
};
