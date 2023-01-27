import { AnyJson } from '@polkadot/types/types';
import { LessonsCtx } from '../context';
import { useReadState } from './use-read-state';
import { TamagotchiState } from '../types/lessons';
import { useContext, useEffect, useMemo } from 'react';

function useTamagotchiState<T>(payload?: AnyJson) {
  const { lesson, meta } = useContext(LessonsCtx);
  console.log({ lesson });
  return useReadState<T>(lesson?.programId, meta, payload);
}

export function useTamagotchi() {
  const { lesson } = useContext(LessonsCtx);
  const payload = useMemo(() => ({}), []);
  const { state } = useTamagotchiState<TamagotchiState>(payload);

  useEffect(() => {
    // setTamagotchi(state);
    console.log({ state, lesson });

    // return () => setTamagotchi(undefined);
  }, [lesson, state]);

  return state;
}
