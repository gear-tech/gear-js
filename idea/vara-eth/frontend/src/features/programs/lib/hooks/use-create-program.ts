import { useMutation } from '@tanstack/react-query';
import { HexString } from '@vara-eth/api';
import { generatePath, useNavigate } from 'react-router-dom';

import { useRouterContract } from '@/app/api/use-router-contract';
import { useVaraEthApi } from '@/app/providers';
import { useAddMyActivity, TransactionTypes, unpackReceipt } from '@/app/store';
import { routes } from '@/shared/config';

export const useCreateProgram = () => {
  const { api } = useVaraEthApi();
  const navigate = useNavigate();
  const addMyActivity = useAddMyActivity();

  const { routerContract } = useRouterContract();

  const createProgram = async (codeId: HexString) => {
    console.log('createProgram', codeId, api, routerContract);
    if (!api || !routerContract) return;

    const tx = await routerContract.createProgram(codeId);
    await tx.send();
    const id = await tx.getProgramId();
    const receipt = await tx.getReceipt();

    addMyActivity({
      type: TransactionTypes.createProgram,
      programId: id,
      ...unpackReceipt(receipt),
    });

    void navigate(generatePath(routes.program, { programId: id }));
  };

  const mutation = useMutation({ mutationFn: createProgram });

  return mutation;
};
