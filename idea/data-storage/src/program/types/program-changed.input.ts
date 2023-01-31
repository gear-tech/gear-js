import { HexString } from '@polkadot/util/types';
import { BaseDataInput } from '../../gear/types';

export interface ProgramChangedInput extends BaseDataInput {
  id: HexString;
  isActive: boolean;
}
