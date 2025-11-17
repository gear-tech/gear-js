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
