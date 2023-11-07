import { PayloadValue } from '@/entities/formPayload';

type FormValues = {
  value: string;
  gasLimit: string;
  payload: PayloadValue;
  payloadType: string;
  withVoucher: boolean;
  keepAlive: boolean;
};

export type { FormValues };
