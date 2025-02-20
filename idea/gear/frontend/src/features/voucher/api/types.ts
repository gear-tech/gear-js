import { HexString } from '@gear-js/api';

import { PaginationParameters } from '@/api';

type VouchersParameters = PaginationParameters & {
  id?: string;
  owner?: string;
  spender?: string;
  programs?: string[];
  declined?: boolean;
  expired?: boolean;
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

export type { VouchersParameters, Voucher };
