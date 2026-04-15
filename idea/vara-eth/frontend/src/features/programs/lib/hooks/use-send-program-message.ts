import { useMutation } from '@tanstack/react-query';
import type { Sails } from 'sails-js';
import type { Hex } from 'viem';

import { useMirrorContract } from '@/app/api';
import { TransactionTypes, unpackReceipt, useAddMyActivity } from '@/app/store';
import type { FormattedPayloadValue } from '@/features/sails/lib';

type SendMessageParams = {
  serviceName: string;
  messageName: string;
  payload: FormattedPayloadValue;
};

const useSendProgramMessage = (programId: Hex, sails: Sails | undefined) => {
  const mirrorContract = useMirrorContract(programId);
  const addMyActivity = useAddMyActivity();

  const sendMessage = async ({ serviceName, messageName, payload }: SendMessageParams) => {
    if (!mirrorContract || !sails) return;

    const sailsMessage = sails?.services[serviceName].functions[messageName];

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
