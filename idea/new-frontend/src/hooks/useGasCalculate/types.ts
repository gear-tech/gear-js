import { Hex } from '@gear-js/api';

import { PayloadValue } from 'entities/formPayload';
import { GasMethod } from 'shared/config';

type Values = {
  value: number;
  payload: PayloadValue;
  payloadType: string;
};

type Code<T> = T extends GasMethod.InitUpdate ? Buffer : T extends GasMethod.InitCreate ? Hex : null;

export type { Values, Code };
