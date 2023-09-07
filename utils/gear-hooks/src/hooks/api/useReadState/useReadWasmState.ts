import { ProgramMetadata, getStateMetadata } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';
import { useContext, useEffect } from 'react';
import { ApiContext } from 'context';
import { useHandleReadState } from './useHandleReadState';
import { useStateSubscription } from './useStateSubscription';

type Args = {
  programId: HexString | undefined;
  wasm: Buffer | Uint8Array | undefined;
  programMetadata: ProgramMetadata | undefined;
  functionName: string | undefined;
  payload?: AnyJson;
  argument?: AnyJson;
};

function useReadWasmState<T = AnyJson>(args: Args, isReadOnError?: boolean) {
  const { api } = useContext(ApiContext); // сircular dependency fix

  const { programId, wasm, programMetadata, functionName, payload, argument } = args;
  const isPayload = payload !== undefined;
  const isArgument = payload !== undefined;

  const readWasmState = () => {
    if (!api || !programId || !wasm || !programMetadata || !functionName || !isArgument || !isPayload) return;

    return getStateMetadata(wasm).then((stateMetadata) =>
      api.programState.readUsingWasm(
        { programId, wasm, fn_name: functionName, argument, payload },
        stateMetadata,
        programMetadata,
      ),
    );
  };

  const { state, isStateRead, error, readState, resetError } = useHandleReadState<T>(readWasmState, isReadOnError);

  useEffect(() => {
    readState(true);
    resetError();
  }, [api, programId, wasm, programMetadata, functionName, argument, payload]);

  useStateSubscription(programId, readState, !!wasm && !!programMetadata && !!functionName && isArgument && isPayload);

  return { state, isStateRead, error };
}

export { useReadWasmState };
