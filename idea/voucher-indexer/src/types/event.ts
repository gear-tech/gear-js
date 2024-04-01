export interface VoucherIssuedArgs {
  owner: string;
  spender: string;
  voucherId: string;
}

export interface VoucherUpdatedArgs extends Omit<VoucherIssuedArgs, 'owner'> {}

export interface VoucherDeclinedArgs extends VoucherUpdatedArgs {}

export interface VoucherRevokedArgs extends VoucherUpdatedArgs {}

export interface BalanceTransferArgs {
  from: string;
  to: string;
  amount: string;
}
