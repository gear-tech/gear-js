import { ReactNode } from 'react';

export enum FieldName {
  Reward = 'reward',
  Interval = 'interval',
  RewardAddress = 'rewardAddress',
  StakingAddress = 'stakingAddress',
}

export type FormValues = {
  [FieldName.Reward]: string;
  [FieldName.Interval]: number;
  [FieldName.RewardAddress]: string;
  [FieldName.StakingAddress]: string;
};

export type FormValidate = Record<keyof FormValues, (value: string | number) => ReactNode>;
