import { HexString } from '@polkadot/util/types';
import { ProgramStatus } from '@gear-js/common';

import { BaseDataInput } from './gear';

export interface ProgramChangedInput extends BaseDataInput {
  id: HexString;
  status: ProgramStatus;
  expiration?: string;
}
