import { config } from 'dotenv';
import { strict as assert } from 'assert';
import { Hex } from 'viem';
config();

const getEnv = (envName: string, defaultValue?: string): string => {
  const env = process.env[envName];
  if (!env && defaultValue) {
    return defaultValue;
  }

  assert.notStrictEqual(env, undefined, `${envName} is not specified`);
  return env as string;
};

const getPrivateKey = (envName: string) => {
  const key = getEnv(envName);
  if (!key.startsWith('0x')) {
    throw new Error(`${envName} must start with 0x`);
  }
  return key as Hex;
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
    genesis: getEnv('VARA_GENESIS', '0x<vara_genesis>'),
    cronTime: getEnv('VARA_PROCESSOR_CRON_TIME', '*/6 * * * * *'),
  },
  bridge: {
    tvaraAmount: Number(getEnv('BRIDGE_TVARA_AMOUNT', '1000')),
    ethProvider: getEnv('ETH_PROVIDER', 'wss://<eth_provider>'),
    ethPrivateKey: getPrivateKey('ETH_PRIVATE_KEY'),
    erc20Contracts: getEnv('ETH_ERC20_CONTRACTS')
      .split(',')
      .map((data) => {
        const [addr, value] = data.split(':');
        assert.ok(!isNaN(Number(value)), `Invalid value for ${addr}`);
        return [addr.toLowerCase(), value] as [Hex, string];
      }),
    cronTime: getEnv('ETH_PROCESSOR_CRON_TIME', '*/24 * * * * *'),
  },
  wvara: {
    address: getEnv('WVARA_ADDRESS', '0x<address>') as Hex,
    amount: getEnv('WVARA_AMOUNT', '1000'),
    privateKey: getPrivateKey('WVARA_PRIVATE_KEY'),
    cronTime: getEnv('WVARA_PROCESSOR_CRON_TIME', '*/24 * * * * *'),
  },
  server: {
    port: parseInt(getEnv('PORT', '3010')),
    captchaSecret: getEnv('CAPTCHA_SECRET', '0x234567898765432'),
    rateLimitMs: Number(getEnv('RATE_LIMIT_SEC', '60000')),
  },
};
