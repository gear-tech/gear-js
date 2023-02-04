import { ProgramMetadata } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';
import { useContext } from 'react';
import { AlertContext } from 'context';
import { useCreateProgram, useCreateCalculateGas } from '../api';
import { Options } from '../api/useProgram/types';
import { getAutoGasLimit } from 'utils';

function useCreateHandler(codeId: HexString | undefined, metadata?: ProgramMetadata | undefined) {
  const alert = useContext(AlertContext); // сircular dependency fix

  const createProgram = useCreateProgram(codeId, metadata);
  const calculateGas = useCreateCalculateGas(codeId, metadata);

  return (initPayload: AnyJson, options?: Options) => {
    calculateGas(initPayload)
      .then(getAutoGasLimit)
      .then((gasLimit) => createProgram(initPayload, gasLimit, options))
      .catch(({ message }: Error) => alert.error(message));
  };
}

export { useCreateHandler };
