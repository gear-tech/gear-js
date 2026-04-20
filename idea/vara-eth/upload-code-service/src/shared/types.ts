import type { Address, Hash, Hex } from 'viem';

export type RequestCodeValidationParams = {
  readonly code: Hex;
  readonly codeId: Hash;
  readonly sender: Address;
  readonly blobHash: Hash;
  /**
   * Signature over [blobHash, codeId]
   */
  readonly signature: Hex;
};

export type JobStatus = 'pending' | 'processing' | 'success' | 'failed';

export type DbRequest = RequestCodeValidationParams & { status: JobStatus; transactionHash?: Hash };
