import { config } from 'dotenv';
import { strict as assert } from 'assert';
import { Hex } from 'viem';
config();

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

export default {
  db: {
    port: parseInt(getEnv('DB_PORT', '5432')),
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
      assert.ok(!isNaN(Number(value)), `Invalid value for ${addr}`);
      return [addr.toLowerCase(), value] as [Hex, string];
    }),
    cronTime: getEnv('ETH_PROCESSOR_CRON_TIME', '*/24 * * * * *'),
  },
  wvara: {
    address: getOptionalHex('WVARA_ADDRESS'),
  },
  server: {
    port: parseInt(getEnv('PORT', '3010')),
    captchaSecret: getEnv('CAPTCHA_SECRET', '0x234567898765432'),
    rateLimitMs: Number(getEnv('RATE_LIMIT_SEC', '60000')),
  },
  agent: {
    enabled: getEnv('AGENT_FAUCET_ENABLED', 'false') === 'true',
    dailyCap: Number(getEnv('AGENT_DAILY_CAP', '20')),
    rateLimitMs: Number(getEnv('AGENT_RATE_LIMIT_MS', '300000')),
    challengeTtlMs: Number(getEnv('AGENT_CHALLENGE_TTL_MS', '60000')),
  },
};
