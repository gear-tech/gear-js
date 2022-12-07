import { HexString } from '@polkadot/util/types';

import { HumanProgramMetadata, ProgramMetadata } from '../types';
import { CreateType } from '../create-type';

export function getProgramMetadata(hexMetadata: HexString): HumanProgramMetadata {
  return CreateType.create<ProgramMetadata>('ProgramMetadata', hexMetadata, true).toJSON();
}
