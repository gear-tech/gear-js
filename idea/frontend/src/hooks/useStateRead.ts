import { useState } from 'react';
import { AnyJson, Codec } from '@polkadot/types/types';
import { ProgramMetadata, getStateMetadata } from '@gear-js/api';
import { useApi, useAlert } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';

const useStateRead = (programId: HexString) => {
  const { api, isApiReady } = useApi();
  const alert = useAlert();

  const [state, setState] = useState<AnyJson>();
  const [isStateRead, setIsStateRead] = useState(true);

  const handleStateRead = (callback: () => Promise<Codec>) => {
    setIsStateRead(false);

    callback()
      .then((result) => setState(result.toHuman()))
      .catch(({ message }: Error) => alert.error(message))
      .finally(() => setIsStateRead(true));
  };

  const readFullState = (metadata: ProgramMetadata, payload: AnyJson) => {
    if (!isApiReady) return;

    handleStateRead(() => api.programState.read({ programId, payload }, metadata));
  };

  const readWasmState = (
    wasm: Buffer,
    programMetadata: ProgramMetadata,
    fn_name: string,
    argument: AnyJson,
    payload: AnyJson,
  ) => {
    if (!isApiReady) return;

    handleStateRead(() =>
      getStateMetadata(wasm).then((stateMetadata) =>
        api.programState.readUsingWasm({ programId, wasm, fn_name, argument, payload }, stateMetadata, programMetadata),
      ),
    );
  };

  const resetState = () => setState(undefined);
  const isState = state !== undefined; // could be null

  return { readFullState, readWasmState, resetState, state, isStateRead, isState };
};

export { useStateRead };
