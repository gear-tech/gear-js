import { useMutation } from '@tanstack/react-query';
import { HexString } from 'gearexe';

import { useMirrorContract } from '@/app/api';
import { TransactionTypes, unpackReceipt, useAddMyActivity } from '@/app/store';

// TODO: use idl from the program
import counterIdl from '../../../../../../../apis/gearexe/programs/counter-idl/counter.idl?raw';

import { useSails } from './use-sails';

type SendMessageParams = {
  serviceName: string;
  functionName: string;
  args: unknown[];
};

const useSendProgramMessage = (programId: HexString) => {
  const { data: sails } = useSails(counterIdl);
  const { mirrorContract } = useMirrorContract(programId);
  const addMyActivity = useAddMyActivity();

  const sendMessage = async ({ serviceName, functionName, args }: SendMessageParams) => {
    if (!mirrorContract || !sails) return;

    const _payload = sails?.services[serviceName].functions[functionName].encodePayload(...args);

    const { waitForReply } = await mirrorContract.sendMessage(_payload, 0n);

    const { payload, replyCode, value, blockNumber, txHash } = await waitForReply;

    const result: Record<string, unknown> = sails.services[serviceName].functions[functionName].decodeResult(payload);

    const params =
      typeof result === 'object'
        ? Object.fromEntries(Object.entries(result).map(([key, _value]) => [key, String(_value)]))
        : { result };

    addMyActivity({
      type: TransactionTypes.programMessage,
      serviceName,
      functionName,
      ...unpackReceipt(),
      blockNumber,
      hash: txHash,
      params,
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
