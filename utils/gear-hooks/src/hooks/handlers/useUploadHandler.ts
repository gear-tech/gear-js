import { IProgramCreateOptions, Metadata } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { useContext } from 'react';
import { AlertContext } from 'context';
import { useCreateProgram, useCalculateGas } from '../api';
import { UploadOptions } from '../api/useUploadProgram/types';

function useCreateHandler(codeId: IProgramCreateOptions['codeId'] | undefined, metadata?: Metadata | undefined) {
  const alert = useContext(AlertContext); // сircular dependency fix

  const uploadProgram = useCreateProgram(codeId, metadata);
  const calculateGas = useCalculateGas(codeId, metadata, { method: 'initCreate' });

  return (initPayload: AnyJson, options: UploadOptions) => {
    calculateGas(initPayload)
      .then(({ min_limit: gasLimit }) => uploadProgram(initPayload, gasLimit, options))
      .catch(({ message }: Error) => alert.error(message));
  };
}

export { useCreateHandler };
