import { PayloadValue } from '@/entities/formPayload';

type FormValues = {
  value: string;
  gasLimit: string;
  payload: PayloadValue;
  payloadType: string;
  voucherId: string;
  keepAlive: boolean;
};

export type { FormValues };
