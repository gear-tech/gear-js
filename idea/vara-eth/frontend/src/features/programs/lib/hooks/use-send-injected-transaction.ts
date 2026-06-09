import { useMutation } from '@tanstack/react-query';
import { InjectedTxReceipt } from '@vara-eth/api';
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

    // sendAndWaitForPromise returns InjectedTxReceipt on versioned nodes (testnet)
    // and InjectedTxPromise on legacy nodes (mainnet). Normalise to a common shape.
    const txHash = response.txHash;
    let replyPayload: Hex;
    let value: bigint;
    let isSuccess: boolean;

    if (response instanceof InjectedTxReceipt) {
      if (response.error !== null) throw new Error(response.error);
      replyPayload = response.promise.payload;
      value = response.promise.value;
      isSuccess = response.promise.code.isSuccess;
    } else {
      replyPayload = response.payload;
      value = response.value;
      isSuccess = response.code.isSuccess;
    }

    await addMyActivity({
      type: TransactionTypes.injectedTx,
      serviceName,
      messageName,
      hash: txHash,
      to: programId,
      params: { payload: `${messageName} (${params})` },
    });

    const result: Record<string, unknown> = sailsMessage.decodeResult(replyPayload);

    await addMyActivity({
      type: TransactionTypes.injectedTxResponse,
      serviceName,
      messageName,
      replyCode: isSuccess ? 'success' : 'error',
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
