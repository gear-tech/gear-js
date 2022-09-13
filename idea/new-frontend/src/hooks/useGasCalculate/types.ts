import { Hex, PayloadType } from '@gear-js/api';

import { IGasInfo } from 'entities/gasInfo';
import { GasMethod } from 'shared/config';

type Values = {
  value: number;
  payload: PayloadType;
  payloadType: string;
};

type Code<T> = T extends GasMethod.InitUpdate ? Buffer : T extends GasMethod.InitCreate ? Hex : null;

type Result = IGasInfo & {
  limit: number;
};

export type { Values, Code, Result };
