import { fetchWithGuard } from '@/shared/helpers';

import { API_URL } from './consts';
import { CodeResponse, StatusResponse, VerifyParameters, VerifyResponse } from './types';

const verifyCode = (parameters: VerifyParameters) =>
  fetchWithGuard<VerifyResponse>(`${API_URL}/verify`, 'POST', parameters);

const getVerificationStatus = (id: string) =>
  fetchWithGuard<StatusResponse>(`${API_URL}/verify/status?id=${id}`, 'GET');

const getVerifiedCode = (id: string) => fetchWithGuard<CodeResponse>(`${API_URL}/code?id=${id}`, 'GET');

export { verifyCode, getVerificationStatus, getVerifiedCode };
