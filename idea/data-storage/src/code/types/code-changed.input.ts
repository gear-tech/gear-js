import { HexString } from '@polkadot/util/types';

import { CodeStatus } from '../../common/enums';
import { BaseDataInput } from '../../gear/types';
import { Meta } from '../../database/entities';

export interface CodeChangedInput extends BaseDataInput {
  id: HexString;
  status: CodeStatus;
  expiration: unknown;
  meta?: Meta;
}
