import { web3FromSource } from '@polkadot/extension-dapp';
import { GasLimit, Metadata } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { useContext } from 'react';
import { AccountContext, AlertContext, ApiContext } from 'context';
import { TransactionName, SingAndSendParams, Options, Code, CodeId, UseProgram } from './types';
import { useHandlers } from './useHandlers';
import { waitForProgramInit } from './utils';

function useProgram(
  method: 'upload',
  code: Code | undefined,
  metadata?: Metadata | undefined,
  payloadType?: string | undefined,
): UseProgram;
function useProgram(
  method: 'create',
  codeId: CodeId | undefined,
  metadata?: Metadata | undefined,
  payloadType?: string | undefined,
): UseProgram;
function useProgram(
  method: 'upload' | 'create',
  codeOrCodeId: Code | CodeId | undefined,
  metadata?: Metadata | undefined,
  payloadType?: string | undefined,
): UseProgram {
  const alert = useContext(AlertContext); // сircular dependency fix
  const { api } = useContext(ApiContext);
  const { account } = useContext(AccountContext);

  const { handleSignStatus, handleInitStatus, handleError } = useHandlers();

  const signAndSend = (params: SingAndSendParams) => {
    const { address, signer, ...signHandlerParams } = params;

    return api.program.signAndSend(address, { signer }, (result) => handleSignStatus({ result, ...signHandlerParams }));
  };

  const action = (initPayload: AnyJson, gasLimit: GasLimit, options?: Options) => {
    if (!account) return Promise.reject(new Error('No account address'));
    if (!codeOrCodeId) return Promise.reject(new Error('No program buffer'));

    const { value = 0, salt, onSuccess, onError } = options || {};

    const isUpload = method === 'upload';
    const codeKey = isUpload ? 'code' : 'codeId';
    const title = isUpload ? TransactionName.UploadProgram : TransactionName.CreateProgram;

    const program = { [codeKey]: codeOrCodeId, initPayload, gasLimit, value, salt };
    const callbacks = { onSuccess, onError };

    const { meta, address } = account;
    const { source } = meta;

    // @ts-ignore
    const { programId } = api.program[method](program, metadata, payloadType);

    const alertId = alert.loading('SignIn', { title });
    const initialization = waitForProgramInit(api, programId);

    return web3FromSource(source)
      .then(({ signer }) => signAndSend({ address, signer, callbacks, alertId, programId }))
      .then(() => initialization)
      .then((status) => handleInitStatus({ status, programId, onError }))
      .catch(({ message }: Error) => handleError({ message, alertId, onError }));
  };

  return action;
}

function useUploadProgram(code: Code | undefined, metadata?: Metadata | undefined, payloadType?: string | undefined) {
  return useProgram('upload', code, metadata, payloadType);
}

function useCreateProgram(
  codeId: CodeId | undefined,
  metadata?: Metadata | undefined,
  payloadType?: string | undefined,
) {
  return useProgram('create', codeId, metadata, payloadType);
}

export { useUploadProgram, useCreateProgram };
