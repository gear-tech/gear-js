import { MessagesDispatched, ProgramMetadata, getStateMetadata } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';
import { useEffect, useState } from 'react';
import { useAlert, useApi } from '@/context';

type Args = {
  programId: HexString | undefined;
  wasm: Buffer | Uint8Array | undefined;
  programMetadata: ProgramMetadata | undefined;
  functionName: string | undefined;
  payload?: AnyJson;
  argument?: AnyJson;
};

function useReadWasmState<T = AnyJson>(args: Args, isReadOnError?: boolean) {
  const { programId, wasm, programMetadata, functionName, payload, argument } = args;

  const { api } = useApi();
  const alert = useAlert();

  const [state, setState] = useState<T>();
  const [isStateRead, setIsStateRead] = useState(true);
  const [error, setError] = useState('');

  const isPayload = payload !== undefined;
  const isArgument = argument !== undefined;

  const readWasmState = (isInitLoad?: boolean) => {
    if (!api || !programId || !wasm || !programMetadata || !functionName || !isArgument || !isPayload) return;

    if (isInitLoad) setIsStateRead(false);

    getStateMetadata(wasm)
      .then((stateMetadata) =>
        api.programState.readUsingWasm(
          { programId, wasm, fn_name: functionName, argument, payload },
          stateMetadata,
          programMetadata,
        ),
      )
      .then((codecState) => codecState.toHuman())
      .then((result) => {
        setState(result as unknown as T);
        if (!isReadOnError) setIsStateRead(true);
      })
      .catch(({ message }: Error) => setError(message))
      .finally(() => {
        if (isReadOnError) setIsStateRead(true);
      });
  };

  const handleStateChange = ({ data }: MessagesDispatched) => {
    const changedIDs = data.stateChanges.toHuman() as HexString[];
    const isAnyChange = changedIDs.some((id) => id === programId);

    if (isAnyChange) readWasmState();
  };

  useEffect(() => {
    if (!api || !programId || !wasm || !programMetadata || !functionName || !isArgument || !isPayload) return;

    const unsub = api.gearEvents.subscribeToGearEvent('MessagesDispatched', handleStateChange);

    return () => {
      unsub.then((unsubCallback) => unsubCallback());
    };
  }, [api, programId, wasm, programMetadata, functionName, argument, payload]);

  useEffect(() => {
    readWasmState(true);
    setError('');
  }, [api, programId, wasm, programMetadata, functionName, argument, payload]);

  useEffect(() => {
    if (error) alert.error(error);
  }, [error]);

  return { state, isStateRead, error };
}

export { useReadWasmState };
