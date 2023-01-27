import { useCallback } from 'react';
import { useAlert, useAccount } from '@gear-js/react-hooks';

import { uploadLocalMetadata } from 'api/LocalDB';
import { RPCService } from 'shared/services/rpcService';
import { RpcMethods, ACCOUNT_ERRORS } from 'shared/config';

import { useChain } from '../context';
import { ParamsToUploadMeta } from './types';

const useMetadataUplaod = () => {
  const alert = useAlert();
  const { account } = useAccount();
  const { isDevChain } = useChain();

  const upload = async (params: ParamsToUploadMeta) => {
    const { name, metaHex, programId, reject, resolve } = params;

    const apiRequest = new RPCService();

    try {
      const { error } = await apiRequest.callRPC(RpcMethods.AddMetadata, { name, metaHex, programId });

      if (error) throw new Error(error.message);

      alert.success('Metadata saved successfully');

      if (resolve) resolve();
    } catch (error) {
      const message = (error as Error).message;

      alert.error(message);

      if (reject) reject();
    }
  };

  const uploadMetadata = useCallback(
    async (params: ParamsToUploadMeta) => {
      const { name, metaHex, programId, reject, resolve } = params;

      try {
        if (!account) throw new Error(ACCOUNT_ERRORS.WALLET_NOT_CONNECTED);

        if (isDevChain) {
          await uploadLocalMetadata(programId, metaHex, name);

          alert.success('Metadata added to the localDB successfully');

          if (resolve) resolve();

          return;
        }

        upload({ name, programId, metaHex, reject, resolve });
      } catch (error) {
        const message = (error as Error).message;

        alert.error(message);

        if (reject) reject();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account],
  );

  return uploadMetadata;
};

export { useMetadataUplaod };
