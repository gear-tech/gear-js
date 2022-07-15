import { FormValues } from './types';

import { MIN_GAS_LIMIT } from 'consts';

export const INITIAL_VALUES: FormValues = {
  value: 0,
  payload: '0x00',
  gasLimit: MIN_GAS_LIMIT,
  payloadType: 'Bytes',
};
