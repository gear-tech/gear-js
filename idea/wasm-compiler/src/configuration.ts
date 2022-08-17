import { strict as assert } from 'assert';
import { config } from 'dotenv';

config();

function getEnv(envName: string, defaultValue?: any) {
  const env = process.env[envName];
  if (defaultValue) {
    return env || defaultValue;
  }
  assert.notStrictEqual(env, undefined, `${envName} not specified`);
  return env;
}

export default {
  server: {
    port: parseInt(getEnv('PORT', '8000'), 10),
  },
  db: {
    port: parseInt(getEnv('DB_PORT', '5432'), 10),
    user: getEnv('DB_USER'),
    password: getEnv('DB_PASSWORD'),
    name: getEnv('DB_NAME'),
    host: getEnv('DB_HOST', 'localhost'),
  },
  compiler: {
    rootFolder: getEnv('WASM_BUILD_FOLDER'),
  },
};

export const PATH_TO_RUN_CONTAINER_SCRIPT = './wasm-build/run-container.sh';
