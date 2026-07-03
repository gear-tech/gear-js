import { getServiceMethod } from '@gear-js/sails-payload-form';
import { useMutation } from '@tanstack/react-query';
import { type Hex, zeroAddress } from 'viem';
import { useConnection } from 'wagmi';
import { useApi } from '@/app/api';
import { TransactionTypes, useAddMyActivity } from '@/app/store';
import type { FormattedPayloadValue, ParsedSails } from '@/features/sails/lib';

type ReadMessageParams = {
  serviceName: string;
  messageName: string;
  payload: FormattedPayloadValue;
};

const useReadProgramMessage = (programId: Hex, sails: ParsedSails | undefined) => {
  const { data: api } = useApi();
  const account = useConnection();
  const addMyActivity = useAddMyActivity();

  const readProgramMessage = async ({ serviceName, messageName, payload }: ReadMessageParams) => {
    if (!sails || !api) return;

    const sailsMessage = getServiceMethod(sails, serviceName, 'queries', messageName);
    if (!sailsMessage) throw new Error(`Query "${messageName}" not found in service "${serviceName}"`);
    const sourceAddress = account.address ?? zeroAddress;

    const response = await api.call.program.calculateReplyForHandle(sourceAddress, programId, payload.encoded);
    const result: Record<string, unknown> = sailsMessage.decodeResult(response.payload);

    await addMyActivity({
      type: TransactionTypes.readProgramReply,
      serviceName,
      messageName,
      replyCode: response.code.toString(),
      from: programId,
      params: { payload: JSON.stringify(result) },
      value: String(response.value),
    });

    return { response, result };
  };

  return useMutation({
    mutationKey: ['readProgramMessage', programId],
    mutationFn: readProgramMessage,
  });
};

export { useReadProgramMessage };
