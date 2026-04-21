import { createHash } from 'node:crypto';

export const generateJobId = (codeId: string) => {
  return createHash('sha256').update(codeId).digest('base64url');
};
