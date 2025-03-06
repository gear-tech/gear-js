import { useMutation } from '@tanstack/react-query';
import { HexString } from 'gearexe';

import { useMirrorContract } from '@/app/api';
import { TransactionTypes, unpackReceipt, useAddMyActivity } from '@/app/store';

// TODO: use idl from the program
import counterIdl from '../../../../../../../apis/gearexe/programs/counter-idl/counter.idl?raw';

import { useSails } from './use-sails';

type InitProgramParams = {
  ctorName: string;
  args: unknown[];
};

const useInitProgram = (programId: HexString) => {
  const { data: sails } = useSails(counterIdl);
  const { mirrorContract } = useMirrorContract(programId);
  const addMyActivity = useAddMyActivity();

  const initProgram = async ({ ctorName, args }: InitProgramParams) => {
    if (!mirrorContract || !sails) return;

    const payload = sails.ctors[ctorName]?.encodePayload(...args);

    if (!payload) return;

    const { waitForReply } = await mirrorContract.sendMessage(payload, 0n);

    await waitForReply;

    addMyActivity({
      type: TransactionTypes.initProgram,
      programId,
      ...unpackReceipt(),
    });
  };

  const { mutate: initProgramMutation, isPending } = useMutation({
    mutationKey: ['initProgram', programId],
    mutationFn: initProgram,
  });

  return { initProgram: initProgramMutation, isPending };
};

export { useInitProgram };
