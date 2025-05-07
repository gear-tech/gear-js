import { fetchWithGuard } from '@/shared/helpers';

import { API_URL } from './consts';
import { CodeResponse, StatusResponse, VerifyParameters, VerifyResponse } from './types';

const verifyCode = (parameters: VerifyParameters) =>
  fetchWithGuard<VerifyResponse>({
    url: `${API_URL}/verify`,
    method: 'POST',
    parameters,
  });

const getVerificationStatus = (id: string) =>
  fetchWithGuard<StatusResponse>({ url: `${API_URL}/verify/status?id=${id}` });

const getVerifiedCode = (id: string) => fetchWithGuard<CodeResponse>({ url: `${API_URL}/code?id=${id}` });

export { verifyCode, getVerificationStatus, getVerifiedCode };
