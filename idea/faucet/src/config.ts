import { config } from 'dotenv';
import { strict as assert } from 'assert';
config();

const checkEnv = (envName: string, defaultValue?: string) => {
  const env = process.env[envName];
  if (!env && defaultValue) {
    return defaultValue;
  }

  assert.notStrictEqual(env, undefined, `${envName} is not specified`);
  return env;
};

export default {
  db: {
    port: parseInt(checkEnv(process.env.DB_PORT, '5432')),
    user: checkEnv('DB_USER', 'postgres'),
    password: checkEnv('DB_PASSWORD', 'postgres'),
    name: checkEnv('DB_NAME', 'name'),
    host: checkEnv(process.env.DB_HOST, 'localhost'),
  },
  gear: {
    providerAddresses: checkEnv('WS_PROVIDER', 'wss://rpc-node.gear-tech.io:443').split(','),
    accountSeed: checkEnv('TEST_ACCOUNT_SEED', '//Alice'),
    balanceToTransfer: checkEnv('TEST_BALANCE_VALUE', '1000000'),
  },
  server: {
    port: parseInt(checkEnv(process.env.PORT, '3010')),
    captchaSecret: checkEnv('CAPTCH_SECRET', '0x234567898765432'),
  },
};
