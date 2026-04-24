import { useMutation } from '@tanstack/react-query';
import { generatePath, useNavigate } from 'react-router-dom';
import type { Address, Hex } from 'viem';

import { useApi } from '@/app/api';
import { TransactionTypes, unpackReceipt, useAddMyActivity } from '@/app/store';
import { routes } from '@/shared/config';

export const useCreateProgram = () => {
  const { data: api } = useApi();
  const navigate = useNavigate();
  const addMyActivity = useAddMyActivity();

  const createProgram = async ({ codeId, abiAddress }: { codeId: Hex; abiAddress?: Address }) => {
    if (!api) return;

    const tx = abiAddress
      ? await api.eth.router.createProgramWithAbiInterface(codeId, abiAddress)
      : await api.eth.router.createProgram(codeId);
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
