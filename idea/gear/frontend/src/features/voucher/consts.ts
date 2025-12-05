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

// filters

const FILTER_NAME = {
  OWNER: 'owner',
  STATUS: 'status',
} as const;

const FILTER_VALUE = {
  OWNER: {
    ALL: 'all',
    BY: 'by',
    TO: 'to',
  },

  STATUS: {
    NONE: '',
    ACTIVE: 'active',
    DECLINED: 'declined',
    EXPIRED: 'expired',
  },
} as const;

const FILTER_VALUES = {
  OWNER: Object.values(FILTER_VALUE.OWNER),
  STATUS: Object.values(FILTER_VALUE.STATUS),
} as const;

const DEFAULT_FILTER_VALUE = {
  OWNER: FILTER_VALUE.OWNER.ALL as (typeof FILTER_VALUE.OWNER)[keyof typeof FILTER_VALUE.OWNER],
  STATUS: FILTER_VALUE.STATUS.NONE as (typeof FILTER_VALUE.STATUS)[keyof typeof FILTER_VALUE.STATUS],
} as const;

const DEFAULT_FILTER_VALUES = {
  [FILTER_NAME.OWNER]: DEFAULT_FILTER_VALUE.OWNER,
  [FILTER_NAME.STATUS]: DEFAULT_FILTER_VALUE.STATUS,
} as const;

export {
  FIELD_NAME,
  VOUCHER_TYPE,
  DEFAULT_VALUES,
  FILTER_NAME,
  FILTER_VALUE,
  FILTER_VALUES,
  DEFAULT_FILTER_VALUE,
  DEFAULT_FILTER_VALUES,
};
