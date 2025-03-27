import { useMutation } from '@tanstack/react-query';
import { HexString } from 'gearexe';

import { useMirrorContract } from '@/app/api';
import { TransactionTypes, unpackReceipt, useAddMyActivity } from '@/app/store';

// TODO: use idl from the program
import counterIdl from '../../../../../../../apis/gearexe/programs/counter-idl/counter.idl?raw';

import { useSails } from './use-sails';

type SendMessageParams = {
  serviceName: string;
  messageName: string;
  isQuery: boolean;
  args: unknown[];
};

const useSendProgramMessage = (programId: HexString) => {
  const { data: sails } = useSails(counterIdl);
  const { mirrorContract } = useMirrorContract(programId);
  const addMyActivity = useAddMyActivity();

  const sendMessage = async ({ serviceName, messageName, isQuery, args }: SendMessageParams) => {
    if (!mirrorContract || !sails) return;

    const messageKey = isQuery ? 'queries' : 'functions';
    const sailsMessage = sails?.services[serviceName][messageKey][messageName];
    const _payload = sailsMessage.encodePayload(...args);

    const value = 0n;
    const message = await mirrorContract.sendMessage(_payload, value);

    const params = args.map((_value, index) => {
      const key = sailsMessage.args[index].name;
      return `${key}: ${String(_value)}`;
    });

    addMyActivity({
      type: TransactionTypes.programMessage,
      serviceName,
      messageName,
      ...unpackReceipt(),
      blockNumber: message.blockNumber,
      to: programId,
      hash: message.txHash,
      params: { payload: `${messageName} (${params.join(', ')})` },
      value: String(value),
    });

    const reply = await message.waitForReply;

    const { payload, replyCode, blockNumber, txHash } = reply;

    const result: Record<string, unknown> = sailsMessage.decodeResult(payload);

    addMyActivity({
      type: TransactionTypes.programReply,
      serviceName,
      messageName,
      ...unpackReceipt(),
      blockNumber,
      from: programId,
      hash: txHash,
      params: { payload: JSON.stringify(result) },
      value: String(reply.value),
    });

    return { result, replyCode, value } as const;
  };

  const { mutate: sendMessageMutation, isPending } = useMutation({
    mutationKey: ['sendMessage', programId],
    mutationFn: sendMessage,
  });

  return { sendMessage: sendMessageMutation, isPending };
};

export { useSendProgramMessage };
