import { useMutation } from '@tanstack/react-query';
import { HexString } from 'gearexe';
import { useAccount } from 'wagmi';

import { useMirrorContract } from '@/app/api';
import { useGearExeApi } from '@/app/providers';
import { TransactionTypes, unpackReceipt, useAddMyActivity } from '@/app/store';

export const useExecutableBalanceTopUp = (programId: HexString) => {
  const { api } = useGearExeApi();
  const addMyActivity = useAddMyActivity();
  const ethAccount = useAccount();
  const { mirrorContract } = useMirrorContract(programId);

  const executableBalanceTopUp = async (value: bigint) => {
    if (!api || !mirrorContract || !ethAccount.address) return;
    const result = await mirrorContract.executableBalanceTopUp(value);

    addMyActivity({
      type: TransactionTypes.executableBalanceTopUp,
      value: String(result.value),
      programId,
      ...unpackReceipt(),
    });

    return value;
  };

  const mutation = useMutation({ mutationFn: executableBalanceTopUp });

  return mutation;
};
