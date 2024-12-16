import { StatusResponse, VerifyParameters } from './types';

const verifyCode = (parameters: VerifyParameters) => Promise.resolve({ id: '1' });

const getVerificationStatus = (id: string) =>
  Promise.resolve({ status: 'pending', created_at: 0, failed_reason: null } as unknown as StatusResponse);

const getVerifiedCode = (id: string) => Promise.resolve({ code: 'code' });

export { verifyCode, getVerificationStatus, getVerifiedCode };
