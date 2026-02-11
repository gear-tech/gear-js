import { useQuery } from '@tanstack/react-query';
import { Hex, isAddress } from 'viem';

import { useMirrorContract } from '@/app/api';
import { useVaraEthApi } from '@/app/providers';

const useReadContractState = (programId: Hex) => {
  const { api } = useVaraEthApi();

  const { data: mirrorContract } = useMirrorContract(programId);

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
