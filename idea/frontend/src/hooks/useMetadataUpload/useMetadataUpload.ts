import { useAlert, useAccount, useApi } from '@gear-js/react-hooks';

import { addMetadata } from '@/api';
import { ACCOUNT_ERRORS } from '@/shared/config';
import { addLocalMetadata } from '@/features/local-indexer';

import { useChain } from '../context';
import { ParamsToUploadMeta } from './types';
import { HexString } from '@gear-js/api';

const useMetadataUpload = () => {
  const { api, isApiReady } = useApi();
  const { account } = useAccount();
  const alert = useAlert();
  const { isDevChain } = useChain();

  const upload = async (params: Omit<ParamsToUploadMeta, 'codeHash'> & { metahash: HexString }) => {
    const { metahash, metaHex, reject, resolve } = params;

    try {
      if (!isApiReady) throw new Error('API is not initialized');

      const { error } = await addMetadata(metahash, metaHex);
      if (error) throw new Error(error.message);

      alert.success('Metadata saved successfully');
      if (resolve) resolve();
    } catch (error) {
      const message = (error as Error).message;

      alert.error(message);

      if (reject) reject();
    }
  };

  const uploadMetadata = async (params: ParamsToUploadMeta) => {
    const { metaHex, codeHash, programId, reject, resolve } = params;

    try {
      if (!isApiReady) throw new Error('API is not initialized');
      if (!account) throw new Error(ACCOUNT_ERRORS.WALLET_NOT_CONNECTED);

      const metahash = await api.code.metaHash(codeHash);

      if (isDevChain) {
        await addLocalMetadata(metahash, metaHex);

        alert.success('Metadata added to the localDB successfully');
        if (resolve) resolve();

        return;
      }

      upload({ metahash, metaHex, programId, reject, resolve });
    } catch (error) {
      const message = (error as Error).message;

      alert.error(message);

      if (reject) reject();
    }
  };

  return uploadMetadata;
};

export { useMetadataUpload };
