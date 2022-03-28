import { MetaFormValues } from '../../../../../utils/meta-parser';

export type InitialValues = {
  gasLimit: number;
  value: number;
  payload: string;
  destination: string;
  __root: MetaFormValues | null;
};
