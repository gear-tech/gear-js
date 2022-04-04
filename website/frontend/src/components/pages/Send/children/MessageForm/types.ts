import { MetaFormValues } from 'components/MetaFields';

export type InitialValues = {
  gasLimit: number;
  value: number;
  payload: string;
  destination: string;
  __root: MetaFormValues | null;
};
