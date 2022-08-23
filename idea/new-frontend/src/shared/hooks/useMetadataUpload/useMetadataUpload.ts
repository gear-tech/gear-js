import { useCallback } from 'react';
import { web3FromSource } from '@polkadot/extension-dapp';
import { useAlert, useAccount } from '@gear-js/react-hooks';

import { useModal } from 'shared/hooks/useModal';
import { RpcMethods, ACCOUNT_ERRORS } from 'shared/config';
import { isDevChain } from 'shared/helpers';
import { uploadLocalMetadata } from 'shared/api/LocalDBService';
import { ServerRPCRequestService } from 'shared/api/ServerRPCRequestService';

import { ParamsToSignAndUpload, ParamsToUploadMeta } from './types';

const useMetadataUplaod = () => {
  const alert = useAlert();
  const { account } = useAccount();
  const { showModal } = useModal();

  const signAndUpload = async (params: ParamsToSignAndUpload) => {
    const { name, title, signer, metadataBuffer, programId, jsonMeta, reject, resolve } = params;

    const apiRequest = new ServerRPCRequestService();

    try {
      const { signature } = await signer.signRaw!({
        type: 'payload',
        data: jsonMeta,
        address: account!.address,
      });

      const { error } = await apiRequest.callRPC(RpcMethods.AddMetadata, {
        name,
        meta: jsonMeta,
        title,
        metaFile: metadataBuffer,
        signature,
        programId,
      });

      if (error) {
        throw new Error(error.message);
      }

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
      const { name, title, metadata, metadataBuffer, programId, reject, resolve } = params;

      try {
        if (!account) {
          throw new Error(ACCOUNT_ERRORS.WALLET_NOT_CONNECTED);
        }

        const jsonMeta = JSON.stringify(metadata);

        if (isDevChain()) {
          await uploadLocalMetadata(programId, jsonMeta, metadataBuffer, name);

          alert.success('Metadata added to the localDB successfully');

          if (resolve) resolve();

          return;
        }

        const signer = params.signer ?? (await web3FromSource(account.meta.source)).signer;

        const handleConfirm = () =>
          signAndUpload({
            name,
            title,
            signer,
            jsonMeta,
            programId,
            metadataBuffer,
            reject,
            resolve,
          });

        showModal('metadata', {
          onAbort: reject,
          onConfirm: handleConfirm,
        });
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
