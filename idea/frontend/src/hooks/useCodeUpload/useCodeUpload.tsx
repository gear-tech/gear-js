import { useCallback } from 'react';
import { web3FromSource } from '@polkadot/extension-dapp';
import { EventRecord } from '@polkadot/types/interfaces';
import { HexString } from '@polkadot/util/types';
import { useApi, useAlert, useAccount, DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from '@gear-js/react-hooks';

import { useModal } from 'hooks';
import { Method } from 'entities/explorer';
import { checkWallet, readFileAsync, getExtrinsicFailedMessage } from 'shared/helpers';
import { PROGRAM_ERRORS, TransactionName, TransactionStatus } from 'shared/config';
import { CopiedInfo } from 'shared/ui/copiedInfo';

import { addCodeMetadata } from 'api';
import { ParamsToUploadCode, ParamsToSignAndSend } from './types';

const useCodeUpload = () => {
  const { api } = useApi();
  const alert = useAlert();
  const { account } = useAccount();
  const { showModal } = useModal();

  const submit = async (file: File) => {
    const arrayBuffer = await readFileAsync(file, 'buffer');
    const buffer = Buffer.from(arrayBuffer);

    const result = await api.code.upload(buffer);

    return result.codeHash;
  };

  const handleEventsStatus = (
    events: EventRecord[],
    codeHash: HexString,
    metaHex: HexString,
    name: string,
    resolve?: () => void,
  ) => {
    events.forEach(({ event }) => {
      const { method, section } = event;
      const alertOptions = { title: `${section}.${method}` };

      if (method === Method.ExtrinsicFailed) {
        alert.error(getExtrinsicFailedMessage(api, event), alertOptions);
      } else if (method === Method.CodeChanged) {
        alert.success(<CopiedInfo title="Code hash" info={codeHash} />, alertOptions);

        if (resolve) resolve();

        if (metaHex)
          addCodeMetadata({ codeId: codeHash, metaHex, name })
            .then(() => alert.success('Metadata saved successfully'))
            .catch(({ message }: Error) => alert.error(message));
      }
    });
  };

  const signAndSend = async ({ signer, codeId, metaHex, name, resolve }: ParamsToSignAndSend) => {
    const alertId = alert.loading('SignIn', { title: TransactionName.SubmitCode });

    try {
      await api.code.signAndSend(account!.address, { signer }, ({ events, status }) => {
        if (status.isReady) {
          alert.update(alertId, TransactionStatus.Ready);
        } else if (status.isInBlock) {
          alert.update(alertId, TransactionStatus.InBlock);
          handleEventsStatus(events, codeId, metaHex, name, resolve);
        } else if (status.isFinalized) {
          alert.update(alertId, TransactionStatus.Finalized, DEFAULT_SUCCESS_OPTIONS);
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
    async ({ file, name, metaHex, resolve }: ParamsToUploadCode) => {
      try {
        checkWallet(account);

        const { address, meta } = account!;

        const [codeId, { signer }] = await Promise.all([submit(file), web3FromSource(meta.source)]);

        const { partialFee } = await api.code.paymentInfo(address, { signer });

        const handleConfirm = () => signAndSend({ signer, name, codeId, metaHex, resolve });

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
