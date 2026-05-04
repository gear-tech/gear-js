import { useMutation } from '@tanstack/react-query';
import type { Sails } from 'sails-js';
import type { Hex } from 'viem';

import { useApi } from '@/app/api';
import { TransactionTypes, useAddMyActivity } from '@/app/store';
import type { FormattedPayloadValue } from '@/features/sails/lib';

type SendMessageParams = {
  serviceName: string;
  messageName: string;
  payload: FormattedPayloadValue;
};

const useSendInjectedTransaction = (programId: Hex, sails: Sails | undefined) => {
  const { data: api } = useApi();
  const addMyActivity = useAddMyActivity();

  const sendInjectedTransaction = async ({ serviceName, messageName, payload }: SendMessageParams) => {
    if (!sails || !api) return;

    const sailsMessage = sails?.services[serviceName].functions[messageName];

    const params = payload.formatted;

    const tx = await api.createInjectedTransaction({
      destination: programId,
      payload: payload.encoded,
      value: 0n,
    });

    const response = await tx.sendAndWaitForPromise();

    await addMyActivity({
      type: TransactionTypes.injectedTx,
      serviceName,
      messageName,
      hash: response.txHash,
      to: programId,
      params: { payload: `${messageName} (${params})` },
    });

    const { value, code } = response;

    const result: Record<string, unknown> = sailsMessage.decodeResult(response.payload);

    await addMyActivity({
      type: TransactionTypes.injectedTxResponse,
      serviceName,
      messageName,
      replyCode: code.isSuccess ? 'success' : 'error',
      from: programId,
      params: { payload: JSON.stringify(result) },
      value: String(value),
    });

    return response;
  };

  return useMutation({
    mutationKey: ['sendInjectedTransaction', programId],
    mutationFn: sendInjectedTransaction,
  });
};

export { useSendInjectedTransaction };
