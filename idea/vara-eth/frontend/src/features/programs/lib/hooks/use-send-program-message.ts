import { useMutation } from '@tanstack/react-query';
import { HexString } from '@vara-eth/api';

import { useMirrorContract } from '@/app/api';
import { TransactionTypes, unpackReceipt, useAddMyActivity } from '@/app/store';

import { useSails } from './use-sails';

type SendMessageParams = {
  serviceName: string;
  messageName: string;
  isQuery: boolean;
  payload: HexString;
};

const useSendProgramMessage = (programId: HexString, idl: string) => {
  const { data: sails } = useSails(idl);
  const { data: mirrorContract } = useMirrorContract(programId);
  const addMyActivity = useAddMyActivity();

  const sendMessage = async ({ serviceName, messageName, isQuery, payload }: SendMessageParams) => {
    if (!mirrorContract || !sails) return;

    const messageKey = isQuery ? 'queries' : 'functions';
    const sailsMessage = sails?.services[serviceName][messageKey][messageName];

    // TODO: would be better to return non-encoded payload from schema,
    // but for now to not change gear idea implementation we have to decode encoded value here
    const args: unknown[] = sailsMessage.decodePayload(payload);

    const tx = await mirrorContract.sendMessage(payload);
    const response = await tx.send();
    const receipt = await tx.getReceipt();

    const params = args.map((_value, index) => {
      const key = sailsMessage.args[index].name;
      return `${key}: ${String(_value)}`;
    });

    addMyActivity({
      type: TransactionTypes.programMessage,
      serviceName,
      messageName,
      ...unpackReceipt(receipt),
      to: programId,
      params: { payload: `${messageName} (${params.join(', ')})` },
    });

    const { waitForReply } = await tx.setupReplyListener();
    const reply = await waitForReply();

    const { replyCode, blockNumber, txHash } = reply;

    const result: Record<string, unknown> = sailsMessage.decodeResult(reply.payload);

    addMyActivity({
      type: TransactionTypes.programReply,
      serviceName,
      messageName,
      replyCode,
      ...unpackReceipt(),
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
