import { useMutation } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { generatePath, useNavigate } from 'react-router-dom';
import { type Hex, toHex } from 'viem';
import { useAccount } from 'wagmi';
import { useApi } from '@/app/api';
import { useAddMyActivity } from '@/app/store';
import { TransactionTypes } from '@/app/store/my-activity';
import { nodeAtom } from '@/app/store/node';
import { CODE_VALIDATION_SERVICE_URL, ETH_CHAIN_ID_MAINNET, routes } from '@/shared/config';
import { DEFAULT_DEADLINE_MS } from './consts';
import { requestCodeValidation } from './requests';
import { addValidationJob } from './validation-jobs-storage';

const getNetwork = (ethChainId: number) => (ethChainId === ETH_CHAIN_ID_MAINNET ? 'mainnet' : 'testnet');

export const useUploadCode = () => {
  const { data: api } = useApi();
  const navigate = useNavigate();
  const addMyActivity = useAddMyActivity();
  const { address } = useAccount();

  const { ethChainId } = useAtomValue(nodeAtom);

  const uploadCode = async (code: Uint8Array) => {
    if (!api || !address) return;

    let codeId: Hex | undefined;
    let hasPendingActivityAdded = false;

    try {
      const { router, wvara } = api.eth;

      const [baseFee, extraFee] = await Promise.all([
        router.requestCodeValidationBaseFee(),
        router.requestCodeValidationExtraFee(),
      ]);

      const deadline = BigInt(Date.now() + DEFAULT_DEADLINE_MS);

      const { signature: wvaraPermitSig } = await wvara.prepareAndSignPermitData(
        router.address,
        baseFee + extraFee,
        deadline,
      );

      const preparedValidationData = await router.prepareAndSignRequestCodeValidationPermitData(code, deadline);
      const { signature: requestCodeValidationSig, blobHashes } = preparedValidationData;
      codeId = preparedValidationData.codeId;

      if (!CODE_VALIDATION_SERVICE_URL) {
        throw new Error('CODE_VALIDATION_SERVICE_URL is required');
      }

      const network = getNetwork(ethChainId);

      const { jobId } = await requestCodeValidation(CODE_VALIDATION_SERVICE_URL, network, {
        sender: address,
        code: toHex(code),
        codeId,
        blobHashes,
        deadline: Number(deadline),
        requestCodeValidationSignature: requestCodeValidationSig,
        wvaraPermitSignature: wvaraPermitSig,
      });

      addValidationJob({ jobId, codeId });

      await addMyActivity({
        type: TransactionTypes.codeValidation,
        codeId,
        resultStatus: 'pending',
        error: undefined,
      });
      hasPendingActivityAdded = true;

      void navigate(generatePath(routes.code, { codeId }));
    } catch (error) {
      if (codeId && !hasPendingActivityAdded) {
        const errorMessage = error instanceof Error ? error.message : 'validation request error';

        await addMyActivity({
          type: TransactionTypes.codeValidation,
          codeId,
          resultStatus: 'error',
          error: errorMessage,
        });
      }

      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: uploadCode,
    onError: (error) => {
      console.error('🚀 ~ mutation ~ error:', error);
    },
  });

  return mutation;
};
