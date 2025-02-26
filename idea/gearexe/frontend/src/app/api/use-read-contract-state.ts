import { useQuery } from '@tanstack/react-query';
import { isAddress } from 'ethers';
import { HexString } from 'gearexe';

import { useGearExeApi } from '../providers';

import { useMirrorContract } from './use-mirror-contract';

const useReadContractState = (programId: HexString) => {
  const { api } = useGearExeApi();

  const { mirrorContract } = useMirrorContract(programId);

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
