import { Hex, ProgramMetadata } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { useContext, useEffect } from 'react';
import { ApiContext } from 'context';
import { useHandleReadState } from './useHandleReadState';
import { useStateSubscription } from './useStateSubscription';

function useReadFullState<T = AnyJson>(
  programId: Hex | undefined,
  meta: ProgramMetadata | undefined,
  isReadOnError?: boolean,
) {
  const { api } = useContext(ApiContext); // сircular dependency fix

  const readFullState = () => {
    if (!programId || !meta) return;

    return api.programState.read({ programId }, meta);
  };

  const { state, isStateRead, error, readState, resetError } = useHandleReadState<T>(readFullState, isReadOnError);

  useEffect(() => {
    readState(true);
    resetError();
  }, [programId, meta]);

  useStateSubscription(programId, readState, !!meta);

  return { state, isStateRead, error };
}

export { useReadFullState };
