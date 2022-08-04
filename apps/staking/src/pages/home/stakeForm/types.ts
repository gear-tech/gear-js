import { ReactNode } from 'react';

export enum FieldName {
  Stake = 'stake',
}

export type FormValues = {
  [FieldName.Stake]: string;
};

export type FormValidate = Record<keyof FormValues, (value: string | number) => ReactNode>;
