import { HexString } from '@gear-js/api';
import { FIELD_NAME, VOUCHER_TYPE } from './consts';

type VoucherType = typeof VOUCHER_TYPE[keyof typeof VOUCHER_TYPE];

type Values = {
  [FIELD_NAME.ACCOUNT_ADDRESS]: string;
  [FIELD_NAME.VALUE]: string;
  [FIELD_NAME.DURATION]: string;
};

type Voucher = {
  id: HexString;
  owner: HexString;
  spender: HexString;
  amount: string;
  balance: string;
  programs: HexString[];
  codeUploading: boolean;
  expiryAtBlock: string;
  expiryAt: string;
  issuedAtBlock: string;
  issuedAt: string;
  updatedAtBlock: string;
  updatedAt: string;
  isDeclined: boolean;
};

type VouchersParams = {
  limit: number;
  offset: number;
  id: HexString;
  owner: string;
  spender: string;
  declined: boolean;
  expired: boolean;
};

type VouchersResponse = {
  vouchers: Voucher[];
  count: number;
};

export type { VoucherType, Values, Voucher, VouchersParams, VouchersResponse };
