import { MetaFieldsValues } from 'components/MetaFields';

export type InitialValues = {
  gasLimit: number;
  value: number;
  payload: string;
  payloadType: string;
  destination: string;
  __root: MetaFieldsValues | null;
};
