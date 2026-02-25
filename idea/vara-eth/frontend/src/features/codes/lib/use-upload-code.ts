import { useMutation } from '@tanstack/react-query';
// import { generatePath, useNavigate } from 'react-router-dom';

import { useVaraEthApi } from '@/app/providers';
// import { useAddMyActivity } from '@/app/store';
// import { TransactionTypes, unpackReceipt } from '@/app/store/my-activity';
// import { routes } from '@/shared/config';

export const useUploadCode = () => {
  const { api } = useVaraEthApi();
  // const navigate = useNavigate();
  // const addMyActivity = useAddMyActivity();

  const uploadCode = async (_code: Uint8Array) => {
    if (!api) return;

    // TODO: return back when it works
    // const tx = await ethereumClient.router.requestCodeValidation(code);
    // await tx.send();
    // const isValidated = await tx.waitForCodeGotValidated();
    // const codeId = tx.codeId;
    // const receipt = await tx.getReceipt();

    // await addMyActivity({
    //   type: TransactionTypes.codeValidation,
    //   codeId,
    //   resultStatus: isValidated ? 'success' : 'error',
    //   error: isValidated ? undefined : 'validation error',
    //   ...unpackReceipt(receipt),
    // });

    // void navigate(generatePath(routes.code, { codeId }));
    await Promise.resolve();
  };

  const mutation = useMutation({ mutationFn: uploadCode });

  return mutation;
};
