import { INDEXER_RPC_SERVICE } from '@/shared/services/rpcService';

import { PaginationResponse } from '@/api';

import { METHOD } from './consts';
import { Voucher, VouchersParams } from './types';

const getVoucher = (id: string) => INDEXER_RPC_SERVICE.callRPC<Voucher>(METHOD.DATA, { id });

const getVouchers = (parameters?: Partial<VouchersParams>) =>
  INDEXER_RPC_SERVICE.callRPC<PaginationResponse<Voucher>>(METHOD.ALL, parameters);

export { getVoucher, getVouchers };
