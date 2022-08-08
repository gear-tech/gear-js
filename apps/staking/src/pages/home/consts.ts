import { ProgramState, Staker } from 'types/state';
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

export const DEFAULT_STAKER_INFO: Staker = {
  balance: 0,
  rewardDebt: 0,
  distributed: 0,
  rewardAllowed: 0,
};
