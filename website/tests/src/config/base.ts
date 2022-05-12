import assert from 'assert';
import { config } from 'dotenv';
config();

function checkEnv(name: string): string {
    const env = process.env[name];
    assert.notStrictEqual(env, undefined, `${name} is not specified`);
    return env as string;
}

export default {
    gear: {
        wsProvider: checkEnv('WS_PROVIDER'),
        api: checkEnv('API_ENDPOINT'),
    },
    db: {
        host: checkEnv('DB_HOST'),
        port: checkEnv('DB_PORT'),
        username: checkEnv('DB_USERNAME'),
        password: checkEnv('DB_PASSWORD'),
        name: checkEnv('DB_NAME'),
    },
};
