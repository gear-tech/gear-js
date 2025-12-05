import { useQuery } from '@tanstack/react-query';
import { getMirrorClient } from '@vara-eth/api';
import type { Address } from 'viem';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';

const useMirrorContract = (mirrorAddress: Address) => {
  const ethAccount = useAccount();
  const { data: walletClient } = useWalletClient({ chainId: ethAccount.chain?.id });
  const publicClient = usePublicClient({ chainId: ethAccount.chain?.id });

  return useQuery({
    queryKey: ['mirrorContract', mirrorAddress, ethAccount.chain?.id, walletClient?.account?.address],
    queryFn: () => {
      if (!walletClient || !publicClient) {
        return null;
      }

      return getMirrorClient(mirrorAddress, walletClient, publicClient);
    },
    enabled: Boolean(walletClient && publicClient && mirrorAddress),
  });
};

export { useMirrorContract };
