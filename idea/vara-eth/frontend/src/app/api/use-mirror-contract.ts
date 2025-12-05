import { getMirrorClient } from '@vara-eth/api';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import { useWalletClient, usePublicClient } from 'wagmi';

const useMirrorContract = (mirrorAddress: Address) => {
  const ethAccount = useAccount();
  const { data: walletClient } = useWalletClient({ chainId: ethAccount.chain?.id });
  const publicClient = usePublicClient({ chainId: ethAccount.chain?.id });

  if (!walletClient || !publicClient) {
    return { mirrorContract: null, isLoading: true };
  }

  const mirrorContract = getMirrorClient(mirrorAddress, walletClient, publicClient);
  return { mirrorContract, isLoading: false };
};

export { useMirrorContract };
