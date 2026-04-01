import { useQuery } from '@tanstack/react-query';
import { type Hex, isAddress } from 'viem';

import { useApi, useMirrorContract } from '@/app/api';

const useReadContractState = (programId: Hex) => {
  const { data: api } = useApi();

  const mirrorContract = useMirrorContract(programId);

  return useQuery({
    queryKey: ['program', programId, mirrorContract],
    queryFn: async () => {
      const hash = await mirrorContract?.stateHash();

      return api?.query.program.readState(hash);
    },
    enabled: Boolean(mirrorContract && api && isAddress(programId)),
    throwOnError: (error) => {
      console.error(error);
      return false;
    },
  });
};

export { useReadContractState };
