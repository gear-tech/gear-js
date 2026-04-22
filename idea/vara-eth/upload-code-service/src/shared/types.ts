import type { Address, Hash, Hex } from 'viem';

export type RequestCodeValidationParams = {
  readonly code: Hex;
  readonly codeId: Hash;
  readonly sender: Address;
  readonly blobHashes: Hash[];
  readonly deadline: number;
  /** EIP-712 signature for requestCodeValidationOnBehalf */
  readonly v1: number;
  readonly r1: Hash;
  readonly s1: Hash;
  /** EIP-2612 permit signature for WVARA */
  readonly v2: number;
  readonly r2: Hash;
  readonly s2: Hash;
};

export type JobStatus = 'pending' | 'processing' | 'success' | 'failed';

export type DbRequest = RequestCodeValidationParams & { status: JobStatus; transactionHash?: Hash };
