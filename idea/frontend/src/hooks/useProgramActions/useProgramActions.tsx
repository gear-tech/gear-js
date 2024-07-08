import { generatePath } from 'react-router-dom';
import { useApi, useAccount } from '@gear-js/react-hooks';
import { web3FromSource } from '@polkadot/extension-dapp';
import { ISubmittableResult } from '@polkadot/types/types';

import { useChain, useModal, useSignAndSend } from '@/hooks';
import { addLocalMetadata, addLocalProgram } from '@/features/local-indexer';
import { absoluteRoutes } from '@/shared/config';
import { CustomLink } from '@/shared/ui/customLink';
import { useProgramStatus } from '@/features/program';
import { isState } from '@/features/metadata';
import { addMetadata as addStorageMetadata, addProgramName } from '@/api';
import { addIdl } from '@/features/sails';

import { ContractApi, Program, Values } from './types';

const useProgramActions = () => {
  const { api, isApiReady } = useApi();
  const { account } = useAccount();
  const { isDevChain } = useChain();
  const signAndSend = useSignAndSend();

  const { showModal } = useModal();
  const { getProgramStatus } = useProgramStatus();

  const getSuccessAlert = (programId: string) => (
    <p>
      ID: <CustomLink to={generatePath(absoluteRoutes.program, { programId })} text={programId} />
    </p>
  );

  const handleMetadataUpload = async (
    { programId, codeId }: Program,
    { metadata, sails }: ContractApi,
    { programName }: Values,
    result: ISubmittableResult,
  ) => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (!account) throw new Error('Account not found');

    const name = programName || programId;
    const genesis = api.genesisHash.toHex();
    const timestamp = Date();

    if (isDevChain) {
      const id = programId;
      const owner = account.decodedAddress;
      const metahash = metadata?.hash || null;
      const status = await getProgramStatus(programId);
      const hasState = !!metadata && !!metadata.value ? isState(metadata.value) : false;
      const blockHash = result.status.asFinalized.toHex();

      await addLocalProgram({ id, owner, codeId, status, blockHash, hasState, metahash, name, genesis, timestamp });
    }

    if (!isDevChain) await addProgramName(programId, name);

    if (metadata && metadata.hash && metadata.hex && !metadata.isFromStorage) {
      const addMetadata = isDevChain ? addLocalMetadata : addStorageMetadata;

      await addMetadata(metadata.hash, metadata.hex);
    }

    if (sails && sails.idl && !sails.isFromStorage) {
      await addIdl(codeId, sails.idl);
    }
  };

  return async (
    program: Program,
    contractApi: ContractApi,
    values: Values,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (!account) throw new Error('Account not found');

    const { meta, address } = account;
    const { signer } = await web3FromSource(meta.source);
    const { partialFee } = await api.program.paymentInfo(address, { signer });

    const successAlert = getSuccessAlert(program.programId);
    const onFinalized = (result: ISubmittableResult) => handleMetadataUpload(program, contractApi, values, result);

    const onConfirm = () =>
      signAndSend(program.extrinsic, 'ProgramChanged', { successAlert, onSuccess, onError, onFinalized });

    showModal('transaction', {
      fee: partialFee.toHuman(),
      name: `${program.extrinsic.method.section}.${program.extrinsic.method.method}`,
      addressFrom: address,
      onAbort: onError,
      onConfirm,
    });
  };
};

export { useProgramActions };
