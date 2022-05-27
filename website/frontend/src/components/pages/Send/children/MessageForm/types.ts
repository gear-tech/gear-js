import { ParsedTypeStructure } from 'components/common/FormPayload/types';

export type FormValues = {
  value: number;
  gasLimit: number;
  payload: ParsedTypeStructure;
  payloadType: string;
  destination: string;
};
