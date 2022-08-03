import { SwitchItem } from 'components/common/switcher';

export enum SwitcerValue {
  Init = 'init',
  List = 'list',
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
];
