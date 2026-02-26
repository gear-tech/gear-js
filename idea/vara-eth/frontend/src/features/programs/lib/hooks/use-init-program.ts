import { useMutation } from '@tanstack/react-query';
import { Sails } from 'sails-js';
import { Hex } from 'viem';

import { useMirrorContract } from '@/app/api';
import { TransactionTypes, unpackReceipt, useAddMyActivity } from '@/app/store';
import { FormattedPayloadValue } from '@/features/sails/lib';

type InitProgramParams = {
  ctorName: string;
  payload: FormattedPayloadValue;
};

const useInitProgram = (programId: Hex, sails: Sails | undefined) => {
  const mirrorContract = useMirrorContract(programId);
  const addMyActivity = useAddMyActivity();

  const initProgram = async ({ ctorName, payload }: InitProgramParams) => {
    if (!mirrorContract || !sails) return;

    const tx = await mirrorContract.sendMessage(payload.encoded);

    await tx.send();

    const receipt = await tx.getReceipt();

    return addMyActivity({
      type: TransactionTypes.initProgram,
      programId,
      params: { payload: `${ctorName} (${payload.formatted})` },
      ...unpackReceipt(receipt),
      to: programId,
    });
  };

  return useMutation({
    mutationKey: ['initProgram', programId],
    mutationFn: initProgram,
  });
};

export { useInitProgram };
