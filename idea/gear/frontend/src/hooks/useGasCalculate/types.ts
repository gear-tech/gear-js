import { PayloadType } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';

import { GasMethod } from '@/shared/config';

type Values = {
  value: string;
  payload: PayloadType;
};

type Code<T> = T extends GasMethod.InitUpdate ? Buffer : T extends GasMethod.InitCreate ? HexString : null;

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
