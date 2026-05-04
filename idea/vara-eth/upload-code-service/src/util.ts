import { createHash } from 'node:crypto';

export const generateJobId = (network: string, codeId: string): string => {
  return createHash('sha256').update(`${network}:${codeId}`).digest('base64url');
};
