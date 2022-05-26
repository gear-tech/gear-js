import { ProgramId } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { useEffect, useState } from 'react';
import { useApi } from 'hooks';
import { useMetadata } from './useMetadata';

function useReadState(programId: ProgramId, metaSource: string | undefined, payload?: AnyJson): AnyJson;
function useReadState(programId: ProgramId, metaBuffer: Buffer | undefined, payload?: AnyJson): AnyJson;
function useReadState(programId: ProgramId, metaSourceOrBuffer: string | Buffer | undefined, payload?: AnyJson) {
  const [state, setState] = useState<AnyJson>();
  const { api } = useApi();

  const isMetaSource = typeof metaSourceOrBuffer === 'string';
  const metadata = useMetadata(isMetaSource ? metaSourceOrBuffer : undefined);
  const metaBuffer = isMetaSource ? metadata.metaBuffer : metaSourceOrBuffer;

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
