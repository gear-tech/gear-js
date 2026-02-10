import { useMutation } from '@tanstack/react-query';
import { Sails } from 'sails-js';
import { Hex } from 'viem';

import { useMirrorContract } from '@/app/api';
import { TransactionTypes, unpackReceipt, useAddMyActivity } from '@/app/store';
import { FormattedPayloadValue } from '@/features/sails/lib';

type SendMessageParams = {
  serviceName: string;
  messageName: string;
  isQuery: boolean;
  payload: FormattedPayloadValue;
};

const useSendProgramMessage = (programId: Hex, sails: Sails | undefined) => {
  const { data: mirrorContract } = useMirrorContract(programId);
  const addMyActivity = useAddMyActivity();

  const sendMessage = async ({ serviceName, messageName, isQuery, payload }: SendMessageParams) => {
    if (!mirrorContract || !sails) return;

    const messageKey = isQuery ? 'queries' : 'functions';
    const sailsMessage = sails?.services[serviceName][messageKey][messageName];

    const tx = await mirrorContract.sendMessage(payload.encoded);
    const response = await tx.send();
    const receipt = await tx.getReceipt();

    await addMyActivity({
      type: TransactionTypes.programMessage,
      serviceName,
      messageName,
      ...unpackReceipt(receipt),
      to: programId,
      params: { payload: `${messageName} (${payload.formatted})` },
    });

    const { waitForReply } = await tx.setupReplyListener();
    const reply = await waitForReply();

    const { replyCode, blockNumber, txHash } = reply;

    const result: Record<string, unknown> = sailsMessage.decodeResult(reply.payload);

    await addMyActivity({
      type: TransactionTypes.programReply,
      serviceName,
      messageName,
      replyCode,
      blockNumber: BigInt(blockNumber),
      from: programId,
      hash: txHash,
      params: { payload: JSON.stringify(result) },
      value: String(reply.value),
    });

    return response;
  };

  return useMutation({
    mutationKey: ['sendMessage', programId],
    mutationFn: sendMessage,
  });
};

export { useSendProgramMessage };
