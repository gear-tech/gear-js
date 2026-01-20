import { useMutation } from '@tanstack/react-query';
import { HexString } from '@vara-eth/api';

import { useVaraEthApi } from '@/app/providers';
import { TransactionTypes, unpackReceipt, useAddMyActivity } from '@/app/store';

import { useSails } from './use-sails';

type SendMessageParams = {
  serviceName: string;
  messageName: string;
  isQuery: boolean;
  args: unknown[];
};

const useSendInjectedTransaction = (programId: HexString, idl: string) => {
  const { data: sails } = useSails(idl);
  const { api } = useVaraEthApi();
  const addMyActivity = useAddMyActivity();

  const sendInjectedTransaction = async ({ serviceName, messageName, isQuery, args }: SendMessageParams) => {
    if (!sails || !api) return;

    const messageKey = isQuery ? 'queries' : 'functions';
    const sailsMessage = sails?.services[serviceName][messageKey][messageName];
    const _payload = sailsMessage.encodePayload(...args);

    const tx = await api.createInjectedTransaction({
      destination: programId,
      payload: _payload,
      value: 0n,
    });

    const response = await tx.sendAndWaitForPromise();

    const promise = response;
    const params = args.map((_value, index) => {
      const key = sailsMessage.args[index].name;
      return `${key}: ${String(_value)}`;
    });

    addMyActivity({
      type: TransactionTypes.programMessage,
      serviceName,
      messageName,
      ...unpackReceipt(),
      hash: promise.txHash,
      to: programId,
      params: { payload: `${messageName} (${params.join(', ')})` },
    });

    const { payload, value, code } = promise;

    const result: Record<string, unknown> = sailsMessage.decodeResult(payload);

    addMyActivity({
      type: TransactionTypes.programReply,
      serviceName,
      messageName,
      // TODO: fix this once code is of type ReplyCode
      replyCode: code.startsWith('0x00') ? 'Success' : 'Error',
      ...unpackReceipt(),
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
