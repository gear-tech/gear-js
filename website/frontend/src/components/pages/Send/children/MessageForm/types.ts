import { ParsedStruct } from '../../../../../utils/meta-parser';

export type InitialValues = {
  gasLimit: number;
  value: number;
  payload: string;
  destination: string;
  meta: null | ParsedStruct;
};
