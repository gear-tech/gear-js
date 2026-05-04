import type { Address, Hash, Hex } from 'viem';

export type NetworkConfig = {
  readonly name: string;
  readonly routerAddress: Address;
  readonly ethereumRpcUrl: string;
  readonly privateKey: Hash;
};

export type RequestCodeValidationParams = {
  readonly code: Hex;
  readonly codeId: Hash;
  readonly sender: Address;
  readonly blobHashes: Hash[];
  readonly deadline: number;
  readonly wvaraPermitSignature: Hex;
  readonly requestCodeValidationSignature: Hex;
};

export type JobStatus = 'pending' | 'processing' | 'success' | 'failed';

export type DbRequest = RequestCodeValidationParams & { status: JobStatus; transactionHash?: Hash };
