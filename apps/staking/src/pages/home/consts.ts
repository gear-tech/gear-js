import { ProgramState } from 'types/state';
import { SwitchItem } from 'components/common/switcher';

import { SwitcerValue } from './types';

export const SWITCHER_ITEMS: SwitchItem[] = [
  {
    value: SwitcerValue.Update,
    label: 'Update Staking',
  },
  {
    value: SwitcerValue.List,
    label: 'Stakers List',
  },
  {
    value: SwitcerValue.Stake,
    label: 'Stake',
  },
  {
    value: SwitcerValue.Withdraw,
    label: 'Withdraw',
  },
  {
    value: SwitcerValue.State,
    label: 'State',
  },
];

export const PAYLOAD_FOR_INFO_STATE = {
  [ProgramState.Info]: null,
};
