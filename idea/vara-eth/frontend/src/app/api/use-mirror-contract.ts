import { useQuery } from '@tanstack/react-query';
import { getMirrorClient } from '@vara-eth/api';
import { DynamicSigner, walletClientToSigner } from '@vara-eth/api/signer';
import { useRef } from 'react';
import type { Address } from 'viem';
import { usePublicClient, useWalletClient } from 'wagmi';

const useMirrorContract = (address: Address) => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const walletClientRef = useRef(walletClient);
  walletClientRef.current = walletClient;

  return useQuery({
    queryKey: ['mirrorContract', address, publicClient?.uid],

    queryFn: () =>
      getMirrorClient({
        address,
        signer: new DynamicSigner(() =>
          walletClientRef.current ? walletClientToSigner(walletClientRef.current) : undefined,
        ),
        publicClient: publicClient!,
      }),

    enabled: Boolean(publicClient),
  });
};

export { useMirrorContract };
