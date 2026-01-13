import { useQuery } from '@tanstack/react-query';
import { HexString } from '@vara-eth/api';
import { useAccount } from 'wagmi';

import { useEthereumClient } from './use-ethereum-client';

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

const useWrappedVaraBalance = (address?: HexString) => {
  const ethAccount = useAccount();
  const { data: ethereumClient } = useEthereumClient();

  const targetAddress = address || ethAccount.address;

  const value = useQuery({
    queryKey: ['wrappedVaraBalance', targetAddress],
    queryFn: () => ethereumClient?.wvara.balanceOf(targetAddress!),
    select: (response) => (response !== undefined ? BigInt(response) : undefined),
    enabled: Boolean(ethereumClient && targetAddress),
  });

  const decimals = useQuery({
    queryKey: ['wrappedVaraDecimals'],
    queryFn: () => ethereumClient?.wvara.decimals(),
    select: (response) => Number(response),
    enabled: Boolean(ethereumClient),
  });

  return {
    value: value.data,
    decimals: decimals.data,
    isPending: value.isPending || decimals.isPending,
  } as WrappedVaraBalance;
};

export { useWrappedVaraBalance };
