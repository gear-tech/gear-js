import { EthereumClient } from '@vara-eth/api';
import { type WebSocketTransport } from 'viem';
import { useWalletClient, usePublicClient } from 'wagmi';

export function useEthereumClient({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  const publicClient = usePublicClient({ chainId });

  if (!walletClient || !publicClient) return null;

  return new EthereumClient<WebSocketTransport>(publicClient, walletClient);
}
