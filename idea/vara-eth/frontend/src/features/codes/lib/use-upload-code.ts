import { useMutation } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { bytesToHex, type Hex } from 'viem';
import { useConnection } from 'wagmi';
import { useApi } from '@/app/api';
import { useAddMyActivity } from '@/app/store';
import { TransactionTypes } from '@/app/store/my-activity';
import { nodeAtom } from '@/app/store/node';
import { CODE_VALIDATION_SERVICE_URL, ETH_CHAIN_ID_MAINNET } from '@/shared/config';
import { DEFAULT_DEADLINE_SECONDS } from './consts';
import { computeBlobHashesInWorker } from './kzg-worker-client';
import { requestCodeValidation } from './requests';
import { addValidationJob } from './validation-jobs-storage';

const getNetwork = (ethChainId: number) => (ethChainId === ETH_CHAIN_ID_MAINNET ? 'mainnet' : 'testnet');

export const useUploadCode = () => {
  const { data: api } = useApi();
  const addMyActivity = useAddMyActivity();
  const { address } = useConnection();

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
      const deadline = BigInt(Math.floor(Date.now() / 1000) + DEFAULT_DEADLINE_SECONDS);
      const { signature: wvaraPermitSig } = await wvara.prepareAndSignPermitData(
        router.address,
        baseFee + extraFee,
        deadline,
      );

      const blobHashes = await computeBlobHashesInWorker(code);
      const preparedValidationData = await router.prepareAndSignRequestCodeValidationPermitData(
        code,
        deadline,
        blobHashes,
      );
      const { signature: requestCodeValidationSig } = preparedValidationData;
      codeId = preparedValidationData.codeId;

      if (!CODE_VALIDATION_SERVICE_URL) {
        throw new Error('CODE_VALIDATION_SERVICE_URL is required');
      }

      const network = getNetwork(ethChainId);

      const { jobId } = await requestCodeValidation(CODE_VALIDATION_SERVICE_URL, network, {
        sender: address,
        code: bytesToHex(code),
        codeId,
        blobHashes,
        deadline: Number(deadline),
        requestCodeValidationSignature: requestCodeValidationSig,
        wvaraPermitSignature: wvaraPermitSig,
      });

      addValidationJob(ethChainId, { jobId, codeId });

      await addMyActivity({
        type: TransactionTypes.codeValidation,
        codeId,
        resultStatus: 'pending',
        error: undefined,
      });
      hasPendingActivityAdded = true;
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
