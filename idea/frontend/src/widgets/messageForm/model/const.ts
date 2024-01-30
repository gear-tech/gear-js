import { FormValues, FormValuesDeprecated } from './types';

const INITIAL_VALUES: FormValues = {
  value: '0',
  payload: '0x',
  gasLimit: '0',
  payloadType: 'Bytes',
  voucherId: '',
  keepAlive: true,
};

const INITIAL_VALUES_DEPRECATED: FormValuesDeprecated = {
  value: '0',
  payload: '0x',
  gasLimit: '0',
  payloadType: 'Bytes',
  withVoucher: false,
  keepAlive: true,
};

export { INITIAL_VALUES, INITIAL_VALUES_DEPRECATED };
