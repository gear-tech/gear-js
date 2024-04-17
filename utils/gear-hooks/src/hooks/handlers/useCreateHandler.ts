import { ProgramMetadata } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';
import { useContext } from 'react';
import { AlertContext } from 'context';
import { getAutoGasLimit } from 'utils';
import { Options } from '../api/useProgram/types';
import { useCreateProgram, useCreateCalculateGas } from '../api';

function useCreateHandler(codeId: HexString | undefined, metadata?: ProgramMetadata | undefined) {
  const alert = useContext(AlertContext); // сircular dependency fix

  const createProgram = useCreateProgram(codeId, metadata);
  const calculateGas = useCreateCalculateGas(codeId, metadata);

  return (initPayload: AnyJson, options?: Options) => {
    const { onError = () => {} } = options || {};

    calculateGas(initPayload)
      .then((result) => getAutoGasLimit(result))
      .then((gasLimit) => createProgram(initPayload, gasLimit, options))
      .catch(({ message }: Error) => {
        alert.error(message);
        onError();
      });
  };
}

export { useCreateHandler };
