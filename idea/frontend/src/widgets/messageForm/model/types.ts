import { PayloadValue } from '@/entities/formPayload';

type FormValues = {
  value: string;
  gasLimit: string;
  payload: PayloadValue;
  payloadType: string;
  isPrepaid: boolean;
};

export type { FormValues };
