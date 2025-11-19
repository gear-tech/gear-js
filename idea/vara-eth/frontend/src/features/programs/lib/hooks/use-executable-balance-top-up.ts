import { useMutation } from '@tanstack/react-query';
import { HexString } from '@vara-eth/api';
import { useAccount } from 'wagmi';

import { useMirrorContract } from '@/app/api';
import { useVaraEthApi } from '@/app/providers';
import { TransactionTypes, unpackReceipt, useAddMyActivity } from '@/app/store';

export const useExecutableBalanceTopUp = (programId: HexString) => {
  const { api } = useVaraEthApi();
  const addMyActivity = useAddMyActivity();
  const ethAccount = useAccount();
  const { mirrorContract } = useMirrorContract(programId);

  const executableBalanceTopUp = async (value: bigint) => {
    if (!api || !mirrorContract || !ethAccount.address) return;
    const tx = await mirrorContract.executableBalanceTopUp(value);
    await tx.send();
    const receipt = await tx.getReceipt();

    addMyActivity({
      type: TransactionTypes.executableBalanceTopUp,
      value: String(value),
      programId,
      ...unpackReceipt(receipt),
    });

    return value;
  };

  const mutation = useMutation({ mutationFn: executableBalanceTopUp });

  return mutation;
};
