import { SwitchItem } from 'components/common/switcher';

export enum SwitcerValue {
  Init = 'init',
  List = 'list',
  State = 'state',
  Stake = 'stake',
  Withdraw = 'withdraw',
}

export const SWITCHER_ITEMS: SwitchItem[] = [
  {
    value: SwitcerValue.Init,
    label: 'Init / Update Staking',
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
