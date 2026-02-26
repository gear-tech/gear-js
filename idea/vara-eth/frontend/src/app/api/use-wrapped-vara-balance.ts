import { useQuery } from '@tanstack/react-query';
import { Hex } from 'viem';
import { useAccount } from 'wagmi';

import { useApi } from '@/app/api';

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
  const ethAccount = useAccount();
  const { data: api } = useApi();

  const targetAddress = address || ethAccount.address;

  const value = useQuery({
    queryKey: ['wrappedVaraBalance', targetAddress],
    queryFn: () => {
      if (!targetAddress) throw new Error('Address is required');
      return api?.eth.wvara.balanceOf(targetAddress);
    },
    select: (response) => (response !== undefined ? BigInt(response) : undefined),
    enabled: Boolean(api && targetAddress),
  });

  const decimals = useQuery({
    queryKey: ['wrappedVaraDecimals'],
    queryFn: () => api?.eth.wvara.decimals(),
    select: (response) => Number(response),
    enabled: Boolean(api),
  });

  return {
    value: value.data,
    decimals: decimals.data,
    isPending: value.isPending || decimals.isPending,
  } as WrappedVaraBalance;
};

export { useWrappedVaraBalance };
