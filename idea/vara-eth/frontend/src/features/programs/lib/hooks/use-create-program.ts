import { useMutation } from '@tanstack/react-query';
import { HexString } from '@vara-eth/api';
import { generatePath, useNavigate } from 'react-router-dom';

import { useEthereumClient, useVaraEthApi } from '@/app/providers';
import { useAddMyActivity, TransactionTypes, unpackReceipt } from '@/app/store';
import { routes } from '@/shared/config';

export const useCreateProgram = () => {
  const { api } = useVaraEthApi();
  const navigate = useNavigate();
  const addMyActivity = useAddMyActivity();

  const ethereumClient = useEthereumClient();

  const createProgram = async (codeId: HexString) => {
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
