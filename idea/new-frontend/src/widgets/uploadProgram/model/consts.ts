import { MIN_GAS_LIMIT } from 'shared/config';

import { FormValues } from './types';

const INITIAL_VALUES: FormValues = {
  value: 0,
  payload: '0x00',
  gasLimit: MIN_GAS_LIMIT,
  programName: '',
  payloadType: 'Bytes',
};

export { INITIAL_VALUES };
