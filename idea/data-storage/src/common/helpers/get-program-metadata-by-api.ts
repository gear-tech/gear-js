import { HexString } from '@polkadot/util/types';
import { ProgramMetadata, getProgramMetadata } from '@gear-js/api';

export function getProgramMetadataByApi(hex: HexString): ProgramMetadata {
  if(process.env.TEST_ENV_UNIT) return { types: 'some_types' } as any;

  return getProgramMetadata(hex);
}
