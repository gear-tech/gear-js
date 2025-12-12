import { HexString } from '@gear-js/api';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { fetchWithGuard } from '@/shared/helpers';

const VFT_WHITELIST_API_URL = import.meta.env.VITE_VFT_WHITELIST_API_URL as string;

const getVftWhitelist = () => fetchWithGuard<HexString[]>({ url: VFT_WHITELIST_API_URL });

function useIsVftProgram(programId: HexString) {
  const isVft = useCallback((whitelist: HexString[]) => whitelist.includes(programId), [programId]);

  return useQuery({
    queryKey: ['vft-whitelist'],
    queryFn: getVftWhitelist,
    select: isVft,
  });
}

export { useIsVftProgram };
