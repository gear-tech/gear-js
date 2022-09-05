import { Metadata } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { AlertContext } from 'context';
import { useUploadProgram, useCalculateGas } from '../api';
import { UploadOptions } from '../api/useUploadProgram/types';
import { useContext } from 'react';

function useUploadHandler(code: Buffer | undefined, metadata?: Metadata | undefined) {
  const alert = useContext(AlertContext); // сircular dependency fix

  const uploadProgram = useUploadProgram(code, metadata);
  const calculateGas = useCalculateGas(code, metadata, { method: 'initUpload' });

  return (initPayload: AnyJson, options: UploadOptions) => {
    calculateGas(initPayload)
      .then(({ min_limit: gasLimit }) => uploadProgram(initPayload, gasLimit, options))
      .catch(({ message }: Error) => alert.error(message));
  };
}

export { useUploadHandler };
