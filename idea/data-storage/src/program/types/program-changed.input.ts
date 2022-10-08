import { Hex } from '@gear-js/api';
import { BaseDataInput } from '../../gear/types';

export interface ProgramChangedInput extends BaseDataInput {
  id: Hex;
  isActive: boolean;
}
