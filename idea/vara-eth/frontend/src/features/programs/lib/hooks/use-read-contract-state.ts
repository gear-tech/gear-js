import { useQuery } from '@tanstack/react-query';
import { Hex, isAddress } from 'viem';

import { useMirrorContract, useApi } from '@/app/api';

const useReadContractState = (programId: Hex) => {
  const { data: api } = useApi();

  const mirrorContract = useMirrorContract(programId);

  return useQuery({
    queryKey: ['program', programId, mirrorContract],
    queryFn: async () => {
      const hash = await mirrorContract!.stateHash();

      return api!.query.program.readState(hash);
    },
    enabled: Boolean(mirrorContract && api && isAddress(programId)),
  });
};

export { useReadContractState };
