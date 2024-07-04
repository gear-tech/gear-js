import { generatePath } from 'react-router-dom';
import { useApi, useAccount } from '@gear-js/react-hooks';
import { HexString, IProgramCreateResult, IProgramUploadResult, ProgramMetadata } from '@gear-js/api';
import { web3FromSource } from '@polkadot/extension-dapp';
import { ISubmittableResult } from '@polkadot/types/types';

import { useChain, useModal, useSignAndSend } from '@/hooks';
import { uploadLocalProgram } from '@/api/LocalDB';
import { absoluteRoutes, UPLOAD_METADATA_TIMEOUT } from '@/shared/config';
import { isNullOrUndefined } from '@/shared/helpers';
import { CustomLink } from '@/shared/ui/customLink';
import { useProgramStatus } from '@/features/program';
import { isHumanTypesRepr } from '@/features/metadata';
import { addProgramName } from '@/api';
import { addIdl } from '@/features/sails';

import { useMetadataUpload } from '../useMetadataUpload';
import { Payload } from './types';

const useProgramActions = () => {
  const { api, isApiReady } = useApi();
  const { account } = useAccount();
  const { isDevChain } = useChain();
  const signAndSend = useSignAndSend();

  const { showModal } = useModal();
  const { getProgramStatus } = useProgramStatus();
  const uploadMetadata = useMetadataUpload();

  const getSuccessAlert = (programId: string) => (
    <p>
      ID: <CustomLink to={generatePath(absoluteRoutes.program, { programId })} text={programId} />
    </p>
  );

  // will be refactored in the upcoming local indexer refactoring
  const handleMetadataUpload = async (
    programId: HexString,
    codeId: HexString,
    payload: Payload,
    result: ISubmittableResult,
  ) => {
    const { programName, metaHex, idl } = payload;
    const name = programName || programId;

    // timeout cuz wanna be sure that block data is ready
    setTimeout(async () => {
      if (!isDevChain) await addProgramName({ id: programId, name });
      if (metaHex) uploadMetadata({ codeHash: codeId, metaHex, programId });
      if (idl) addIdl(codeId, idl);
    }, UPLOAD_METADATA_TIMEOUT);

    if (!isDevChain) return;
    if (!isApiReady) throw new Error('API is not initialized');
    if (!account) throw new Error('Account not found');

    const programStatus = await getProgramStatus(programId);
    const metahash = await api.code.metaHash(codeId);
    const meta = metaHex ? ProgramMetadata.from(metaHex) : undefined;

    const hasState =
      !!meta &&
      (typeof meta.types.state === 'number' ||
        (isHumanTypesRepr(meta.types.state) && !isNullOrUndefined(meta.types.state.output)));

    uploadLocalProgram({
      id: programId,
      owner: account.decodedAddress,
      code: { id: codeId },
      status: programStatus,
      blockHash: result.status.asFinalized.toHex(),
      hasState,
      metahash,
      name,
    });
  };

  return async (
    { programId, extrinsic }: IProgramCreateResult | IProgramUploadResult,
    codeId: HexString,
    payload: Payload,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (!account) throw new Error('Account not found');

    const { meta, address } = account;
    const { signer } = await web3FromSource(meta.source);
    const { partialFee } = await api.program.paymentInfo(address, { signer });

    const successAlert = getSuccessAlert(programId);
    const onFinalized = (result: ISubmittableResult) => handleMetadataUpload(programId, codeId, payload, result);
    const onConfirm = () => signAndSend(extrinsic, 'ProgramChanged', { successAlert, onSuccess, onError, onFinalized });

    showModal('transaction', {
      fee: partialFee.toHuman(),
      name: `${extrinsic.method.section}.${extrinsic.method.method}`,
      addressFrom: address,
      onAbort: onError,
      onConfirm,
    });
  };
};

export { useProgramActions };
