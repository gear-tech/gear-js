import { useMutation } from '@tanstack/react-query';
import { generatePath, useNavigate } from 'react-router-dom';
import { Hex } from 'viem';

import { useApi } from '@/app/api';
import { useAddMyActivity, TransactionTypes, unpackReceipt } from '@/app/store';
import { routes } from '@/shared/config';

export const useCreateProgram = () => {
  const { data: api } = useApi();
  const navigate = useNavigate();
  const addMyActivity = useAddMyActivity();

  const createProgram = async (codeId: Hex) => {
    if (!api) return;

    const tx = await api.eth.router.createProgram(codeId);
    await tx.send();
    const id = await tx.getProgramId();
    const receipt = await tx.getReceipt();

    await addMyActivity({
      type: TransactionTypes.createProgram,
      programId: id,
      ...unpackReceipt(receipt),
    });

    void navigate(generatePath(routes.program, { programId: id }));
  };

  const mutation = useMutation({ mutationFn: createProgram });

  return mutation;
};
