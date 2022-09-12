import { Hex, Metadata } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { useContext } from 'react';
import { AlertContext } from 'context';
import { useCreateProgram, useCreateCalculateGas } from '../api';
import { Options } from '../api/useProgram/types';

function useCreateHandler(codeId: Hex | undefined, metadata?: Metadata | undefined) {
  const alert = useContext(AlertContext); // сircular dependency fix

  const createProgram = useCreateProgram(codeId, metadata);
  const calculateGas = useCreateCalculateGas(codeId, metadata);

  return (initPayload: AnyJson, options: Options) => {
    calculateGas(initPayload)
      .then(({ min_limit: gasLimit }) => createProgram(initPayload, gasLimit, options))
      .catch(({ message }: Error) => alert.error(message));
  };
}

export { useCreateHandler };
