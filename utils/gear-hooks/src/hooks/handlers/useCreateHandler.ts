import { ProgramMetadata } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';

import { useAlert } from '@/context';
import { getAutoGasLimit } from '@/utils';

import { useCreateProgram, useCreateCalculateGas } from '../api';
import { Options } from '../api/useProgram/types';

function useCreateHandler(codeId: HexString | undefined, metadata?: ProgramMetadata) {
  const alert = useAlert();

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
