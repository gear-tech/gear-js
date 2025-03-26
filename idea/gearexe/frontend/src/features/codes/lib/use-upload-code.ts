import { useMutation } from '@tanstack/react-query';
import { generatePath, useNavigate } from 'react-router-dom';

import { useRouterContract } from '@/app/api/use-router-contract';
import { useGearExeApi } from '@/app/providers';
import { useAddMyActivity } from '@/app/store';
import { TransactionTypes, unpackReceipt } from '@/app/store/my-activity';
import { routes } from '@/shared/config';

export const useUploadCode = () => {
  const { api } = useGearExeApi();
  const navigate = useNavigate();
  const addMyActivity = useAddMyActivity();

  const { routerContract } = useRouterContract();

  const uploadCode = async (code: Uint8Array) => {
    if (!api || !routerContract) return;

    const result = await routerContract.requestCodeValidation(code);

    if (!result) return;
    const { codeId, receipt, waitForCodeGotValidated } = result;
    const isValidated = await waitForCodeGotValidated();

    addMyActivity({
      type: TransactionTypes.codeValidation,
      codeId,
      resultStatus: isValidated ? 'success' : 'error',
      error: isValidated ? undefined : 'validation error',
      ...unpackReceipt(receipt),
    });

    navigate(generatePath(routes.code, { codeId: result.codeId }));
  };

  const onError = (error: Error) => {
    console.error(error);
    addMyActivity({
      type: TransactionTypes.codeValidation,
      error: error.name,
      resultStatus: 'error',
      codeId: '',
      ...unpackReceipt(),
    });
  };

  const mutation = useMutation({ mutationFn: uploadCode, onError });

  return mutation;
};
