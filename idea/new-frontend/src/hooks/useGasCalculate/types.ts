import { Hex, PayloadType } from '@gear-js/api';

import { GasMethod } from 'shared/config';

type Values = {
  value: number;
  payload: PayloadType;
  payloadType: string;
};

type Code<T> = T extends GasMethod.InitUpdate ? Buffer : T extends GasMethod.InitCreate ? Hex : null;

interface IGasInfo {
  burned: string;
  waited: boolean;
  minLimit: string;
  reserved: string;
  mayBeReturned: string;
}

type Result = IGasInfo & {
  limit: number;
};

export type { Values, Code, Result };
