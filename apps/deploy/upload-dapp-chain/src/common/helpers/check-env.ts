import { strict as assert } from "assert";

export const checkEnv = (envName: string) => {
  const env = process.env[envName];
  assert.notStrictEqual(env, undefined, `${envName} is not specified`);
  return env;
};
