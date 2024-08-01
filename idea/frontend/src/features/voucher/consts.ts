import { Values } from './types';

const FIELD_NAME = {
  VOUCHER_TYPE: 'type',
  ACCOUNT_ADDRESS: 'address',
  VALUE: 'value',
  DURATION: 'duration',
} as const;

const VOUCHER_TYPE = {
  PROGRAM: 'program',
  MIXED: 'mixed',
  CODE: 'code',
} as const;

const DEFAULT_VALUES: Values = {
  [FIELD_NAME.ACCOUNT_ADDRESS]: '',
  [FIELD_NAME.VALUE]: '',
  [FIELD_NAME.DURATION]: '',
};

const DEFAULT_FILTER_VALUES = {
  owner: 'all',
  status: '',
};

export { FIELD_NAME, VOUCHER_TYPE, DEFAULT_VALUES, DEFAULT_FILTER_VALUES };
