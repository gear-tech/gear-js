import { HexString } from '@polkadot/util/types';

import { CodeStatus } from '../enums';
import { BaseDataInput } from './gear';

export interface CodeChangedInput extends BaseDataInput {
  id: HexString;
  status: CodeStatus;
  expiration: string;
}
