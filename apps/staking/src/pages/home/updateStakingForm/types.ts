import { ReactNode } from 'react';

export enum FieldName {
  Reward = 'rewardTotal ',
  RewardAddress = 'rewardTokenAddress',
  StakingAddress = 'stakingTokenAddress',
  DistributionTime = 'distributionTime',
}

export type FormValues = {
  [FieldName.Reward]: number;
  [FieldName.RewardAddress]: string;
  [FieldName.StakingAddress]: string;
  [FieldName.DistributionTime]: string;
};

export type FormValidate = Record<keyof FormValues, (value: any) => ReactNode>;
