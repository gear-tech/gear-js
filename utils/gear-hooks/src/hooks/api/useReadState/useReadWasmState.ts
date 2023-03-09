import { getStateMetadata } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';
import { useContext, useEffect } from 'react';
import { ApiContext } from 'context';
import { useHandleReadState } from './useHandleReadState';
import { useStateSubscription } from './useStateSubscription';

function useReadWasmState<T = AnyJson>(
  programId: HexString | undefined,
  wasm: Buffer | Uint8Array | undefined,
  functionName: string | undefined,
  payload?: AnyJson,
  isReadOnError?: boolean,
) {
  const { api } = useContext(ApiContext); // сircular dependency fix

  const readWasmState = () => {
    if (!programId || !wasm || !functionName || payload === undefined) return;

    return getStateMetadata(wasm).then((stateMetadata) =>
      api.programState.readUsingWasm({ programId, wasm, fn_name: functionName, argument: payload }, stateMetadata),
    );
  };

  const { state, isStateRead, error, readState, resetError } = useHandleReadState<T>(readWasmState, isReadOnError);

  useEffect(() => {
    readState(true);
    resetError();
  }, [programId, wasm, functionName, payload]);

  useStateSubscription(programId, readState, !!wasm && !!functionName && !!payload);

  return { state, isStateRead, error };
}

export { useReadWasmState };
