import { createHash } from 'node:crypto';

export const generateJobId = (codeId: string, blobHash: string) => {
  const hash = createHash('sha256');
  hash.update(codeId + blobHash);
  return hash.digest('base64url');
};
