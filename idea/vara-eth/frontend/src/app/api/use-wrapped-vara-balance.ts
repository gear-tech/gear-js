import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import type { Hex } from 'viem';
import { useConnection } from 'wagmi';

import { useApi } from '@/app/api';
import { nodeAtom } from '@/app/store';

type WrappedVaraBalance =
  | {
      value: undefined;
      decimals: undefined;
      isPending: true;
    }
  | {
      value: bigint;
      decimals: number;
      isPending: false;
    };

const useWrappedVaraBalance = (address?: Hex) => {
  const ethAccount = useConnection();
  const { data: api } = useApi();
  const { ethChainId } = useAtomValue(nodeAtom);

  const targetAddress = address || ethAccount.address;

  const value = useQuery({
    queryKey: ['wrappedVaraBalance', ethChainId, targetAddress],
    queryFn: () => {
      if (!targetAddress) throw new Error('Address is required');
      return api?.eth.wvara.balanceOf(targetAddress);
    },
    select: (response) => (response !== undefined ? BigInt(response) : undefined),
    enabled: Boolean(api && targetAddress && ethChainId),
  });

  const decimals = useQuery({
    queryKey: ['wrappedVaraDecimals', ethChainId],
    queryFn: () => api?.eth.wvara.decimals(),
    select: (response) => Number(response),
    enabled: Boolean(api && ethChainId),
  });

  return {
    value: value.data,
    decimals: decimals.data,
    isPending: value.isPending || decimals.isPending,
  } as WrappedVaraBalance;
};

export { useWrappedVaraBalance };
