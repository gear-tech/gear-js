import { useMutation } from '@tanstack/react-query';
import { HexString } from '@vara-eth/api';
import { Sails } from 'sails-js';

import { useMirrorContract } from '@/app/api';
import { TransactionTypes, unpackReceipt, useAddMyActivity } from '@/app/store';
import { FormattedPayloadValue } from '@/features/sails/lib';

type InitProgramParams = {
  ctorName: string;
  payload: FormattedPayloadValue;
};

const useInitProgram = (programId: HexString, sails: Sails | undefined) => {
  const { data: mirrorContract } = useMirrorContract(programId);
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
      to: programId,
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
