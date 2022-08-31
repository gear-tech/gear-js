import { web3FromSource } from '@polkadot/extension-dapp';
import { GasLimit, Metadata } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { useContext } from 'react';
import { AccountContext, AlertContext, ApiContext } from 'context';
import { TransactionName, SingAndSendParams, UploadOptions, Code } from './types';
import { useHandlers } from './useHandlers';
import { waitForProgramInit } from './utils';

const useUploadProgram = (
  code: Code | undefined,
  metadata?: Metadata | undefined,
  payloadType?: string | undefined,
) => {
  const alert = useContext(AlertContext); // сircular dependency fix
  const { api } = useContext(ApiContext);
  const { account } = useContext(AccountContext);

  const { handleSignStatus, handleInitStatus, handleError } = useHandlers();

  const signAndSend = (params: SingAndSendParams) => {
    const { address, signer, ...signHandlerParams } = params;

    return api.program.signAndSend(address, { signer }, (result) => handleSignStatus({ result, ...signHandlerParams }));
  };

  const uploadProgram = (initPayload: AnyJson, gasLimit: GasLimit, options?: UploadOptions) => {
    if (!account) return Promise.reject(new Error('No account address'));
    if (!code) return Promise.reject(new Error('No program buffer'));

    const { value = 0, salt, onSuccess, onError } = options || {};

    const program = { code, initPayload, gasLimit, value, salt };
    const callbacks = { onSuccess, onError };

    const { meta, address } = account;
    const { source } = meta;

    const { programId } = api.program.upload(program, metadata, payloadType);

    const alertId = alert.loading('SignIn', { title: TransactionName.UploadProgram });
    const initialization = waitForProgramInit(api, programId);

    return web3FromSource(source)
      .then(({ signer }) => signAndSend({ address, signer, callbacks, alertId, programId }))
      .then(() => initialization)
      .then((status) => handleInitStatus({ status, programId, onError }))
      .catch(({ message }: Error) => handleError({ message, alertId, onError }));
  };

  return uploadProgram;
};

export { useUploadProgram };
