import { JsonRpcError } from '../types/index.js';

export class VoucherNotFound implements JsonRpcError {
  code = -32404;
  message = 'Voucher not found';
}
