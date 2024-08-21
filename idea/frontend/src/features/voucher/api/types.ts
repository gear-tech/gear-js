import { HexString } from '@gear-js/api';

import { PaginationParameters } from '@/api';

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

type VouchersParameters = PaginationParameters &
  Partial<Pick<Voucher, 'owner' | 'spender' | 'codeUploading' | 'id' | 'programs'>> & {
    declined?: boolean;
    expired?: boolean;
  };

type VouchersResponse = {
  vouchers: Voucher[];
  count: number;
};

export type { Voucher, VouchersParameters, VouchersResponse };
