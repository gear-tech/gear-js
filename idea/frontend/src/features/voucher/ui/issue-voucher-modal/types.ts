import { VOUCHER_TYPE } from './consts';

type VoucherType = typeof VOUCHER_TYPE[keyof typeof VOUCHER_TYPE];

export type { VoucherType };
