import { HexString } from '@polkadot/util/types';

import { BaseDataInput } from '../../gear/types';
import { ProgramStatus } from '../../common/enums';

export interface ProgramChangedInput extends BaseDataInput {
  id: HexString;
  programStatus: ProgramStatus
}
