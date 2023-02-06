import { useEffect, useState } from 'react';
import { getStateMetadata, MessagesDispatched } from '@gear-js/api';
import { useAlert, useApi } from '@gear-js/react-hooks';
import type { AnyJson } from '@polkadot/types/types';
import type { HexString } from '@polkadot/util/types';
import { useLessons, useTamagotchi } from 'app/context';
import { useWasmMetadata } from './use-metadata';
import type { TamagotchiState } from 'app/types/lessons';
import state2 from 'assets/meta/state2.meta.wasm';

type StateWasmResponse = {
  fed: number;
  entertained: number;
  rested: number;
};

export function useThrottleWasmState(payload?: AnyJson, isReadOnError?: boolean) {
  const { api } = useApi();
  const alert = useAlert();
  const [state, setState] = useState<StateWasmResponse>();
  const [error, setError] = useState('');
  const [isStateRead, setIsStateRead] = useState(true);

  const { lesson } = useLessons();
  const metadata = useWasmMetadata(state2);
  const { tamagotchi, setTamagotchi } = useTamagotchi();

  const programId: HexString | undefined = lesson?.programId;
  const wasm: Buffer | Uint8Array | undefined = metadata?.buffer;
  const functionName: string | undefined = 'current_state';

  const resetError = () => setError('');

  const readWasmState = () => {
    if (!programId || !wasm || !functionName) return;

    return getStateMetadata(wasm).then((stateMetadata) =>
      api.programState.readUsingWasm({ programId, wasm, fn_name: functionName, argument: payload }, stateMetadata),
    );
  };

  const readState = (isInitLoad?: boolean) => {
    if (isInitLoad) setIsStateRead(false);

    readWasmState()
      ?.then((codecState) => codecState.toJSON())
      .then((result) => {
        setState(result as unknown as StateWasmResponse);
        if (!isReadOnError) setIsStateRead(true);
      })
      .catch(({ message }: Error) => setError(message))
      .finally(() => {
        if (isReadOnError) setIsStateRead(true);
      });
  };

  useEffect(() => {
    if (error) alert.error(error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    readState(true);
    resetError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId, wasm, functionName]);

  const handleStateChange = ({ data }: MessagesDispatched) => {
    const changedIDs = data.stateChanges.toHuman() as HexString[];
    const isAnyChange = changedIDs.some((id) => id === programId);

    if (isAnyChange) readState();
  };

  useEffect(() => {
    if (!programId || !wasm || !functionName || (lesson && lesson.step < 2)) return;

    const interval = setInterval(() => {
      readState();
      // console.log('interval read state:');
    }, 25000);

    const unsub = api?.gearEvents.subscribeToGearEvent('MessagesDispatched', handleStateChange);

    return () => {
      clearInterval(interval);
      unsub?.then((unsubCallback) => unsubCallback());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, programId, wasm, functionName]);

  useEffect(() => {
    if (lesson && lesson.step < 2) return;
    if (state) {
      const { fed, rested, entertained } = state;

      setTamagotchi({
        ...tamagotchi,
        ...state,
        isDead: [fed, rested, entertained].reduce((sum, a) => sum + a) === 0,
      } as TamagotchiState);
    }
  }, [state]);
}
