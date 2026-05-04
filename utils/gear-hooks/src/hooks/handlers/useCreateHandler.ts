import type { ProgramMetadata } from '@gear-js/api';
import type { AnyJson } from '@polkadot/types/types';
import type { HexString } from '@polkadot/util/types';

import { useAlert } from '@/context';
import { getAutoGasLimit } from '@/utils';

import { useCreateCalculateGas, useCreateProgram } from '../api';
import type { Options } from '../api/useProgram/types';

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
