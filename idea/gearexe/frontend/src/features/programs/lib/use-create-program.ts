import { useMutation } from '@tanstack/react-query';
import { generatePath, useNavigate } from 'react-router-dom';

import { useRouterContract } from '@/app/api/use-router-contract';
import { useGearExeApi } from '@/app/providers';
import { useAddMyActivity, TransactionTypes, unpackReceipt } from '@/app/store';
import { routes } from '@/shared/config';

export const useCreateProgram = () => {
  const { api } = useGearExeApi();
  const navigate = useNavigate();
  const addMyActivity = useAddMyActivity();

  const { routerContract } = useRouterContract();

  const createProgram = async (codeId: string) => {
    console.log('createProgram', codeId, api, routerContract);
    if (!api || !routerContract) return;

    const result: { id: string; blockNumber: number } = await routerContract.createProgram(codeId);
    const { id, blockNumber } = result;

    addMyActivity({
      type: TransactionTypes.createProgram,
      programId: id,
      blockNumber: blockNumber,
      ...unpackReceipt(),
    });

    navigate(generatePath(routes.program, { programId: id }));
  };

  const mutation = useMutation({ mutationFn: createProgram });

  return mutation;
};
