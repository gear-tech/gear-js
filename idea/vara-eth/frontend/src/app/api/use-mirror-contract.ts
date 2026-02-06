import { useQuery } from '@tanstack/react-query';
import { getMirrorClient } from '@vara-eth/api';
import { walletClientToSigner } from '@vara-eth/api/signer';
import type { Address } from 'viem';
import { usePublicClient, useWalletClient } from 'wagmi';

const useMirrorContract = (address: Address) => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  return useQuery({
    queryKey: ['mirrorContract', address, publicClient?.uid, walletClient?.uid],

    queryFn: () =>
      getMirrorClient({
        address,
        signer: walletClient ? walletClientToSigner(walletClient) : undefined,
        publicClient: publicClient!,
      }),

    enabled: Boolean(publicClient),
  });
};

export { useMirrorContract };
