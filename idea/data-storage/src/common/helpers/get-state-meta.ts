import { getStateMetadata, StateMetadata } from '@gear-js/api';
import { config } from 'dotenv';

config();

export async function getStateMeta(stateMetaBuff: Buffer): Promise<StateMetadata> {
  if(process.env.TEST_ENV_UNIT) {
    return { functions: {} } as StateMetadata;
  }

  return getStateMetadata(stateMetaBuff);
}
