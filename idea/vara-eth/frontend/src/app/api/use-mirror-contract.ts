import { getMirrorClient } from '@vara-eth/api';
import { useMemo } from 'react';
import type { Address } from 'viem';
import { usePublicClient } from 'wagmi';

import { useSigner } from './use-signer';

const useMirrorContract = (address: Address) => {
  const publicClient = usePublicClient();
  const signer = useSigner();

  return useMemo(() => {
    if (!publicClient) return;

    return getMirrorClient({ address, signer, publicClient });
  }, [address, publicClient, signer]);
};

export { useMirrorContract };
