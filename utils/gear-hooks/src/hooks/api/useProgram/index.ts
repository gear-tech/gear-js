import { GasLimit, ProgramMetadata } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';

import { useAccount, useAlert, useApi } from '@/context';

import { TransactionName, Options, Code, CodeId, UseProgram } from './types';
import { useHandlers } from './useHandlers';
import { waitForProgramInit } from './utils';

function useProgram(
  method: 'upload',
  code: Code | undefined,
  metadata?: ProgramMetadata,
  payloadType?: string,
): UseProgram;
function useProgram(
  method: 'create',
  codeId: CodeId | undefined,
  metadata?: ProgramMetadata,
  payloadType?: string,
): UseProgram;
function useProgram(
  method: 'upload' | 'create',
  codeOrCodeId: Code | undefined,
  metadata?: ProgramMetadata,
  payloadType?: string,
): UseProgram {
  const alert = useAlert();
  const { api, isApiReady } = useApi();
  const { account } = useAccount();

  const { handleSignStatus, handleInitStatus, handleError } = useHandlers();

  const action = (initPayload: AnyJson, gasLimit: GasLimit, options?: Options) => {
    if (!isApiReady) return Promise.reject(new Error('API is not initialized'));
    if (!account) return Promise.reject(new Error('No account address'));
    if (!codeOrCodeId) return Promise.reject(new Error('No program buffer'));

    const { value = 0, salt, onSuccess, onError } = options || {};

    const isUpload = method === 'upload';
    const codeKey = isUpload ? 'code' : 'codeId';
    const title = isUpload ? TransactionName.UploadProgram : TransactionName.CreateProgram;

    const program = { [codeKey]: codeOrCodeId, initPayload, gasLimit, value, salt };
    const callbacks = { onSuccess, onError };

    const { address, signer } = account;

    // @ts-expect-error - TODO(#1738): explain why it should be ignored
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO(#1816): resolve eslint comments
    const { programId } = api.program[method](program, metadata, payloadType);

    const alertId = alert.loading('SignIn', { title });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- TODO(#1816): resolve eslint comments
    const initialization = waitForProgramInit(api, programId);

    return (
      api.program
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO(#1816): resolve eslint comments
        .signAndSend(address, { signer }, (result) => handleSignStatus({ result, callbacks, alertId, programId }))
        .then(() => initialization)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO(#1816): resolve eslint comments
        .then((status) => handleInitStatus({ status, programId, onError }))
        .catch(({ message }: Error) => handleError({ message, alertId, onError }))
    );
  };

  return action;
}

function useUploadProgram(code: Code | undefined, metadata?: ProgramMetadata, payloadType?: string) {
  return useProgram('upload', code, metadata, payloadType);
}

function useCreateProgram(codeId: CodeId | undefined, metadata?: ProgramMetadata, payloadType?: string) {
  return useProgram('create', codeId, metadata, payloadType);
}

export { useUploadProgram, useCreateProgram };
