import { HexString } from '@polkadot/util/types';

import { HumanProgramMetadata } from '../types';
import { CreateType } from '../create-type';

export function getProgramMetadata(hexMetadata: HexString): HumanProgramMetadata {
  return CreateType.create('ProgramMetadata', hexMetadata, true).toJSON() as unknown as HumanProgramMetadata;
}
