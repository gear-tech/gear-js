import { config } from 'dotenv';
import { strict as assert } from 'assert';
config();

const getEnv = (envName: string, defaultValue?: string) => {
  const env = process.env[envName];
  if (!env && defaultValue) {
    return defaultValue;
  }

  assert.notStrictEqual(env, undefined, `${envName} is not specified`);
  return env;
};

export default {
  db: {
    port: parseInt(getEnv(process.env.DB_PORT, '5432')),
    user: getEnv('DB_USER', 'postgres'),
    password: getEnv('DB_PASSWORD', 'postgres'),
    name: getEnv('DB_NAME', 'faucet'),
    host: getEnv('DB_HOST', 'localhost'),
  },
  varaTestnet: {
    providerAddresses: getEnv('VARA_PROVIDER', 'ws://127.0.0.1:9944').split(','),
    accountSeed: getEnv('VARA_ACCOUNT_SEED', '//Alice'),
    balanceToTransfer: getEnv('VARA_TRANSFER_VALUE', '1000000'),
    genesis: getEnv('VARA_GENESIS', '0x<vara_genesis>'),
    cronTime: getEnv('VARA_PROCESSOR_CRON_TIME', '*/6 * * * * *'),
  },
  eth: {
    providerAddress: getEnv('ETH_PROVIDER', 'https://<eth_provider>'),
    privateKey: getEnv('ETH_PRIVATE_KEY'),
    erc20Contracts: getEnv('ETH_ERC20_CONTRACTS')
      .split(',')
      .map((data) => data.split(':')),
    cronTime: getEnv('ETH_PROCESSOR_CRON_TIME', '*/24 * * * * *'),
  },
  server: {
    port: parseInt(getEnv(process.env.PORT, '3010')),
    captchaSecret: getEnv('CAPTCHA_SECRET', '0x234567898765432'),
  },
};
