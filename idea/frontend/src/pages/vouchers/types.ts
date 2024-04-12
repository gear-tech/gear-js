import { HexString } from '@gear-js/api';

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

export type { Voucher, VouchersParams, VouchersResponse };
