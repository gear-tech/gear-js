import { useQuery } from '@tanstack/react-query';
import { HexString } from '@vara-eth/api';
import { isAddress } from 'viem';

import { useMirrorClient, useVaraEthApi } from '@/app/providers';

const useReadContractState = (programId: HexString) => {
  const { api } = useVaraEthApi();
  const mirrorContract = useMirrorClient(programId);

  return useQuery({
    queryKey: ['program', programId],
    queryFn: async () => {
      const hash = await mirrorContract!.stateHash();

      return api!.query.program.readState(hash);
    },
    enabled: Boolean(mirrorContract && api && isAddress(programId)),
  });
};

export { useReadContractState };
