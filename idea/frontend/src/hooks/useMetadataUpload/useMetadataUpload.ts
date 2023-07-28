import { useAlert, useAccount } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';

import { addMetadata } from 'api';
import { uploadLocalMetadata } from 'api/LocalDB';
import { ACCOUNT_ERRORS } from 'shared/config';

import { useChain } from '../context';
import { ParamsToUploadMeta } from './types';

const useMetadataUpload = () => {
  const alert = useAlert();
  const { account } = useAccount();
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
    const { name, metaHex, codeHash, reject, resolve } = params;

    try {
      if (!account) throw new Error(ACCOUNT_ERRORS.WALLET_NOT_CONNECTED);

      if (isDevChain) {
        // TODO: local meta
        await uploadLocalMetadata(codeHash, metaHex, name);

        alert.success('Metadata added to the localDB successfully');

        if (resolve) resolve();

        return;
      }

      upload({ codeHash, metaHex, reject, resolve });
    } catch (error) {
      const message = (error as Error).message;

      alert.error(message);

      if (reject) reject();
    }
  };

  return uploadMetadata;
};

export { useMetadataUpload };
