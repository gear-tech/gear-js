import { AnyJson } from '@polkadot/types/types';
import { useLesson } from '../context';
import { useReadState } from './use-read-state';
import { TamagotchiState } from '../types/lessons';
import { useEffect } from 'react';

const payload = {};

export function useReadTamagotchi<T>(payload?: AnyJson) {
  const { lesson, meta } = useLesson();
  console.log({ lesson, meta });
  return useReadState<T>(lesson?.programId, meta, payload);
}

export function useTamagotchi() {
  const { setTamagotchi } = useLesson();
  const { state } = useReadTamagotchi<TamagotchiState>(payload);

  useEffect(() => {
    if (state) setTamagotchi(state);
    console.log('useTamagotchi', { state });
  }, [setTamagotchi, state]);
}
