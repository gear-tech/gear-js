import { useQuery } from '@tanstack/react-query';
import { getMirrorClient } from '@vara-eth/api';
import { walletClientToSigner } from '@vara-eth/api/signer';
import type { Address } from 'viem';
import { usePublicClient, useWalletClient } from 'wagmi';

const useMirrorContract = (mirrorAddress: Address) => {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ['mirrorContract', mirrorAddress, walletClient, publicClient],

    queryFn: () =>
      getMirrorClient({
        address: mirrorAddress,
        signer: walletClientToSigner(walletClient!),
        publicClient: publicClient!,
      }),

    enabled: Boolean(mirrorAddress && walletClient && publicClient),
  });
};

export { useMirrorContract };
