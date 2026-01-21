import { useMutation } from '@tanstack/react-query';
import { HexString } from '@vara-eth/api';

import { useMirrorContract } from '@/app/api';
import { TransactionTypes, unpackReceipt, useAddMyActivity } from '@/app/store';

import { useSails } from './use-sails';

type InitProgramParams = {
  ctorName: string;
  payload: HexString;
};

const useInitProgram = (programId: HexString, idl: string) => {
  const { data: sails } = useSails(idl);
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

    addMyActivity({
      type: TransactionTypes.initProgram,
      programId,
      params: { ctorName, ...args },
      to: programId,
      ...unpackReceipt(receipt),
    });
  };

  const { mutate: initProgramMutation, isPending } = useMutation({
    mutationKey: ['initProgram', programId],
    mutationFn: initProgram,
  });

  return { initProgram: initProgramMutation, isPending };
};

export { useInitProgram };
