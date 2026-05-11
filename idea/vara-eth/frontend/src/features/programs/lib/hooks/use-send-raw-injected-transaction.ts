import { useMutation } from '@tanstack/react-query';
import type { Hex } from 'viem';

import { useApi } from '@/app/api';
import { TransactionTypes, useAddMyActivity } from '@/app/store';

type SendRawMessageParams = {
  payload: Hex;
};

const useSendRawInjectedTransaction = (programId: Hex) => {
  const { data: api } = useApi();
  const addMyActivity = useAddMyActivity();

  const sendRawInjectedTransaction = async ({ payload }: SendRawMessageParams) => {
    if (!api) throw new Error('API is not initialized');

    const tx = await api.createInjectedTransaction({
      destination: programId,
      payload,
      value: 0n,
    });

    const response = await tx.sendAndWaitForPromise();

    await addMyActivity({
      type: TransactionTypes.injectedTx,
      serviceName: 'Raw',
      messageName: 'Bytes',
      hash: response.txHash,
      to: programId,
      params: { payload },
    });

    const { value, code } = response;

    await addMyActivity({
      type: TransactionTypes.injectedTxResponse,
      serviceName: 'Raw',
      messageName: 'Bytes',
      replyCode: code.isSuccess ? 'success' : 'error',
      from: programId,
      params: { payload: response.payload },
      value: String(value),
    });

    return response;
  };

  return useMutation({
    mutationKey: ['sendRawInjectedTransaction', programId],
    mutationFn: sendRawInjectedTransaction,
  });
};

export { useSendRawInjectedTransaction };
