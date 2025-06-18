import { useMutation } from '@tanstack/react-query';
import { HexString } from 'gear-js-util';
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
    const tx = await mirrorContract.executableBalanceTopUp(value);
    const result = await tx.send();

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
