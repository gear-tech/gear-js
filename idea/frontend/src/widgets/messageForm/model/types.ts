import { HexString } from '@gear-js/api';

import { PayloadValue } from '@/entities/formPayload';

type FormValues = {
  value: string;
  gasLimit: string;
  payload: PayloadValue;
  payloadType: string;
  voucherId: HexString | false;
  keepAlive: boolean;
};

export type { FormValues };
