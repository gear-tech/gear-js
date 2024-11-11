import { INDEXER_RPC_SERVICE } from '@/shared/services/rpcService';

import { PaginationResponse } from '@/api';

import { Voucher, VouchersParameters } from './types';
import { METHOD } from '.';

const getVoucher = (id: string) => INDEXER_RPC_SERVICE.callRPC<Voucher>(METHOD.DATA, { id });

const getVouchers = (parameters?: VouchersParameters) =>
  INDEXER_RPC_SERVICE.callRPC<PaginationResponse<Voucher>>(METHOD.ALL, parameters);

export { getVoucher, getVouchers };
