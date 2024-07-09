import { web3FromSource } from '@polkadot/extension-dapp';
import { HexString } from '@polkadot/util/types';
import { useApi, useAccount } from '@gear-js/react-hooks';

import { useAddMetadata, useChain, useModal, useSignAndSend } from '@/hooks';
import { CopiedInfo } from '@/shared/ui/copiedInfo';
import { addCodeName } from '@/api';
import { addIdl } from '@/features/sails';

import { ParamsToUploadCode } from './types';

const useCodeUpload = () => {
  const { api, isApiReady } = useApi();
  const { account } = useAccount();
  const { showModal } = useModal();
  const { isDevChain } = useChain();

  const addMetadata = useAddMetadata();
  const signAndSend = useSignAndSend();

  const handleMetadataUpload = async (
    codeId: HexString,
    codeName: string,
    metadata: ParamsToUploadCode['metadata'],
    sails: ParamsToUploadCode['sails'],
  ) => {
    const id = codeId;
    const name = codeName || id;

    if (!isDevChain) await addCodeName({ id, name });
    if (metadata.hash && metadata.hex && !metadata.isFromStorage) addMetadata(metadata.hash, metadata.hex);
    if (sails.idl && !sails.isFromStorage) addIdl(codeId, sails.idl);
  };

  return async ({ optBuffer, name, voucherId, metadata, sails, resolve }: ParamsToUploadCode) => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (!account) throw new Error('Account not found');

    const { address, meta } = account;

    const [{ codeHash, extrinsic: codeExtrinsic }, { signer }] = await Promise.all([
      api.code.upload(optBuffer),
      web3FromSource(meta.source),
    ]);

    const extrinsic = voucherId ? api.voucher.call(voucherId, { UploadCode: codeExtrinsic }) : codeExtrinsic;
    const { partialFee } = await api.code.paymentInfo(address, { signer });

    const onFinalized = () => handleMetadataUpload(codeHash, name, metadata, sails);

    const onConfirm = () =>
      signAndSend(extrinsic, 'CodeChanged', {
        successAlert: <CopiedInfo title="Code hash" info={codeHash} />,
        onSuccess: resolve,
        onFinalized,
      });

    showModal('transaction', {
      fee: partialFee.toHuman(),
      name: `${extrinsic.method.section}.${extrinsic.method.method}`,
      addressFrom: address,
      onConfirm,
    });
  };
};

export { useCodeUpload };
