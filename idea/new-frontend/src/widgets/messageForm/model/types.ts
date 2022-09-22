import { PayloadValue } from 'entities/formPayload';

type FormValues = {
  value: number;
  gasLimit: number;
  payload: PayloadValue;
  payloadType: string;
};

export type { FormValues };
