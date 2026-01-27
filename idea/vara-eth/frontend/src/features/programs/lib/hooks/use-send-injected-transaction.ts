import { useMutation } from '@tanstack/react-query';
import { HexString } from '@vara-eth/api';
import { Sails } from 'sails-js';

import { useVaraEthApi } from '@/app/providers';
import { TransactionTypes, useAddMyActivity } from '@/app/store';
import { FormattedPayloadValue } from '@/features/sails/lib';

type SendMessageParams = {
  serviceName: string;
  messageName: string;
  isQuery: boolean;
  payload: FormattedPayloadValue;
};

const useSendInjectedTransaction = (programId: HexString, sails: Sails | undefined) => {
  const { api } = useVaraEthApi();
  const addMyActivity = useAddMyActivity();

  const sendInjectedTransaction = async ({ serviceName, messageName, isQuery, payload }: SendMessageParams) => {
    if (!sails || !api) return;

    const messageKey = isQuery ? 'queries' : 'functions';
    const sailsMessage = sails?.services[serviceName][messageKey][messageName];
    // const args = Object.values(payload.decoded);

    const params = payload.formatted;

    const tx = await api.createInjectedTransaction({
      destination: programId,
      payload: payload.encoded,
      value: 0n,
    });

    const response = await tx.sendAndWaitForPromise();

    addMyActivity({
      type: TransactionTypes.programMessage,
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
      // TODO: fix this once code is of type ReplyCode
      replyCode: code.startsWith('0x00') ? 'success' : 'error',
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
