import { useState } from 'react';
import { AnyJson, Codec } from '@polkadot/types/types';
import { ProgramMetadata, getStateMetadata } from '@gear-js/api';
import { useApi, useAlert } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';

const useStateRead = (programId: HexString) => {
  const alert = useAlert();
  const { api } = useApi();

  const [state, setState] = useState<AnyJson>();
  const [isStateRead, setIsStateRead] = useState(true);

  const handleStateRead = (callback: () => Promise<Codec>) => {
    setIsStateRead(false);

    callback()
      .then((result) => setState(result.toJSON()))
      .catch(({ message }: Error) => alert.error(message))
      .finally(() => setIsStateRead(true));
  };

  const readFullState = (metadata: ProgramMetadata) =>
    handleStateRead(() => api.programState.read({ programId }, metadata));

  const readWasmState = (wasm: Buffer, fn_name: string, argument: AnyJson) =>
    handleStateRead(() =>
      getStateMetadata(wasm).then((stateMetadata) =>
        api.programState.readUsingWasm({ programId, wasm, fn_name, argument }, stateMetadata),
      ),
    );

  const resetState = () => setState(undefined);
  const isState = state !== undefined; // could be null

  return { readFullState, readWasmState, resetState, state, isStateRead, isState };
};

export { useStateRead };
