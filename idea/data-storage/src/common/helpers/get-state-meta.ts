import { getStateMetadata } from '@gear-js/api';
import { config } from 'dotenv';

config();

export async function getStateMeta(stateMetaBuff: Buffer): Promise<{ functions: object }> {
  if(process.env.TEST_ENV_UNIT) {
    return { functions: {} };
  }

  return getStateMetadata(stateMetaBuff);
}
