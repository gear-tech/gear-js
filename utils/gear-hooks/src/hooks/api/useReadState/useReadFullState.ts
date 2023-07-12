import { ProgramMetadata } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';
import { useContext, useEffect } from 'react';
import { ApiContext } from 'context';
import { useHandleReadState } from './useHandleReadState';
import { useStateSubscription } from './useStateSubscription';

function useReadFullState<T = AnyJson>(
  programId: HexString | undefined,
  meta: ProgramMetadata | undefined,
  isReadOnError?: boolean,
) {
  const { api } = useContext(ApiContext); // сircular dependency fix

  const readFullState = () => {
    if (!api || !programId || !meta) return;

    return api.programState.read({ programId }, meta);
  };

  const { state, isStateRead, error, readState, resetError } = useHandleReadState<T>(readFullState, isReadOnError);

  useEffect(() => {
    readState(true);
    resetError();
  }, [api, programId, meta]);

  useStateSubscription(programId, readState, !!meta);

  return { state, isStateRead, error };
}

export { useReadFullState };
