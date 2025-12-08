import { useQuery } from '@tanstack/react-query';
import { getMirrorClient } from '@vara-eth/api';
import type { Address } from 'viem';
import { usePublicClient, useWalletClient } from 'wagmi';

const useMirrorContract = (mirrorAddress: Address) => {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ['mirrorContract', mirrorAddress, walletClient, publicClient],
    queryFn: () => getMirrorClient(mirrorAddress, walletClient!, publicClient!),
    enabled: Boolean(mirrorAddress && walletClient && publicClient),
  });
};

export { useMirrorContract };
