import { HexString } from '@gear-js/api';
import { useQuery } from '@tanstack/react-query';

import { getVerifiedCode } from './requests';

function useIsCodeVerified(codeId: HexString | null | undefined) {
  return useQuery({
    queryKey: ['code-verification-status', codeId],
    queryFn: () => getVerifiedCode(codeId!),
    select: ({ code }) => Boolean(code),
    enabled: Boolean(codeId),
  });
}

export { useIsCodeVerified };
