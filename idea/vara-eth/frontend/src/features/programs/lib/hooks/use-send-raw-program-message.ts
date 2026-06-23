import { useMutation } from '@tanstack/react-query';
import type { Hex } from 'viem';

import { useMirrorContract } from '@/app/api';
import { TransactionTypes, unpackReceipt, useAddMyActivity } from '@/app/store';

type SendRawMessageParams = {
  payload: Hex;
};

const useSendRawProgramMessage = (programId: Hex) => {
  const mirrorContract = useMirrorContract(programId);
  const addMyActivity = useAddMyActivity();

  const sendRawMessage = async ({ payload }: SendRawMessageParams) => {
    if (!mirrorContract) throw new Error('Mirror contract is not initialized');

    const tx = await mirrorContract.sendMessage(payload);
    const response = await tx.send();
    const receipt = await tx.getReceipt();

    await addMyActivity({
      type: TransactionTypes.programMessage,
      serviceName: 'Raw',
      messageName: 'Bytes',
      ...unpackReceipt(receipt),
      to: programId,
      params: { payload },
    });

    const { waitForReply } = await tx.setupReplyListener();
    const reply = await waitForReply();

    const { replyCode, blockNumber, txHash } = reply;

    await addMyActivity({
      type: TransactionTypes.programReply,
      serviceName: 'Raw',
      messageName: 'Bytes',
      replyCode,
      blockNumber: BigInt(blockNumber),
      from: programId,
      hash: txHash,
      params: { payload: reply.payload },
      value: String(reply.value),
    });

    return response;
  };

  return useMutation({
    mutationKey: ['sendRawMessage', programId],
    mutationFn: sendRawMessage,
  });
};

export { useSendRawProgramMessage };
