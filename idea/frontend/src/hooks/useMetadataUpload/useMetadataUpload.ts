import { useAlert, useAccount, useApi } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';

import { addMetadata } from 'api';
import { uploadLocalMetadata } from 'api/LocalDB';
import { ACCOUNT_ERRORS } from 'shared/config';

import { useChain } from '../context';
import { ParamsToUploadMeta } from './types';

const useMetadataUpload = () => {
  const { api, isApiReady } = useApi();
  const { account } = useAccount();
  const alert = useAlert();
  const { isDevChain } = useChain();

  const upload = async (params: ParamsToUploadMeta) => {
    const { metaHex, codeHash, reject, resolve } = params;

    try {
      const { error } = await addMetadata({ hex: metaHex, codeHash: codeHash as HexString });

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
    const { metaHex, codeHash, programId, name, reject, resolve } = params;

    try {
      if (!isApiReady) throw new Error('API is not initialized');
      if (!account) throw new Error(ACCOUNT_ERRORS.WALLET_NOT_CONNECTED);

      if (isDevChain) {
        const metaHash = await api.code.metaHash(codeHash);

        await uploadLocalMetadata(metaHash, metaHex, programId, name);

        alert.success('Metadata added to the localDB successfully');

        if (resolve) resolve();

        return;
      }

      upload({ codeHash, metaHex, programId, reject, resolve });
    } catch (error) {
      const message = (error as Error).message;

      alert.error(message);

      if (reject) reject();
    }
  };

  return uploadMetadata;
};

export { useMetadataUpload };
