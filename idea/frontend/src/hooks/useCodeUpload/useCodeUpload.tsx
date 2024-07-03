import { web3FromSource } from '@polkadot/extension-dapp';
import { HexString } from '@polkadot/util/types';
import { useApi, useAlert, useAccount } from '@gear-js/react-hooks';

import { useChain, useModal, useSignAndSend } from '@/hooks';
import { TransactionName, UPLOAD_METADATA_TIMEOUT } from '@/shared/config';
import { CopiedInfo } from '@/shared/ui/copiedInfo';
import { addMetadata, addCodeName } from '@/api';
import { addIdl } from '@/features/sails';

import { ParamsToUploadCode } from './types';

const useCodeUpload = () => {
  const { api, isApiReady } = useApi();
  const alert = useAlert();
  const { account } = useAccount();
  const { showModal } = useModal();
  const { isDevChain } = useChain();
  const signAndSend = useSignAndSend();

  // will be refactored in the upcoming local indexer refactoring
  const handleMetadataUpload = (
    codeId: HexString,
    codeName: string,
    metaHex: HexString | undefined,
    idl: string | undefined,
  ) => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (isDevChain) return;

    // timeout cuz wanna be sure that block data is ready
    setTimeout(async () => {
      const id = codeId;
      const name = codeName || id;

      await addCodeName({ id, name });
      if (idl) addIdl(codeId, idl);

      if (!metaHex) return;
      const hash = await api.code.metaHash(id);

      addMetadata(hash, metaHex);
    }, UPLOAD_METADATA_TIMEOUT);
  };

  return async ({ optBuffer, name, voucherId, metaHex, idl, resolve }: ParamsToUploadCode) => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (!account) throw new Error('Account not found');

    const { address, meta } = account;

    const [{ codeHash, extrinsic: codeExtrinsic }, { signer }] = await Promise.all([
      api.code.upload(optBuffer),
      web3FromSource(meta.source),
    ]);

    const extrinsic = voucherId ? api.voucher.call(voucherId, { UploadCode: codeExtrinsic }) : codeExtrinsic;
    const { partialFee } = await api.code.paymentInfo(address, { signer });

    const onSuccess = () => {
      alert.success(<CopiedInfo title="Code hash" info={codeHash} />);
      resolve();
    };

    const onFinalized = () => handleMetadataUpload(codeHash, name, metaHex, idl);
    const onConfirm = () => signAndSend(extrinsic, 'CodeChanged', { onSuccess, onFinalized });

    showModal('transaction', {
      fee: partialFee.toHuman(),
      name: TransactionName.SubmitCode,
      addressFrom: address,
      onConfirm,
    });
  };
};

export { useCodeUpload };
