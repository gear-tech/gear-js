import { useMutation } from '@tanstack/react-query';
import { generatePath, useNavigate } from 'react-router-dom';
import { Hex } from 'viem';

import { useEthereumClient } from '@/app/api';
import { useVaraEthApi } from '@/app/providers';
import { useAddMyActivity, TransactionTypes, unpackReceipt } from '@/app/store';
import { routes } from '@/shared/config';

export const useCreateProgram = () => {
  const { api } = useVaraEthApi();
  const navigate = useNavigate();
  const addMyActivity = useAddMyActivity();

  const { data: ethereumClient } = useEthereumClient();

  const createProgram = async (codeId: Hex) => {
    if (!api || !ethereumClient) return;

    const tx = await ethereumClient.router.createProgram(codeId);
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
