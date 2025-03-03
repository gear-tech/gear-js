import { ProgramMetadata } from '@gear-js/api';
import { useApi, useAlert } from '@gear-js/react-hooks';
import { AnyJson, Codec } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';
import { useState } from 'react';

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

  const resetState = () => setState(undefined);
  const isState = state !== undefined; // could be null

  return { readFullState, resetState, state, isStateRead, isState };
};

export { useStateRead };
