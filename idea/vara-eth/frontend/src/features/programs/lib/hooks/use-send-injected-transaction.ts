import { useMutation } from '@tanstack/react-query';
import { HexString } from '@vara-eth/api';

import { useVaraEthApi } from '@/app/providers';
import { TransactionTypes, unpackReceipt, useAddMyActivity } from '@/app/store';

// TODO: use idl of the program
import counterIdl from '../../../../../../../../apis/vara-eth/programs/counter-idl/counter.idl?raw';

import { useSails } from './use-sails';

type SendMessageParams = {
  serviceName: string;
  messageName: string;
  isQuery: boolean;
  args: unknown[];
};

const useSendInjectedTransaction = (programId: HexString) => {
  const { data: sails } = useSails(counterIdl);
  const { api } = useVaraEthApi();
  const addMyActivity = useAddMyActivity();

  const sendMessage = async ({ serviceName, messageName, isQuery, args }: SendMessageParams) => {
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
    const { reply, txHash } = response;
    const params = args.map((_value, index) => {
      const key = sailsMessage.args[index].name;
      return `${key}: ${String(_value)}`;
    });

    addMyActivity({
      type: TransactionTypes.programMessage,
      serviceName,
      messageName,
      ...unpackReceipt(),
      hash: txHash,
      to: programId,
      params: { payload: `${messageName} (${params.join(', ')})` },
    });

    const { payload, value, code } = reply;

    const result: Record<string, unknown> = sailsMessage.decodeResult(payload);

    addMyActivity({
      type: TransactionTypes.programReply,
      serviceName,
      messageName,
      replyCode: 'Success' in code ? 'Success' : 'Error',
      ...unpackReceipt(),
      from: programId,
      params: { payload: JSON.stringify(result) },
      value: String(value),
    });
    return response;
  };

  const { mutate: sendMessageMutation, isPending } = useMutation({
    mutationKey: ['sendMessage', programId],
    mutationFn: sendMessage,
  });

  return { sendInjectedTransaction: sendMessageMutation, isPending };
};

export { useSendInjectedTransaction };
