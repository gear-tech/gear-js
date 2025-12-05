import { useMutation } from '@tanstack/react-query';
import { generatePath, useNavigate } from 'react-router-dom';

import { useEthereumClient } from '@/app/api';
import { useVaraEthApi } from '@/app/providers';
import { useAddMyActivity } from '@/app/store';
import { TransactionTypes, unpackReceipt } from '@/app/store/my-activity';
import { routes } from '@/shared/config';

export const useUploadCode = () => {
  const { api } = useVaraEthApi();
  const navigate = useNavigate();
  const addMyActivity = useAddMyActivity();

  const { data: ethereumClient } = useEthereumClient();

  const uploadCode = async (code: Uint8Array) => {
    if (!api || !ethereumClient) return;

    const tx = await ethereumClient.router.requestCodeValidation(code);
    await tx.send();
    const isValidated = await tx.waitForCodeGotValidated();
    const codeId = tx.codeId;
    const receipt = await tx.getReceipt();

    addMyActivity({
      type: TransactionTypes.codeValidation,
      codeId,
      resultStatus: isValidated ? 'success' : 'error',
      error: isValidated ? undefined : 'validation error',
      ...unpackReceipt(receipt),
    });

    void navigate(generatePath(routes.code, { codeId }));
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
