import { useQuery } from '@tanstack/react-query';
import { HexString } from 'gearexe';
import { useAccount } from 'wagmi';

import { useWrappedVaraContract } from './use-wrapped-vara-contract';

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
  const { wrappedVaraContract } = useWrappedVaraContract();

  const targetAddress = address || ethAccount.address;

  const value = useQuery({
    queryKey: ['wrappedVaraBalance', targetAddress],
    queryFn: () => wrappedVaraContract?.balanceOf(targetAddress!),
    select: (response) => (response !== undefined ? BigInt(response) : undefined),
    enabled: Boolean(wrappedVaraContract && targetAddress),
  });

  const decimals = useQuery({
    queryKey: ['wrappedVaraDecimals'],
    queryFn: () => wrappedVaraContract?.decimals(),
    select: (response) => Number(response),
    enabled: Boolean(wrappedVaraContract),
  });

  return {
    value: value.data,
    decimals: decimals.data,
    isPending: value.isPending || decimals.isPending,
  } as WrappedVaraBalance;
};

export { useWrappedVaraBalance };
