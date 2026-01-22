import { useMutation } from '@tanstack/react-query';
import { HexString } from '@vara-eth/api';
import { Sails } from 'sails-js';

import { useMirrorContract } from '@/app/api';
import { TransactionTypes, unpackReceipt, useAddMyActivity } from '@/app/store';

type InitProgramParams = {
  ctorName: string;
  payload: HexString;
};

const useInitProgram = (programId: HexString, sails: Sails | undefined) => {
  const { data: mirrorContract } = useMirrorContract(programId);
  const addMyActivity = useAddMyActivity();

  const initProgram = async ({ ctorName, payload }: InitProgramParams) => {
    if (!mirrorContract || !sails) return;

    // TODO: would be better to return non-encoded payload from schema,
    // but for now to not change gear idea implementation we have to decode encoded value here
    const args: unknown[] = sails.ctors[ctorName]?.decodePayload(payload);

    const tx = await mirrorContract.sendMessage(payload);

    await tx.send();

    const receipt = await tx.getReceipt();

    return addMyActivity({
      type: TransactionTypes.initProgram,
      programId,
      params: { ctorName, ...args },
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
