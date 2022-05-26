import { ProgramId } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { useEffect, useState } from 'react';
import { useApi } from 'hooks';
import { useConditionalMetaBuffer } from './useMetadata';

function useReadState(programId: ProgramId, metaSourceOrBuffer: string | Buffer | undefined, payload?: AnyJson) {
  const [state, setState] = useState<AnyJson>();
  const { api } = useApi();
  const metaBuffer = useConditionalMetaBuffer(metaSourceOrBuffer);

  useEffect(() => {
    if (metaBuffer && payload) {
      api.programState
        .read(programId, metaBuffer, payload)
        .then((codecState) => codecState.toHuman())
        .then(setState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaBuffer, payload]);

  return state;
}

export { useReadState };
