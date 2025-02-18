import { FIELD_NAME, VOUCHER_TYPE } from './consts';

type VoucherType = (typeof VOUCHER_TYPE)[keyof typeof VOUCHER_TYPE];

type Values = {
  [FIELD_NAME.ACCOUNT_ADDRESS]: string;
  [FIELD_NAME.VALUE]: string;
  [FIELD_NAME.DURATION]: string;
};

export type { VoucherType, Values };
