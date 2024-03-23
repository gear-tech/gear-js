export interface IssueVoucherTxArgs {
  spender: string;
  balance: string;
  programs: string[];
  codeUploading: boolean;
  duration: number;
}

export interface UpdateVoucherTxArgs {
  spender: string;
  voucherId: string;
  moveOwnership?: string;
  balanceTopUp?: string;
  appendPrograms: { __kind: 'None' | 'Some'; value: string[] };
  codeUploading?: boolean;
  prolongDuration?: number;
}
