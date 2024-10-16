import { JsonRpcError } from '../types';

export class VoucherNotFound implements JsonRpcError {
  code = -32404;
  message = 'Voucher not found';
}
