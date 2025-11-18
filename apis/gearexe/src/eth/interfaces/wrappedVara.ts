/**
 * Helper functions for WrappedVara transactions.
 */
export interface WrappedVaraTxHelpers {
  /**
   * Gets the approval event log from the transaction.
   * @returns Promise resolving to the approval log
   */
  getApprovalLog: () => Promise<ApprovalLog>;
}

export interface WVaraTransferHelpers {
  /**
   * Gets the transfer event log from the transaction.
   * @returns Promise resolving to the transfer log
   */
  getTransferLog: () => Promise<TransferLog>;
}

/**
 * Represents an approval event log.
 */
export interface ApprovalLog {
  /**
   * The address of the token owner.
   */
  owner: string;

  /**
   * The address of the spender.
   */
  spender: string;

  /**
   * The approved value.
   */
  value: bigint;
}

export interface TransferLog {
  /**
   * The address of the token owner.
   */
  from: string;

  /**
   * The address of the recipient.
   */
  to: string;

  /**
   * The transferred value.
   */
  value: bigint;
}
