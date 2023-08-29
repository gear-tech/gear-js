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
  payload: AnyJson | undefined,
  isReadOnError?: boolean,
) {
  const { api } = useContext(ApiContext); // сircular dependency fix

  const isPayload = payload !== undefined;

  const readFullState = () => {
    if (!api || !programId || !meta || !isPayload) return;

    return api.programState.read({ programId, payload }, meta);
  };

  const { state, isStateRead, error, readState, resetError } = useHandleReadState<T>(readFullState, isReadOnError);

  useEffect(() => {
    readState(true);
    resetError();
  }, [api, programId, meta, payload]);

  useStateSubscription(programId, readState, !!meta && isPayload);

  return { state, isStateRead, error };
}

export { useReadFullState };
