import type { Hex } from 'viem';

import { fetchWithGuard } from '@/shared/utils';

export type JobStatus = 'pending' | 'processing' | 'success' | 'failed';

export type RequestCodeValidationParams = {
  readonly code: Hex;
  readonly codeId: Hex;
  readonly sender: Hex;
  readonly blobHashes: Hex[];
  readonly deadline: number;
  readonly wvaraPermitSignature: Hex;
  readonly requestCodeValidationSignature: Hex;
};

export type Code = {
  id: Hex;
  status: string;
  createdAt: string;
};

export type RequestCodeValidationResponse = {
  jobId: string;
};

export type RequestCodeValidationStatusResponse = {
  status: JobStatus;
  error?: string;
};

export const getCode = (explorerUrl: string, id: Hex) => fetchWithGuard<Code>({ url: `${explorerUrl}/codes/${id}` });

export const requestCodeValidation = (serviceUrl: string, network: string, parameters: RequestCodeValidationParams) =>
  fetchWithGuard<RequestCodeValidationResponse>({
    url: `${serviceUrl}/${network}/request-code-validation`,
    method: 'POST',
    parameters,
  });

export const getCodeValidationStatus = (serviceUrl: string, jobId: string) =>
  fetchWithGuard<RequestCodeValidationStatusResponse>({
    url: `${serviceUrl}/status?jobId=${jobId}`,
  });
