import { ReactNode } from 'react';

export enum FieldName {
  Amount = 'amount',
}

export type FormValues = {
  [FieldName.Amount]: number;
};

export type FormValidate = Record<keyof FormValues, (value: string | number) => ReactNode>;
