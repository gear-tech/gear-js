import { createHash } from 'node:crypto';

import { BaseError } from 'viem';

export const generateJobId = (network: string, codeId: string): string => {
  return createHash('sha256').update(`${network}:${codeId}`).digest('base64url');
};

export function serializeError(err: unknown): unknown {
  if (err instanceof BaseError) {
    return {
      name: err.name,
      shortMessage: err.shortMessage,
      details: err.details,
      metaMessages: err.metaMessages,
      cause: serializeError(err.cause),
    };
  }
  if (err instanceof Error) {
    return { name: err.name, message: err.message, cause: serializeError((err as NodeJS.ErrnoException).cause) };
  }
  return err;
}
