import { ReactNode } from 'react';

export enum FieldName {
  Amount = 'amount',
}

export type FormValues = {
  [FieldName.Amount]: string;
};

export type FormValidate = Record<keyof FormValues, (value: string | number) => ReactNode>;
