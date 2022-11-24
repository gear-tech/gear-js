import { Hex } from '@gear-js/api';

import { CodeStatus } from '../../common/enums';
import { BaseDataInput } from '../../gear/types';

export interface CodeChangedInput extends BaseDataInput {
  id: Hex;
  status: CodeStatus;
  expiration: unknown
}
