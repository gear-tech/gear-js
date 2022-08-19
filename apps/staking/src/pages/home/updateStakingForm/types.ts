import { ReactNode } from 'react';

export enum FieldName {
  Reward = 'rewardTotal',
  DistributionTime = 'distributionTime',
}

export type FormValues = {
  [FieldName.Reward]: number;
  [FieldName.DistributionTime]: string;
};

export type FormValidate = Record<keyof FormValues, (value: any) => ReactNode>;
