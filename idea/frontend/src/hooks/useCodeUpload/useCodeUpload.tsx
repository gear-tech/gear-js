import { useCallback } from 'react';
import { web3FromSource } from '@polkadot/extension-dapp';
import { EventRecord } from '@polkadot/types/interfaces';
import { HexString } from '@polkadot/util/types';
import { useApi, useAlert, useAccount, DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from '@gear-js/react-hooks';

import { useModal } from '@/hooks';
import { Method } from '@/features/explorer';
import { checkWallet, getExtrinsicFailedMessage } from '@/shared/helpers';
import { PROGRAM_ERRORS, TransactionName, TransactionStatus, UPLOAD_METADATA_TIMEOUT } from '@/shared/config';
import { CopiedInfo } from '@/shared/ui/copiedInfo';
import { addMetadata, addCodeName } from '@/api';

import { ParamsToUploadCode, ParamsToSignAndSend } from './types';

const useCodeUpload = () => {
  const { api, isApiReady } = useApi();
  const alert = useAlert();
  const { account } = useAccount();
  const { showModal } = useModal();

  const handleEventsStatus = (events: EventRecord[], codeHash: HexString, resolve?: () => void) => {
    if (!isApiReady) throw new Error('API is not initialized');

    events.forEach(({ event }) => {
      const { method, section } = event;
      const alertOptions = { title: `${section}.${method}` };

      if (method === Method.ExtrinsicFailed) {
        alert.error(getExtrinsicFailedMessage(api, event), alertOptions);
      } else if (method === Method.CodeChanged) {
        alert.success(<CopiedInfo title="Code hash" info={codeHash} />, alertOptions);

        if (resolve) resolve();
      }
    });
  };

  const signAndSend = async ({ extrinsic, signer, codeId, metaHex, name, resolve }: ParamsToSignAndSend) => {
    const alertId = alert.loading('SignIn', { title: TransactionName.SubmitCode });

    try {
      if (!isApiReady) throw new Error('API is not initialized');

      await extrinsic.signAndSend(account!.address, { signer }, ({ events, status }) => {
        if (status.isReady) {
          alert.update(alertId, TransactionStatus.Ready);
        } else if (status.isInBlock) {
          alert.update(alertId, TransactionStatus.InBlock);
          handleEventsStatus(events, codeId, resolve);
        } else if (status.isFinalized) {
          alert.update(alertId, TransactionStatus.Finalized, DEFAULT_SUCCESS_OPTIONS);

          // timeout cuz wanna be sure that block data is ready
          setTimeout(() => {
            const id = codeId;

            addCodeName({ id, name: name || id })
              .then(() => metaHex && addMetadata({ codeHash: id, hex: metaHex }))
              .catch(({ message }: Error) => alert.error(message));
          }, UPLOAD_METADATA_TIMEOUT);
        } else if (status.isInvalid) {
          alert.update(alertId, PROGRAM_ERRORS.INVALID_TRANSACTION, DEFAULT_ERROR_OPTIONS);
        }
      });
    } catch (error) {
      const message = (error as Error).message;

      alert.update(alertId, message, DEFAULT_ERROR_OPTIONS);
    }
  };

  const uploadCode = useCallback(
    async ({ optBuffer, name, voucherId, metaHex, resolve }: ParamsToUploadCode) => {
      try {
        if (!isApiReady) throw new Error('API is not initialized');
        checkWallet(account);

        const { address, meta } = account!;

        const [code, { signer }] = await Promise.all([api.code.upload(optBuffer), web3FromSource(meta.source)]);

        const codeExtrinsic = code.extrinsic;
        const codeId = code.codeHash;
        const extrinsic = voucherId ? api.voucher.call(voucherId, { UploadCode: codeExtrinsic }) : codeExtrinsic;

        const { partialFee } = await api.code.paymentInfo(address, { signer });

        const handleConfirm = () => signAndSend({ extrinsic, signer, name, codeId, metaHex, resolve });

        showModal('transaction', {
          fee: partialFee.toHuman(),
          name: TransactionName.SubmitCode,
          addressFrom: address,
          onConfirm: handleConfirm,
        });
      } catch (error) {
        const message = (error as Error).message;

        alert.error(message);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, account],
  );

  return uploadCode;
};

export { useCodeUpload };
