import { Metadata } from '@gear-js/api';

import { MetaFieldsValues } from 'components/MetaFields';

export type FormValues = Metadata & {
  value: number;
  payload: string;
  gasLimit: number;
  programName: string;
  __root: MetaFieldsValues | null;
};
