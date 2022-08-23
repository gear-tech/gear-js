import { Hex } from '@gear-js/api';

import { GasMethod } from 'consts';
import { PayloadValue } from 'components/common/Form/FormPayload/types';

export type Values = {
  value: number;
  payload: PayloadValue;
  payloadType: string;
};

export type Code<T> = T extends GasMethod.InitUpdate ? Buffer : T extends GasMethod.InitCreate ? Hex : null;
