export enum FaucetType {
  VaraTestnet = 0,
  BridgeErc20 = 1,
  BridgeVaraTestnet = 2,
  WVara = 3,
}

export enum RequestStatus {
  Pending = 0,
  Processing = 1,
  Completed = 2,
  Failed = 3,
}

export enum MainnetClaimStatus {
  Created = 'created',
  Validated = 'validated',
  Rejected = 'rejected',
  Queued = 'queued',
  Submitting = 'submitting',
  Submitted = 'submitted',
  InBlock = 'in_block',
  ReconciliationRequired = 'reconciliation_required',
  Finalized = 'finalized',
  FailedRetryable = 'failed_retryable',
  FailedTerminal = 'failed_terminal',
}
