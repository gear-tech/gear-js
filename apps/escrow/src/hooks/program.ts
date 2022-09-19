import { Hex } from '@gear-js/api';
import { useCreateHandler } from '@gear-js/react-hooks';
import { AnyJson } from '@polkadot/types/types';
import { useState } from 'react';
import { useWasm } from './context';

function useProgram() {
  const { codeHash, meta } = useWasm();
  const createProgram = useCreateHandler(codeHash, meta);

  const [programId, setProgramId] = useState('' as Hex);

  const resetProgramId = () => setProgramId('' as Hex);

  return {
    createProgram: (payload: AnyJson) => createProgram(payload, { onSuccess: setProgramId }),
    programId,
    setProgramId,
    resetProgramId,
  };
}

export { useProgram };
